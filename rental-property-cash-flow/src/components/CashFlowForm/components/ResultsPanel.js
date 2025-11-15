import React from 'react';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const ResultsPanel = ({
  results,
  formatCurrency,
  isCalculating,
}) => {
  if (!results || Object.keys(results).length === 0) {
    return (
      <div className="results-panel">
        <h3>Calculation Results</h3>
        <div className="no-results">
          <p>Enter your property details and click "Calculate" to see results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-panel">
      <h3>
        Analysis Results
        {isCalculating && <span className="calculating-indicator"> - Calculating...</span>}
      </h3>

      {/* Key Cash Flow Metrics - Most Important */}
      <div className="results-section key-metrics">
        <h4>Cash Flow & ROI</h4>
        <div className="result-item highlight">
          <span>
            Cash on Cash Return (ROI)
            <InfoTooltip description="Annual return on investment (Annual Cash Flow / Down Payment)" />
          </span>
          <span className={`result-value primary ${results.cashOnCashReturn >= 0 ? 'positive' : 'negative'}`}>
            {(results.cashOnCashReturn * 100).toFixed(2)}%
          </span>
        </div>
        <div className="result-item highlight">
          <span>
            Monthly Cash Flow
            <InfoTooltip description="Cash flow generated each month after expenses" />
          </span>
          <span className={`result-value primary ${results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(results.monthlyCashFlow)}
          </span>
        </div>
        <div className="result-item highlight">
          <span>
            Annual Cash Flow
            <InfoTooltip description="Cash flow generated each year after expenses" />
          </span>
          <span className={`result-value primary ${results.annualCashFlow >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(results.annualCashFlow)}
          </span>
        </div>
      </div>

      <div className="results-divider"></div>

      {/* Property & Financing Analysis */}
      <div className="results-section">
        <h4>🏠 Property & Financing</h4>
        <div className="result-item">
          <span>
            Cap Rate
            <InfoTooltip description="Yearly ROI of property if bought with cash (Yearly net operating income / Purchase price)" />
          </span>
          <span className="result-value financial-value percentage neutral">{(results.capRate * 100).toFixed(2)}%</span>
        </div>
        <div className="result-item">
          <span>
            Gross Rent Multiplier
            <InfoTooltip description="Ratio of purchase price to gross rental income (Purchase price / Annual gross rental income)" />
          </span>
          <span className="result-value financial-value neutral">{results.grossRentMultiplier.toFixed(2)}</span>
        </div>
        <div className="result-item">
          <span>Down Payment</span>
          <span className="result-value financial-value currency negative">-{formatCurrency(results.downPayment)}</span>
        </div>
        <div className="result-item">
          <span>Loan Amount</span>
          <span className="result-value financial-value currency negative">-{formatCurrency(results.loanAmount)}</span>
        </div>
        <div className="result-item">
          <span>Monthly Mortgage Payment</span>
          <span className="result-value financial-value currency negative">-{formatCurrency(results.monthlyMortgagePayment)}</span>
        </div>
      </div>

      <div className="results-divider"></div>

      {/* Income Analysis */}
      <div className="results-section">
        <h4>📈 Income Analysis</h4>
        <div className="result-item">
          <span>Monthly Rental Income</span>
          <span className="result-value financial-value currency positive">{formatCurrency(results.monthlyRentalIncome)}</span>
        </div>
        <div className="result-item">
          <span>Vacancy Loss</span>
          <span className="result-value financial-value currency negative">-{formatCurrency(results.vacancyLoss)}</span>
        </div>
        <div className="result-item">
          <span>Monthly Gross Income</span>
          <span className="result-value financial-value currency positive">{formatCurrency(results.monthlyGrossIncome)}</span>
        </div>
      </div>

      <div className="results-divider"></div>

      {/* Expense Analysis */}
      <div className="results-section">
        <h4>💸 Expense Breakdown</h4>
        <div className="result-item">
          <span>Property Management Fees</span>
          <span className="result-value financial-value currency negative">-{formatCurrency(results.propertyManagementFees)}</span>
        </div>
        <div className="result-item">
          <span>Property Tax</span>
          <span className="result-value financial-value currency negative">-{formatCurrency(results.propertyTax)}</span>
        </div>
        <div className="result-item">
          <span>Monthly Operating Expenses</span>
          <span className="result-value financial-value currency negative">-{formatCurrency(results.monthlyOperatingExpenses)}</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
