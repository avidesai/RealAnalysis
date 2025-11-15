// LoanInformation.js

import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const LoanInformation = ({ formData, handleChange, results, formatCurrency }) => (
  <div className="form-section">
    <div className="form-group">
      <label>
        Down Payment Percentage (%)
        <InfoTooltip description="Percentage of purchase price as down payment (Enter 100% if buying in cash)" />
      </label>
      <FormattedPercentInput step="5.00" name="downPaymentPercentage" value={formData.downPaymentPercentage} onChange={handleChange} decimalPlaces={0} />
    </div>
    <div className="form-group">
      <label>
        Mortgage Length (Years)
        <InfoTooltip description="Duration of the mortgage loan in years" />
      </label>
      <FormattedNumberInput step="1" name="lengthOfMortgage" value={formData.lengthOfMortgage} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Mortgage Rate (%)
        <InfoTooltip description="Annual interest rate of the mortgage loan" />
      </label>
      <FormattedPercentInput step="0.10" name="mortgageRate" value={formData.mortgageRate} onChange={handleChange} />
    </div>
  </div>
);

export default LoanInformation;
