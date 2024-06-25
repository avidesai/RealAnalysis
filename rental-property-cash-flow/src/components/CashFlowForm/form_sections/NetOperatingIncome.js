import React from 'react';

const NetOperatingIncome = ({ results, formatCurrency }) => (
  <div className="form-section">
    <h2>Net Operating Income</h2>
    <div className="result-item">
      <span>Monthly Operating Income</span> <span className='positive'><strong>{results.monthlyGrossIncome !== undefined ? formatCurrency(results.monthlyGrossIncome) : ''}</strong></span>
    </div>
    <div className="result-item">
      <span>Monthly Operating Expenses</span> <span className='negative'><strong>{results.monthlyOperatingExpenses !== undefined ? formatCurrency(results.monthlyOperatingExpenses) : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>Monthly Net Operating Income</span> <span className="positive"><strong>{results.monthlyGrossIncome !== undefined && results.monthlyOperatingExpenses !== undefined ? formatCurrency(results.monthlyGrossIncome - results.monthlyOperatingExpenses) : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
  </div>
);

export default NetOperatingIncome;
