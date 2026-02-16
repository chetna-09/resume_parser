from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import spacy
from supabase import create_client, Client
import os
from datetime import datetime
from dotenv import load_dotenv


load_dotenv(".env.local")
app = Flask(__name__)
CORS(app)

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Use 'en_core_web_md' if possible for better qualification matching
try:
    nlp = spacy.load("en_core_web_md")
except:
    nlp = spacy.load("en_core_web_sm")

def extract_substance(text):
    """
    Filters text to isolate ONLY:
    1. Skills (Technical Nouns/Proper Nouns)
    2. Qualifications (Degrees, Certifications, Education entities)
    """
    doc = nlp(text.lower())
    
    # 1. Extract Skills via POS Tagging (Nouns/Proper Nouns only)
    skills = [token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop]
    
    # 2. Extract Qualifications via Entity Recognition
    # Looks for Organizations, Degrees, or Laws/Certificates
    quals = [ent.text for ent in doc.ents if ent.label_ in ["ORG", "LAW", "EVENT"]]
    
    # Combine into a single 'substance' set
    substance_set = set(skills + quals)
    return substance_set, doc

def save_to_supabase(resume_text, job_desc, match_percent, found, missing, file_name):
    """Save analysis results to Supabase database"""
    try:
        # Insert resume record
        resume_data = {
            'file_name': file_name,
            'extracted_text': resume_text[:5000],  # Store first 5000 chars
            'file_size_kb': len(resume_text) // 1024,
        }
        resume_response = supabase.table('resumes').insert(resume_data).execute()
        resume_id = resume_response.data[0]['id']

        # Insert job description record
        job_data = {
            'title': 'Backend Analysis',
            'description': job_desc[:1000],  # Store first 1000 chars
            'input_mode': 'description',
        }
        job_response = supabase.table('job_descriptions').insert(job_data).execute()
        job_desc_id = job_response.data[0]['id']

        # Insert analysis result
        analysis_data = {
            'resume_id': resume_id,
            'job_description_id': job_desc_id,
            'match_percent': match_percent,
            'matched_skills': found,
            'missing_skills': missing,
            'matched_count': len(found),
            'missing_count': len(missing),
            'status': 'completed',
        }
        supabase.table('analysis_results').insert(analysis_data).execute()
        
        return True
    except Exception as e:
        print(f"Error saving to Supabase: {e}")
        return False

@app.route('/match', methods=['POST'])
def match_resume():
    try:
        job_desc_raw = request.form.get('job_desc', '')
        file = request.files['resume']
        
        # 1. Extract PDF Text
        with pdfplumber.open(file) as pdf:
            resume_raw = " ".join([page.extract_text() or "" for page in pdf.pages])

        # 2. Isolate Substance (Skills + Qualifications)
        jd_substance, jd_doc = extract_substance(job_desc_raw)
        res_substance, res_doc = extract_substance(resume_raw)

        # 3. Directed Matching (Resume checked AGAINST the Job Description)
        found = jd_substance.intersection(res_substance)
        missing = jd_substance.difference(res_substance)

        # 4. Scoring Logic
        # Keyword Score: Direct overlap count
        keyword_score = len(found) / len(jd_substance) if jd_substance else 0
        
        # Semantic Score: Intent overlap (e.g., BCA matching CS Degree)
        # We compare the 'vibe' of the JD substance to the Resume substance
        semantic_score = nlp(" ".join(list(found))).similarity(nlp(" ".join(list(jd_substance)))) if found else 0

        # 5. Hybrid Accuracy Formula
        # 60% Keyword Presence + 40% Semantic Intent
        final_accuracy = (keyword_score * 0.6) + (semantic_score * 0.4)
        
        result_percent = round(final_accuracy * 100, 2)
        if result_percent > 100: result_percent = 100.0

        # 6. Save to Supabase (optional - non-blocking)
        found_list = list(found)[:15]
        missing_list = list(missing)[:15]
        save_to_supabase(
            resume_text=resume_raw,
            job_desc=job_desc_raw,
            match_percent=result_percent,
            found=found_list,
            missing=missing_list,
            file_name=file.filename
        )

        return jsonify({
            "match_percent": result_percent,
            "found": found_list,
            "missing": missing_list,
            "status": "Targeted Skills & Qualifications Analysis Complete"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    """Get recent analysis history"""
    try:
        response = supabase.table('analysis_results')\
            .select('*, resumes(file_name), job_descriptions(title)')\
            .order('created_at', desc=True)\
            .limit(10)\
            .execute()
        
        return jsonify({
            "history": response.data,
            "count": len(response.data)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "live", "message": "Resume Parser API is running with Supabase integration!"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
