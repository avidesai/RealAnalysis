import React from 'react';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const NetOperatingIncome = ({ results, formatCurrency }) => (
  <div className="form-section">
    <h2>Net Operating Income</h2>
    <div className="result-item">
      <span>
        Monthly Operating Income
        <InfoTooltip description="The total monthly income after accounting for vacancy losses." />
      </span>
      <span className='positive'><strong>{results.monthlyGrossIncome !== undefined ? formatCurrency(results.monthlyGrossIncome) : ''}</strong></span>
    </div>
    <div className="result-item">
      <span>
        Monthly Operating Expenses
        <InfoTooltip description="The total monthly expenses to operate the property." />
      </span>
      <span className='negative'><strong>{results.monthlyOperatingExpenses !== undefined ? formatCurrency(results.monthlyOperatingExpenses) : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>
        Monthly Net Operating Income
        <InfoTooltip description="The difference between the monthly operating income and expenses." />
      </span>
      <span className="positive"><strong>{results.monthlyGrossIncome !== undefined && results.monthlyOperatingExpenses !== undefined ? formatCurrency(results.monthlyGrossIncome - results.monthlyOperatingExpenses) : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
  </div>
);

export default NetOperatingIncome;
