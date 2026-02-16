import { useState } from 'react';
import { useAuth } from './AuthContext';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

function Dashboard() {
  const [currentMode, setCurrentMode] = useState('description');
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const { user, signOut } = useAuth();

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out successfully', 'success');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showToast('Please select a PDF file', 'error');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      showToast('Resume uploaded successfully!', 'success');
    }
  };

  const analyzeResume = async () => {
    // Validation
    if (!selectedFile) {
      showToast('Please upload a resume first', 'error');
      return;
    }

    let jobDesc = '';
    if (currentMode === 'description') {
      jobDesc = jobDescription.trim();
    } else {
      jobDesc = `${targetRole.trim()} ${requiredSkills.trim()}`;
    }

    if (!jobDesc) {
      showToast('Please enter job requirements', 'error');
      return;
    }

    // Show loading state
    setLoading(true);
    setResults(null);

    // Prepare form data
    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('job_desc', jobDesc);

    try {
      const response = await fetch(`${API_BASE_URL}/match`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
      showToast('Analysis completed successfully!', 'success');

    } catch (error) {
      console.error('Error:', error);
      showToast('Backend connection error. Make sure the server is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score < 40) return 'score-low';
    if (score < 75) return 'score-medium';
    return 'score-high';
  };

  return (
    <div className="app">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type} show`}>
          {toast.message}
        </div>
      )}

      {/* Main Container */}
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="brand">
              <i className="fas fa-robot"></i>
              <h1>ResumeParser</h1>
              <span className="tagline">AI-Powered Resume Intelligence</span>
            </div>
            <div className="user-menu">
              <div className="user-info">
                <i className="fas fa-user-circle"></i>
                <span>{user?.email}</span>
              </div>
              <button className="logout-btn" onClick={handleSignOut}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Panel - Input */}
          <div className="input-panel">
            <div className="tabs">
              <button
                className={`tab ${currentMode === 'description' ? 'active' : ''}`}
                onClick={() => setCurrentMode('description')}
              >
                <i className="fas fa-file-alt"></i> Description Mode
              </button>
              <button
                className={`tab ${currentMode === 'keyword' ? 'active' : ''}`}
                onClick={() => setCurrentMode('keyword')}
              >
                <i className="fas fa-key"></i> Keyword Mode
              </button>
            </div>

            {/* Description Mode */}
            <div className={`tab-content ${currentMode === 'description' ? 'active' : ''}`}>
              <div className="form-group">
                <label><i className="fas fa-briefcase"></i> Job Description</label>
                <textarea
                  placeholder="Paste the full job description here..."
                  rows="8"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Keyword Mode */}
            <div className={`tab-content ${currentMode === 'keyword' ? 'active' : ''}`}>
              <div className="form-group">
                <label><i className="fas fa-user-tie"></i> Target Role</label>
                <input
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-cog"></i> Required Skills</label>
                <textarea
                  placeholder="e.g., Python, Machine Learning, React, AWS"
                  rows="5"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label><i className="fas fa-file-pdf"></i> Resume Upload</label>
              <input
                type="file"
                id="resumeFile"
                accept=".pdf"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <label
                htmlFor="resumeFile"
                className={`upload-label ${selectedFile ? 'file-selected' : ''}`}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                <div id="fileName">
                  {selectedFile ? (
                    <>
                      <i className="fas fa-file-pdf"></i> {selectedFile.name}
                    </>
                  ) : (
                    <>
                      <strong>Drop your PDF here</strong> or click to browse
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Analyze Button */}
            <button
              className="btn-analyze"
              onClick={analyzeResume}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> ANALYZING...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i> SCAN RESUME
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Results */}
          <div className="results-panel">
            {!results && !loading && (
              <div className="initial-state">
                <i className="fas fa-chart-pie"></i>
                <h3>Awaiting Analysis</h3>
                <p>Upload a resume and enter job requirements to begin</p>
              </div>
            )}

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Analyzing resume with AI...</p>
              </div>
            )}

            {results && !loading && (
              <div className="results">
                {/* Match Score */}
                <div className="score-card">
                  <h3>Match Score</h3>
                  <div className="score-circle-container">
                    <svg viewBox="0 0 200 200" className="score-svg">
                      <circle cx="100" cy="100" r="75" className="score-background" />
                      <circle
                        cx="100"
                        cy="100"
                        r="75"
                        className={`score-circle ${getScoreClass(results.match_percent)}`}
                        style={{
                          strokeDasharray: 471,
                          strokeDashoffset: 471 - (results.match_percent / 100) * 471
                        }}
                      />
                    </svg>
                    <div className={`score-text ${getScoreClass(results.match_percent)}`}>
                      {Math.round(results.match_percent)}%
                    </div>
                  </div>
                </div>

                {/* Matched Skills */}
                <div className="skills-section">
                  <h3>
                    <i className="fas fa-check-circle"></i>
                    Matched Skills ({results.found?.length || 0})
                  </h3>
                  <div className="skills-container">
                    {results.found && results.found.length > 0 ? (
                      results.found.map((skill, idx) => (
                        <span key={idx} className="skill-tag matched">{skill}</span>
                      ))
                    ) : (
                      <span className="skill-tag">No matches found</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="skills-section">
                  <h3>
                    <i className="fas fa-times-circle"></i>
                    Missing Skills ({results.missing?.length || 0})
                  </h3>
                  <div className="skills-container">
                    {results.missing && results.missing.length > 0 ? (
                      results.missing.map((skill, idx) => (
                        <span key={idx} className="skill-tag missing">{skill}</span>
                      ))
                    ) : (
                      <span className="skill-tag">All requirements met!</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
