import React from 'react';

const CashFlowAndROI = ({ calculateValues, results, formatCurrency }) => (
  <div className="form-section">
    <h2>Cash Flow and ROI</h2>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>Cash on Cash Return (ROI)</span> <span><strong>{results.cashOnCashReturn !== undefined ? (results.cashOnCashReturn * 100).toFixed(2) + '%' : ''}</strong></span>
    </div>
    <div className="result-item-bottom">
      <span>Monthly Cash Flow</span> 
      <span className={results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}>
        <strong>{results.monthlyCashFlow !== undefined ? formatCurrency(results.monthlyCashFlow) : ''}</strong>
      </span>
    </div>
    <div className="result-item-bottom">
      <span>Annual Cash Flow</span> 
      <span className={results.annualCashFlow >= 0 ? 'positive' : 'negative'}>
        <strong>{results.annualCashFlow !== undefined ? formatCurrency(results.annualCashFlow) : ''}</strong>
      </span>
    </div>
    <div className="form-divider"></div>
    <button type="button" className="calculate-button" onClick={calculateValues}>Calculate</button>
  </div>
);

export default CashFlowAndROI;
