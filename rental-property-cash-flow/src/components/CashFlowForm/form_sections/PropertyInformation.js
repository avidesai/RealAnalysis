import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const PropertyInformation = ({
  formData,
  handleChange,
  calculateValues,
  resetForm,
  results,
  formatCurrency,
  isCalculateDisabled,
  clickCount,
  calculationLimit,
}) => (
  <div className="form-section">
    <div className="form-group">
      <label>
        Purchase Price
        <InfoTooltip description="The price paid for the property" />
      </label>
      <FormattedNumberInput step="10000" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Square Feet
        <InfoTooltip description="Total building square footage" />
      </label>
      <FormattedNumberInput step="100" name="squareFeet" value={formData.squareFeet} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Monthly Rent per Unit
        <InfoTooltip description="Average monthly rent per unit" />
      </label>
      <FormattedNumberInput step="100" name="monthlyRentPerUnit" value={formData.monthlyRentPerUnit} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Number of Units
        <InfoTooltip description="Number of units being rented out" />
      </label>
      <FormattedNumberInput step="1" name="numberOfUnits" value={formData.numberOfUnits} onChange={handleChange} />
    </div>
    <div className="button-container">
      <button
        type="button"
        className={`calculate-button ${isCalculateDisabled ? 'disabled' : ''}`}
        onClick={calculateValues}
      >
        {isCalculateDisabled ? 'Upgrade for More' : 'Calculate'}
      </button>
      <button type="button" className="reset-button" onClick={resetForm}>Reset</button>
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>
        Cap Rate
        <InfoTooltip description="Yearly ROI of property if bought with cash (Yearly net operating income / Purchase price)" />
      </span>
      <span><strong>{results.capRate !== undefined ? (results.capRate * 100).toFixed(2) + '%' : ''}</strong></span>
    </div>
    <div className="result-item-bottom">
      <span>
        Gross Rent Multiplier
        <InfoTooltip description="Ratio of purchase price to gross rental income (Purchase price / Annual gross rental income)" />
      </span>
      <span><strong>{results.grossRentMultiplier !== undefined ? results.grossRentMultiplier.toFixed(2) : ''}</strong></span>
    </div>
    <div className="result-item-bottom">
      <span>
        Dollar per Square Foot
        <InfoTooltip description="Purchase price divided by building square footage" />
      </span>
      <span><strong>{results.dollarPerSquareFoot !== undefined ? formatCurrency(results.dollarPerSquareFoot) : ''}</strong></span>
    </div>
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
  </div>
);

export default PropertyInformation;
