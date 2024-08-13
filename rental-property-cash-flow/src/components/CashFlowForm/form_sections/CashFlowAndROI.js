import React from 'react';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const CashFlowAndROI = ({
  calculateValues,
  resetForm,
  results,
  formatCurrency,
  isCalculateDisabled,
  clickCount,
  calculationLimit,
}) => (
  <div className="form-section">
    <h2>Cash Flow and ROI</h2>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>
        Cash on Cash Return (ROI)
        <InfoTooltip description="Annual return on investment (Annual Cash Flow / Down Payment)" />
      </span>
      <span><strong>{results.cashOnCashReturn !== undefined ? (results.cashOnCashReturn * 100).toFixed(2) + '%' : ''}</strong></span>
    </div>
    <div className="result-item-bottom">
      <span>
        Monthly Cash Flow
        <InfoTooltip description="Cash flow generated each month after expenses" />
      </span>
      <span className={results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}>
        <strong>{results.monthlyCashFlow !== undefined ? formatCurrency(results.monthlyCashFlow) : ''}</strong>
      </span>
    </div>
    <div className="result-item-bottom">
      <span>
        Annual Cash Flow
        <InfoTooltip description="Cash flow generated each year after expenses" />
      </span>
      <span className={results.annualCashFlow >= 0 ? 'positive' : 'negative'}>
        <strong>{results.annualCashFlow !== undefined ? formatCurrency(results.annualCashFlow) : ''}</strong>
      </span>
    </div>
    <div className="form-divider"></div>
    <div className="button-container">
      <button
        type="button"
        className={`calculate-button ${isCalculateDisabled ? 'disabled' : ''}`}
        onClick={calculateValues}
        disabled={isCalculateDisabled}
      >
        {isCalculateDisabled ? 'Upgrade for More' : 'Calculate'}
      </button>
      <button type="button" className="reset-button" onClick={resetForm}>Reset</button>
    </div>
    <div className={`calculations-left ${isCalculateDisabled ? 'zero' : ''}`}>
      <strong className="count">
        {isCalculateDisabled ? 'No calculations left' : `${calculationLimit - clickCount} calculations left`}
      </strong>
    </div>
  </div>
);

export default CashFlowAndROI;
