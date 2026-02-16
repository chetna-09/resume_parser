import { useState } from 'react';
import { useAuth } from './AuthContext';
import './Auth.css';

function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { signIn, resetPassword } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResetSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error);
    } else {
      setResetSuccess(true);
    }
    setLoading(false);
  };

  if (forgotPassword) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <i className="fas fa-key auth-icon"></i>
            <h2>Reset Password</h2>
            <p>Enter your email to receive a password reset link</p>
          </div>

          {error && (
            <div className="auth-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {resetSuccess && (
            <div className="auth-success">
              <i className="fas fa-check-circle"></i> Password reset email sent! Check your inbox.
            </div>
          )}

          <form onSubmit={handlePasswordReset} className="auth-form">
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
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Send Reset Link
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <button
              className="auth-link"
              onClick={() => {
                setForgotPassword(false);
                setError('');
                setResetSuccess(false);
              }}
            >
              <i className="fas fa-arrow-left"></i> Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <i className="fas fa-robot auth-icon"></i>
          <h2>Welcome Back</h2>
          <p>Sign in to access ResumeParser</p>
        </div>

        {error && (
          <div className="auth-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
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

          <div className="auth-options">
            <button
              type="button"
              className="forgot-password"
              onClick={() => setForgotPassword(true)}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <button className="auth-link" onClick={onSwitchToSignup}>
            Create Account <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
