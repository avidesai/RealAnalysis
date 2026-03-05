import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CashFlowForm from './components/CashFlowForm/CashFlowForm';
import SharedAnalysis from './components/CashFlowForm/SharedAnalysis';
import PropertiesPage from './components/Properties/PropertiesPage';
import LogIn from './components/LogInSignUp/LogIn/LogIn';
import SignUp from './components/LogInSignUp/SignUp/SignUp';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import MyAccount from './components/MyAccount/MyAccount';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthModal from './components/AuthModal/AuthModal';
import Spinner from './components/common/Spinner';
import AuthContext from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';

const App = () => {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <Spinner />;
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<CashFlowForm />} />
              <Route path="/shared/:token" element={<SharedAnalysis />} />
              <Route
                path="/properties"
                element={
                  <PrivateRoute>
                    <PropertiesPage />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<LogIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route
                path="/myaccount"
                element={
                  <PrivateRoute>
                    <MyAccount />
                  </PrivateRoute>
                }
              />
            </Routes>
            <AuthModal />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
