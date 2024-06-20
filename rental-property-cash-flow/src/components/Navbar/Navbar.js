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
        <button className="navbar-button">Account</button>
        <button className="navbar-button">Login</button>
        <button className="navbar-button">Signup</button>
      </div>
    </nav>
  );
};

export default Navbar;
