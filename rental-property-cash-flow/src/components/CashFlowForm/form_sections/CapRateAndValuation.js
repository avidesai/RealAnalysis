import React from 'react';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const CapRateAndValuation = ({ formData, handleChange, results, formatCurrency }) => (
  <div className="form-section">
    <h2>Cap Rate and Valuation</h2>
    <div className="result-item">
      <span>
        Purchase Price
        <InfoTooltip description="Total price paid for the property" />
      </span>
      <span>{formatCurrency(formData.purchasePrice)}</span>
    </div>
    <div className="result-item">
      <span>
        Dollar per Square Foot
        <InfoTooltip description="Purchase price divided by building square footage" />
      </span>
      <span><strong>{results.dollarPerSquareFoot !== undefined ? formatCurrency(results.dollarPerSquareFoot) : ''}</strong></span>
    </div>
    <div className="form-group">
      <label>
        Desired Cap Rate (%)
        <InfoTooltip description="Desired capitalization rate for property (>8% is ideal for multifamily rentals)" />
      </label>
      <FormattedPercentInput step="1.00" name="desiredCapRate" value={formData.desiredCapRate} onChange={handleChange} decimalPlaces={0} />
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>
        Property Valuation (Ideal Offer Price)
        <InfoTooltip description="Valuation of the property based on the desired cap rate" />
      </span>
      <span><strong>{results.propertyValuation !== undefined ? formatCurrency(results.propertyValuation) : ''}</strong></span>
    </div>
    <div className="result-item-bottom">
      <span>
        Cap Rate
        <InfoTooltip description="Yearly ROI of property if bought with cash (Yearly net operating income / Purchase price) " />
      </span>
      <span><strong>{results.capRate !== undefined ? (results.capRate * 100).toFixed(2) + '%' : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
  </div>
);

export default CapRateAndValuation;
