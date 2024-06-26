import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const LoanInformation = ({ formData, handleChange, results, formatCurrency }) => (
  <div className="form-section">
    <h2>Loan Information</h2>
    <div className="form-group">
      <label>
        Down Payment Percentage (%)
        <InfoTooltip description="The percentage of the purchase price to be paid upfront as a down payment." />
      </label>
      <FormattedPercentInput step="5.00" name="downPaymentPercentage" value={formData.downPaymentPercentage} onChange={handleChange} decimalPlaces={0} />
    </div>
    <div className="result-item">
      <span>
        Down Payment
      </span>
      <span><strong>{results.downPayment !== undefined ? formatCurrency(results.downPayment) : ''}</strong></span>
    </div>
    <div className="result-item">
      <span>
        Loan Amount
      </span>
      <span><strong>{results.loanAmount !== undefined ? formatCurrency(results.loanAmount) : ''}</strong></span>
    </div>
    <div className="form-group">
      <label>
        Length of Mortgage (years)
        <InfoTooltip description="The duration of the mortgage loan in years." />
      </label>
      <FormattedNumberInput step="1" name="lengthOfMortgage" value={formData.lengthOfMortgage} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Mortgage Rate (%)
        <InfoTooltip description="The annual interest rate of the mortgage." />
      </label>
      <FormattedPercentInput step="0.10" name="mortgageRate" value={formData.mortgageRate} onChange={handleChange} />
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>
        Monthly Mortgage Payment
        <InfoTooltip description="The monthly payment made towards the mortgage." />
      </span>
      <span className="negative"><strong>{results.monthlyMortgagePayment !== undefined ? formatCurrency(results.monthlyMortgagePayment) : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
  </div>
);

export default LoanInformation;
