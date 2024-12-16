// /src/components/MyAccount/MyAccount.js

import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import './MyAccount.css';

const MyAccount = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <div className="my-account-loading">Loading...</div>;
  }

  return (
    <div className="my-account-container">
      <h2 className="my-account-title">My Account</h2>
      <div className="my-account-details">
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>City:</strong> {user.city}</p>
        <p><strong>State:</strong> {user.state}</p>
        <p><strong>Premium Status:</strong> {user.premiumStatus ? 'Active' : 'Inactive'}</p>
      </div>
      <button className="my-account-logout-button" onClick={logout}>Log Out</button>
    </div>
  );
};

export default MyAccount;
