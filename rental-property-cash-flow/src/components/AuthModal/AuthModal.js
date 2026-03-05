import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import '../LogInSignUp/Form.css';
import './AuthModal.css';

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const AuthModal = () => {
  const { login, register, showAuthModal, closeAuthModal, onAuthSuccess } = useContext(AuthContext);
  const { addToast } = useToast();
  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup fields
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset form state when modal opens/closes or tab switches
  useEffect(() => {
    setError('');
    setLoading(false);
    setEmail('');
    setPassword('');
    setShowLoginPassword(false);
    setSignupData({ firstName: '', lastName: '', email: '', password: '' });
    setConfirmPassword('');
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
  }, [showAuthModal, tab]);

  // ESC to close
  useEffect(() => {
    if (!showAuthModal) return;
    const handleEsc = (e) => { if (e.key === 'Escape') closeAuthModal(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showAuthModal, closeAuthModal]);

  if (!showAuthModal) return null;

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      onAuthSuccess();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (signupData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    const result = await register(signupData);
    if (result.success) {
      addToast('Account created! Welcome to CapRate.io', 'success');
      onAuthSuccess();
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-card auth-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <button className="modal-close" onClick={closeAuthModal}>&times;</button>
        </div>

        <div className="auth-modal-tabs">
          <button
            className={`auth-modal-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Sign in
          </button>
          <button
            className={`auth-modal-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => setTab('signup')}
          >
            Sign up
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="modal-email">Email</label>
              <input
                id="modal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="auth-field auth-field-password">
              <label htmlFor="modal-password">Password</label>
              <input
                id="modal-password"
                type={showLoginPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                tabIndex={-1}
                aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
              >
                {showLoginPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="auth-forgot">
              <Link to="/forgot-password" onClick={closeAuthModal}>Forgot password?</Link>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="auth-form">
            <div className="auth-row">
              <div className="auth-field">
                <label htmlFor="modal-firstName">First name</label>
                <input
                  id="modal-firstName"
                  name="firstName"
                  value={signupData.firstName}
                  onChange={handleSignupChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="auth-field">
                <label htmlFor="modal-lastName">Last name</label>
                <input
                  id="modal-lastName"
                  name="lastName"
                  value={signupData.lastName}
                  onChange={handleSignupChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="modal-signup-email">Email</label>
              <input
                id="modal-signup-email"
                name="email"
                type="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field auth-field-password">
              <label htmlFor="modal-signup-password">Password</label>
              <input
                id="modal-signup-password"
                name="password"
                type={showSignupPassword ? 'text' : 'password'}
                value={signupData.password}
                onChange={handleSignupChange}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                tabIndex={-1}
                aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
              >
                {showSignupPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <div className="auth-field auth-field-password">
              <label htmlFor="modal-confirm-password">Confirm password</label>
              <input
                id="modal-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
