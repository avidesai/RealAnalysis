import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="navbar-logo-link">
          <span className="navbar-title">cashflow.io</span>
        </NavLink>
      </div>
      <div className="navbar-right">
        <div className="navbar-buttons">
          <NavLink to="/premium" className="navbar-button premium-button">Upgrade to Premium</NavLink>
          <button className="navbar-button">My Account</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
