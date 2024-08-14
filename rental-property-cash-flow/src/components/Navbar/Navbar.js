// Navbar.js

import React, { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Added logout function from context
  const navigate = useNavigate();

  const handleUpgradeClick = async () => {
    if (!user) {
      navigate('/login');
    } else {
      try {
        const response = await fetch('http://localhost:8000/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }

        const session = await response.json();
        if (session.id) {
          window.location.href = `https://checkout.stripe.com/pay/${session.id}`;
        } else {
          alert('Failed to create checkout session');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during checkout. Please try again.');
      }
    }
  };

  const handleAuthClick = () => {
    if (user) {
      logout(); // Logs the user out
      window.location.reload(); // Refresh the page after logout
    } else {
      navigate('/login'); // Navigate to the login page
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
