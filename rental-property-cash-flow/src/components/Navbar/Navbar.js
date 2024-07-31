// Navbar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import cashImg from '../../assets/cash.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/">
          <img src={cashImg} alt="Cash Flow Logo" className="navbar-logo" />
        </NavLink>
      </div>
      <div className="navbar-right">
        <div className="navbar-buttons">
          <NavLink to="/premium" className="navbar-button premium-button">Upgrade to Premium</NavLink>
          <button className="navbar-button">Learn More</button>
          <button className="navbar-button">My Account</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
