import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import './MyAccount.css';

const MyAccount = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-container">
      <h2>My Account</h2>
      <div className="account-details">
        <p><strong>First Name:</strong> {user.firstName}</p>
        <p><strong>Last Name:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>City:</strong> {user.city}</p>
        <p><strong>State:</strong> {user.state}</p>
        <p><strong>Premium Status:</strong> {user.premiumStatus ? 'Active' : 'Inactive'}</p>
      </div>
      <button className="logout-button" onClick={logout}>Log Out</button>
    </div>
  );
};

export default MyAccount;
