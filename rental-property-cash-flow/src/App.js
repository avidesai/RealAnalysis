// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CashFlowForm from './components/CashFlowForm/CashFlowForm';
import LogIn from './components/LogInSignUp/LogIn/LogIn';
import SignUp from './components/LogInSignUp/SignUp/SignUp';
import MyAccount from './components/MyAccount/MyAccount';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Spinner from './components/common/Spinner';
import AuthContext from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

const App = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <Spinner />;
  }

  return (
    <ThemeProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<CashFlowForm />}
            />
            <Route
              path="/premium"
              element={<CashFlowForm />}
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
    </ThemeProvider>
  );
};

export default App;