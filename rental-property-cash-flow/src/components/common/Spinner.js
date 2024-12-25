// src/components/common/Spinner.js
import React from 'react';

const Spinner = () => (
  <div className="global-loading-overlay">
    <div className="global-spinner">
      <div className="global-spinner-inner"></div>
    </div>
    <span className="sr-only">Loading...</span>
  </div>
);

export default Spinner;