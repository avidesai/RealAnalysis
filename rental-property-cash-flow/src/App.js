// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CashFlowForm from './components/CashFlowForm/CashFlowForm';

const App = () => {
  return (
    <Router basename="/RealAnalysis">
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<CashFlowForm />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
