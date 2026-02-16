# 🚀 ResumeParser - AI-Powered Resume Analysis

A full-stack application for analyzing resumes against job descriptions using NLP and AI.

## 📁 Project Structure

```
resume_parser/
├── backend/              # Python Flask API
│   ├── nlp_resume_parser_with_supabase.py
│   ├── requirements.txt
│   ├── .env.example
│   └── docker-compose.yml
│
├── frontend-react/       # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx              # Main app with auth routing
│   │   ├── Dashboard.jsx        # Resume analysis dashboard
│   │   ├── Login.jsx            # Login page
│   │   ├── Signup.jsx           # Signup page
│   │   ├── AuthContext.jsx      # Authentication context
│   │   ├── Auth.css             # Auth page styles
│   │   └── App.css              # Dashboard styles
│   ├── package.json
│   ├── vite.config.js
│   └── DEPLOYMENT.md
│
└── database/            # SQL scripts
    └── setup.sql        # Supabase database setup
```

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with Supabase Auth
- 📄 **PDF Resume Parsing** - Extract text from PDF resumes
- 🤖 **AI-Powered Analysis** - NLP-based skill matching using spaCy
- 📊 **Match Scoring** - Percentage-based compatibility scores
- 🎯 **Skill Tracking** - Matched and missing skills visualization
- 💾 **Data Persistence** - Save analysis results to Supabase
- 🔒 **Row Level Security** - User-specific data access
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Supabase JS** - Authentication & database client
- **CSS3** - Modern styling with gradients

### Backend
- **Python 3.9+** - Server language
- **Flask** - Web framework
- **spaCy** - NLP processing
- **pdfplumber** - PDF text extraction
- **Supabase** - PostgreSQL database & auth

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase account ([create free account](https://supabase.com))

### 1. Database Setup

1. Create a new project on [Supabase](https://app.supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the entire contents of `database/setup.sql`
4. Paste and run it in the SQL Editor
5. ✅ Your database is ready!

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy language model
python -m spacy download en_core_web_sm
# For better results (larger model):
python -m spacy download en_core_web_md

# Create .env file
copy .env.example .env
# Edit .env and add your Supabase credentials

# Run the server
python nlp_resume_parser_with_supabase.py
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend-react

# Install dependencies
npm install

# Create .env file
copy .env.example .env
# Edit .env and add:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_API_BASE_URL=http://127.0.0.1:5000

# Run development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://127.0.0.1:5000
```

Get these values from:
- Supabase Dashboard → Project Settings → API

## 🚀 Usage

1. **Sign Up** - Create a new account
2. **Verify Email** - Check your email for verification link
3. **Log In** - Sign in with your credentials
4. **Upload Resume** - Select a PDF resume file
5. **Enter Job Details** - Use description mode or keyword mode
6. **Analyze** - Click "SCAN RESUME" to get results
7. **View Results** - See match score and skill breakdown

## 📊 Database Schema

The setup.sql file creates:

- **profiles** - User profile information
- **resumes** - Uploaded resume data
- **job_descriptions** - Job posting details
- **analysis_results** - Analysis outcomes
- **RLS Policies** - Secure data access
- **Storage Bucket** - For resume file storage

## 🔒 Security Features

- ✅ Email verification on signup
- ✅ Secure password hashing (handled by Supabase)
- ✅ Row Level Security (RLS) on all tables
- ✅ JWT-based authentication
- ✅ CORS protection
- ✅ User-specific data isolation

## 🚀 Deployment

See `frontend-react/DEPLOYMENT.md` for detailed deployment instructions.

### Quick Deploy Options:

**Frontend:**
- Vercel (Recommended)
- Netlify
- AWS Amplify

**Backend:**
- Render.com
- Railway.app
- Heroku
- AWS EC2

## 🧪 Testing

### Test Backend API
```bash
# Test server is running
curl http://localhost:5000/match

# Test with sample data (use Postman or similar)
POST http://localhost:5000/match
Body: FormData
  - resume: [PDF file]
  - job_desc: "Looking for Python developer with React experience"
```

### Test Frontend
```bash
cd frontend-react
npm run build
npm run preview
```

## 📝 API Endpoints

### Backend API

**POST /match**
- Analyzes resume against job description
- **Body:** FormData with `resume` (PDF) and `job_desc` (string)
- **Returns:** Match percentage, matched skills, missing skills

**GET /history** (if implemented)
- Retrieves past analysis results
- **Headers:** Authorization with Supabase JWT

## 🎨 Customize

### Change Theme Colors
Edit `frontend-react/src/App.css`:
```css
:root {
    --primary: #2563eb;      /* Main blue */
    --secondary: #8b5cf6;    /* Purple accent */
    --success: #22c55e;      /* Green */
    --danger: #ef4444;       /* Red */
}
```

### Change Auth Page Gradient
Edit `frontend-react/src/Auth.css`:
```css
.auth-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🐛 Troubleshooting

### Backend Issues
- **spaCy model not found:** Run `python -m spacy download en_core_web_sm`
- **Port 5000 in use:** Change port in `nlp_resume_parser_with_supabase.py`
- **Supabase connection error:** Check .env credentials

### Frontend Issues
- **Build error:** Delete `node_modules` and run `npm install` again
- **Auth not working:** Verify Supabase URL and keys in .env
- **CORS error:** Ensure backend has CORS enabled for frontend URL

### Database Issues
- **RLS blocking queries:** Check if user is authenticated
- **Policies not working:** Verify setup.sql was run completely
- **Storage upload fails:** Check storage bucket policies

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [spaCy Documentation](https://spacy.io/usage)
- [Flask Documentation](https://flask.palletsprojects.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 💡 Support

For issues or questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review Supabase logs for auth/database errors

---

**Built with ❤️ using React, Flask, and Supabase**
