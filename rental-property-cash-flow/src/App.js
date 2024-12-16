// /src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CashFlowForm from './components/CashFlowForm/CashFlowForm';
import PremiumAnalysisLayout from './components/PremiumCashFlowForm/PremiumAnalysisLayout'; // Updated to use the layout
import LogIn from './components/LogInSignUp/LogIn/LogIn';
import SignUp from './components/LogInSignUp/SignUp/SignUp';
import MyAccount from './components/MyAccount/MyAccount';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthContext from './context/AuthContext';
import './App.css';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Or a global spinner component
  }

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={user && user.premiumStatus ? <PremiumAnalysisLayout /> : <CashFlowForm />} 
          />
          <Route 
            path="/premium" 
            element={user && user.premiumStatus ? <PremiumAnalysisLayout /> : <CashFlowForm />} 
          />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/myaccount"
            element={
              <PrivateRoute>
                <MyAccount />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};


export default App;
