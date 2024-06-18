// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import cashImg from '../../assets/cash.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={cashImg} alt="Cash Flow Logo" className="navbar-logo" />
        </Link>
      </div>
      <div className="navbar-right">
        <button className="navbar-button">Account</button>
        <button className="navbar-button">Login</button>
        <button className="navbar-button">Signup</button>
      </div>
    </nav>
  );
};

export default Navbar;
