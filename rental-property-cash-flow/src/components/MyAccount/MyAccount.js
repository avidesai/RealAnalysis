import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './MyAccount.css';

const MyAccount = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <div className="account-page"><p>Loading...</p></div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="account-page">
      <div className="account-card">
        <h1>Account</h1>

        <div className="account-fields">
          <div className="account-row">
            <span className="account-label">Name</span>
            <span className="account-value">{user.firstName} {user.lastName}</span>
          </div>
          <div className="account-row">
            <span className="account-label">Email</span>
            <span className="account-value">{user.email}</span>
          </div>
          {user.city && user.state && (
            <div className="account-row">
              <span className="account-label">Location</span>
              <span className="account-value">{user.city}, {user.state}</span>
            </div>
          )}
          <div className="account-row">
            <span className="account-label">Plan</span>
            <span className="account-value">
              {user.premiumStatus ? (
                <span className="plan-badge premium">Premium</span>
              ) : (
                <span className="plan-badge free">Free</span>
              )}
            </span>
          </div>
        </div>

        <button className="account-logout" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
