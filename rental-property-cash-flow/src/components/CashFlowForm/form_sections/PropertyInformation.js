import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const PropertyInformation = ({ formData, handleChange, calculateValues, resetForm, results, formatCurrency, isCalculateDisabled }) => (
  <div className="form-section">
    <div className="form-group">
      <label>
        Purchase Price
        <InfoTooltip description="The total cost to purchase the property." />
      </label>
      <FormattedNumberInput step="10000" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Square Feet
        <InfoTooltip description="Total building square footage." />
      </label>
      <FormattedNumberInput step="100" name="squareFeet" value={formData.squareFeet} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Monthly Rent per Unit
        <InfoTooltip description="The average monthly rental income per unit." />
      </label>
      <FormattedNumberInput step="100" name="monthlyRentPerUnit" value={formData.monthlyRentPerUnit} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Number of Units
        <InfoTooltip description="The number of units being rented." />
      </label>
      <FormattedNumberInput step="1" name="numberOfUnits" value={formData.numberOfUnits} onChange={handleChange} />
    </div>
    <div className="button-container">
      <button type="button" className="calculate-button" onClick={calculateValues} disabled={isCalculateDisabled}>Calculate</button>
      <button type="button" className="reset-button" onClick={resetForm}>Reset</button>
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>Cap Rate</span> <span><strong>{results.capRate !== undefined ? (results.capRate * 100).toFixed(2) + '%' : ''}</strong></span>
    </div>
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
  </div>
);

export default PropertyInformation;
