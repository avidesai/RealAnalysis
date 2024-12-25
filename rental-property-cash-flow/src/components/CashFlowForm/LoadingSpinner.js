// src/components/CashFlowForm/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => (
  <div className="loading-overlay" role="alert" aria-busy="true">
    <div className="spinner"></div>
    <span className="sr-only">Calculating results...</span>
  </div>
);

export default LoadingSpinner;