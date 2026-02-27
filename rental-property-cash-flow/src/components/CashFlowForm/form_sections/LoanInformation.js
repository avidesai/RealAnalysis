import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const LoanInformation = ({ formData, handleChange }) => (
  <div className="form-section">
    <div className="form-group">
      <label>
        Down Payment (%)
        <InfoTooltip description="Percentage of purchase price as down payment (Enter 100% if buying in cash)" />
      </label>
      <FormattedPercentInput step="5" name="downPaymentPercentage" value={formData.downPaymentPercentage} onChange={handleChange} decimalPlaces={0} min={1} max={100} />
    </div>
    <div className="form-group">
      <label>
        Mortgage Length (Years)
        <InfoTooltip description="Duration of the mortgage loan in years" />
      </label>
      <FormattedNumberInput step="1" name="lengthOfMortgage" value={formData.lengthOfMortgage} onChange={handleChange} min={1} max={50} />
    </div>
    <div className="form-group">
      <label>
        Mortgage Rate (%)
        <InfoTooltip description="Annual interest rate of the mortgage loan" />
      </label>
      <FormattedPercentInput step="0.10" name="mortgageRate" value={formData.mortgageRate} onChange={handleChange} min={0} max={30} />
    </div>
  </div>
);

export default LoanInformation;
