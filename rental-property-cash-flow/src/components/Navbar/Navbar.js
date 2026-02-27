import React, { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
        {isAuthenticated && (
          <NavLink
            to="/properties"
            className={({ isActive }) =>
              `navbar-link ${isActive ? 'navbar-link-active' : ''}`
            }
          >
            Properties
          </NavLink>
        )}
        <ThemeToggle />
        <div className="navbar-buttons">
          {isAuthenticated && (
            <button className="navbar-button" onClick={() => navigate('/myaccount')}>
              Account
            </button>
          )}
          <button className="navbar-button" onClick={handleAuthClick}>
            {isAuthenticated ? 'Sign out' : 'Sign in'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
