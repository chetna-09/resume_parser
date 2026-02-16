import { useState } from 'react';
import { useAuth } from './AuthContext';
import './Auth.css';

function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <i className="fas fa-check-circle auth-icon success"></i>
            <h2>Account Created!</h2>
            <p>Check your email to verify your account</p>
          </div>

          <div className="auth-success">
            <i className="fas fa-envelope-open"></i>
            <p>We've sent a verification email to <strong>{email}</strong></p>
            <p>Please click the link in the email to verify your account.</p>
          </div>

          <button 
            className="auth-button"
            onClick={onSwitchToLogin}
          >
            <i className="fas fa-sign-in-alt"></i> Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <i className="fas fa-user-plus auth-icon"></i>
          <h2>Create Account</h2>
          <p>Join ResumeParser today</p>
        </div>

        {error && (
          <div className="auth-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-field">
            <label>
              <i className="fas fa-user"></i> Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="form-field">
            <label>
              <i className="fas fa-envelope"></i> Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label>
              <i className="fas fa-lock"></i> Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>

          <div className="form-field">
            <label>
              <i className="fas fa-lock"></i> Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button className="auth-link" onClick={onSwitchToLogin}>
            Sign In <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
