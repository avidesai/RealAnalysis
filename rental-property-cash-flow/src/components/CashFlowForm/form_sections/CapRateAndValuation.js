import React from 'react';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const CapRateAndValuation = ({ formData, handleChange, results, formatCurrency }) => (
  <div className="form-section">
    <h2>Cap Rate and Valuation</h2>
    <div className="result-item">
      <span>
        Purchase Price
        <InfoTooltip description="The total purchase price of the property." />
      </span>
      <span>{formatCurrency(formData.purchasePrice)}</span>
    </div>
    <div className="result-item">
      <span>
        Dollar per Square Foot
        <InfoTooltip description="Purchase price divided by the total square footage of the property." />
      </span>
      <span><strong>{results.dollarPerSquareFoot !== undefined ? formatCurrency(results.dollarPerSquareFoot) : ''}</strong></span>
    </div>
    <div className="form-group">
      <label>
        Desired Cap Rate (%)
        <InfoTooltip description="The desired capitalization rate for the property." />
      </label>
      <FormattedPercentInput step="1.00" name="desiredCapRate" value={formData.desiredCapRate} onChange={handleChange} decimalPlaces={0} />
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>
        Property Valuation (Ideal Offer Price)
        <InfoTooltip description="The valuation of the property based on the desired cap rate." />
      </span>
      <span><strong>{results.propertyValuation !== undefined ? formatCurrency(results.propertyValuation) : ''}</strong></span>
    </div>
    <div className="result-item-bottom">
      <span>
        Cap Rate
        <InfoTooltip description="The capitalization rate of the property." />
      </span>
      <span><strong>{results.capRate !== undefined ? (results.capRate * 100).toFixed(2) + '%' : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
  </div>
);

export default CapRateAndValuation;
