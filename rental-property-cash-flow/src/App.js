// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CashFlowForm from './components/CashFlowForm/CashFlowForm';
import CashFlowFormPremium from './components/CashFlowPremium/CashFlowFormPremium';

const App = () => {
  return (
    <Router basename="/RealAnalysis">
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<CashFlowForm />} />
          <Route path="/premium" element={<CashFlowFormPremium />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
