import React, { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      window.location.href = 'https://buy.stripe.com/test_fZe02w8bz5lM2vmaEE';
    }
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo-link">
          <span className="navbar-title">CapRate.io</span>
        </NavLink>
      </div>
      <div className="navbar-right">
        <ThemeToggle />
        <div className="navbar-buttons">
          {isAuthenticated && user && !user.premiumStatus && (
            <button className="navbar-button premium-button" onClick={handleUpgradeClick}>
              Upgrade to Premium
            </button>
          )}
          {isAuthenticated && (
            <button className="navbar-button" onClick={() => navigate('/myaccount')}>
              My Account
            </button>
          )}
          <button className="navbar-button" onClick={handleAuthClick}>
            {isAuthenticated ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
