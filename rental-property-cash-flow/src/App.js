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
          <Route path="/premium" element={<CashFlowForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
