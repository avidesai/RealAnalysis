import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Updated to useNavigate
import AuthContext from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Updated to useNavigate

  const handleAccountClick = () => {
    if (user) {
      navigate('/myaccount');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo-link">
          <span className="navbar-title">caprate.io</span>
        </NavLink>
      </div>
      <div className="navbar-right">
        <div className="navbar-buttons">
          <NavLink to="/premium" className="navbar-button premium-button">Upgrade to Premium</NavLink>
          <button className="navbar-button" onClick={handleAccountClick}>My Account</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
