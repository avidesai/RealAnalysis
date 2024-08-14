// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CashFlowForm from './components/CashFlowForm/CashFlowForm';
import LogIn from './components/LogInSignUp/LogIn/LogIn';
import SignUp from './components/LogInSignUp/SignUp/SignUp';
import MyAccount from './components/MyAccount/MyAccount';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<CashFlowForm />} />
          <Route path="/premium" element={<CashFlowForm />} />
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
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
