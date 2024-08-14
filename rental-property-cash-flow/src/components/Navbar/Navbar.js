// Navbar.js

import React, { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      // Directly navigate to the predefined Stripe payment link
      window.location.href = 'https://buy.stripe.com/test_fZe02w8bz5lM2vmaEE';
    }
  };

  const handleAuthClick = () => {
    if (user) {
      logout();
      window.location.reload();
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
        <div className="navbar-buttons">
          <button className="navbar-button premium-button" onClick={handleUpgradeClick}>
            Upgrade to Premium
          </button>
          <button className="navbar-button" onClick={() => navigate('/myaccount')}>
            My Account
          </button>
          <button className="navbar-button" onClick={handleAuthClick}>
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
