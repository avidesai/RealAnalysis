import React, { useState } from 'react';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const ChevronIcon = ({ isOpen }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    className={`detail-chevron ${isOpen ? 'open' : ''}`}
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ResultsPanel = ({
  results,
  formData,
  formatCurrency,
}) => {
  const [openDetails, setOpenDetails] = useState({
    financing: true,
    income: false,
    expenses: false,
    brrrr: true,
  });

  const toggleDetail = (section) => {
    setOpenDetails(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!results) {
    return (
      <div className="results-panel">
        <h3>Analysis Results</h3>
        <div className="no-results">
          <div className="no-results-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 7h6m0 10v-3m-3 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p>Enter property details to see live results</p>
        </div>
      </div>
    );
  }

  const cocReturn = (results.cashOnCashReturn * 100).toFixed(2);
  const cocPct = results.cashOnCashReturn * 100;
  const capPct = results.capRate * 100;

  // Tiered color: green (good), neutral (normal), red (bad)
  const cocTier = cocPct >= 8 ? 'positive' : cocPct >= 0 ? 'neutral' : 'negative';
  const capTier = capPct >= 6 ? 'positive' : capPct >= 3 ? 'neutral' : 'negative';
  const cashFlowTier = results.monthlyCashFlow >= 200 ? 'positive' : results.monthlyCashFlow >= 0 ? 'neutral' : 'negative';

  return (
    <div className="results-panel">
      <div className="results-header">
        <h3>Analysis</h3>
        <span className="live-badge">Live</span>
      </div>

      {/* Hero KPI Cards */}
      <div className="kpi-grid">
        <div className={`kpi-card ${cocTier}`}>
          <div className="kpi-label">
            Cash on Cash Return
            <InfoTooltip description="Annual return on your cash invested (Annual Cash Flow / Down Payment)" />
          </div>
          <div className="kpi-value">{cocReturn}%</div>
        </div>

        <div className={`kpi-card ${capTier}`}>
          <div className="kpi-label">
            Cap Rate
            <InfoTooltip description="Annual return if purchased with all cash (Annual NOI / Purchase Price)" />
          </div>
          <div className="kpi-value">{(results.capRate * 100).toFixed(2)}%</div>
        </div>

        <div className={`kpi-card ${cashFlowTier}`}>
          <div className="kpi-label">
            Monthly Cash Flow
            <InfoTooltip description="Net monthly income after all expenses and mortgage" />
          </div>
          <div className="kpi-value">{formatCurrency(results.monthlyCashFlow)}</div>
        </div>

        <div className={`kpi-card ${cashFlowTier}`}>
          <div className="kpi-label">
            Yearly Cash Flow
            <InfoTooltip description="Net annual income after all expenses and mortgage" />
          </div>
          <div className="kpi-value">{formatCurrency(results.annualCashFlow)}</div>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="detail-sections">
        {/* Property & Financing */}
        <div className="detail-section">
          <button
            type="button"
            className="detail-toggle"
            onClick={() => toggleDetail('financing')}
          >
            <span>Property & Financing</span>
            <ChevronIcon isOpen={openDetails.financing} />
          </button>
          {openDetails.financing && (
            <div className="detail-content">
              <div className="detail-row">
                <span>Down Payment</span>
                <span className="detail-value">{formatCurrency(results.downPayment)}</span>
              </div>
              <div className="detail-row">
                <span>Loan Amount</span>
                <span className="detail-value">{formatCurrency(results.loanAmount)}</span>
              </div>
              <div className="detail-row">
                <span>Mortgage Payment</span>
                <span className="detail-value negative">{formatCurrency(results.monthlyMortgagePayment)}/mo</span>
              </div>
              <div className="detail-row">
                <span>Gross Rent Multiplier</span>
                <span className="detail-value">{results.grossRentMultiplier.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Income Analysis */}
        <div className="detail-section">
          <button
            type="button"
            className="detail-toggle"
            onClick={() => toggleDetail('income')}
          >
            <span>Income Analysis</span>
            <ChevronIcon isOpen={openDetails.income} />
          </button>
          {openDetails.income && (
            <div className="detail-content">
              <div className="detail-row">
                <span>Rental Income</span>
                <span className="detail-value positive">{formatCurrency(results.monthlyRentalIncome)}/mo</span>
              </div>
              <div className="detail-row">
                <span>Vacancy Loss</span>
                <span className="detail-value negative">-{formatCurrency(results.vacancyLoss)}/mo</span>
              </div>
              <div className="detail-row highlight-row">
                <span>Gross Income</span>
                <span className="detail-value">{formatCurrency(results.monthlyGrossIncome)}/mo</span>
              </div>
            </div>
          )}
        </div>

        {/* Expense Breakdown */}
        <div className="detail-section">
          <button
            type="button"
            className="detail-toggle"
            onClick={() => toggleDetail('expenses')}
          >
            <span>Expense Breakdown</span>
            <ChevronIcon isOpen={openDetails.expenses} />
          </button>
          {openDetails.expenses && (
            <div className="detail-content">
              <div className="detail-row">
                <span>Property Management</span>
                <span className="detail-value negative">-{formatCurrency(results.propertyManagementFees)}/mo</span>
              </div>
              <div className="detail-row">
                <span>Property Tax</span>
                <span className="detail-value negative">-{formatCurrency(results.propertyTax)}/mo</span>
              </div>
              <div className="detail-row highlight-row">
                <span>Operating Expenses</span>
                <span className="detail-value negative">-{formatCurrency(results.monthlyOperatingExpenses)}/mo</span>
              </div>
              <div className="detail-row highlight-row">
                <span>Monthly NOI</span>
                <span className={`detail-value ${results.monthlyNOI >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(results.monthlyNOI)}/mo
                </span>
              </div>
            </div>
          )}
        </div>

        {/* BRRRR Analysis */}
        {formData?.calculatorMode === 'brrrr' && results.brrrr && (
          <div className="detail-section">
            <button
              type="button"
              className="detail-toggle"
              onClick={() => toggleDetail('brrrr')}
            >
              <span>BRRRR Analysis</span>
              <ChevronIcon isOpen={openDetails.brrrr} />
            </button>
            {openDetails.brrrr && (
              <div className="detail-content">
                <div className="detail-row">
                  <span>Total Investment</span>
                  <span className="detail-value">{formatCurrency(results.brrrr.totalInvestment)}</span>
                </div>
                <div className="detail-row">
                  <span>New Loan (Refinance)</span>
                  <span className="detail-value">{formatCurrency(results.brrrr.newLoanAmount)}</span>
                </div>
                <div className="detail-row highlight-row">
                  <span>Cash Left in Deal</span>
                  <span className={`detail-value ${results.brrrr.cashLeftInDeal <= 0 ? 'positive' : ''}`}>
                    {formatCurrency(results.brrrr.cashLeftInDeal)}
                  </span>
                </div>
                <div className="detail-row">
                  <span>New Mortgage Payment</span>
                  <span className="detail-value negative">-{formatCurrency(results.brrrr.newMonthlyMortgage)}/mo</span>
                </div>
                <div className="detail-row">
                  <span>New Monthly Cash Flow</span>
                  <span className={`detail-value ${results.brrrr.newMonthlyCashFlow >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(results.brrrr.newMonthlyCashFlow)}/mo
                  </span>
                </div>
                <div className="detail-row highlight-row">
                  <span>BRRRR CoC Return</span>
                  <span className={`detail-value ${results.brrrr.brrrrCashOnCash >= 0.08 ? 'positive' : results.brrrr.brrrrCashOnCash >= 0 ? '' : 'negative'}`}>
                    {results.brrrr.brrrrCashOnCash === Infinity ? 'Infinite' : `${(results.brrrr.brrrrCashOnCash * 100).toFixed(2)}%`}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
