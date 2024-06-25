import React from 'react';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';

const CapRateAndValuation = ({ formData, handleChange, results, formatCurrency }) => (
  <div className="form-section">
    <h2>Cap Rate and Valuation</h2>
    <div className="result-item">
      <span>Purchase Price</span> <span>{formatCurrency(formData.purchasePrice)}</span>
    </div>
    <div className="result-item">
      <span>Dollar per Square Foot</span> <span><strong>{results.dollarPerSquareFoot !== undefined ? formatCurrency(results.dollarPerSquareFoot) : ''}</strong></span>
    </div>
    <div className="form-group">
      <label>Desired Cap Rate (%)</label>
      <FormattedPercentInput step="1.00" name="desiredCapRate" value={formData.desiredCapRate} onChange={handleChange} decimalPlaces={0} />
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>Property Valuation (Ideal Offer Price)</span> <span><strong>{results.propertyValuation !== undefined ? formatCurrency(results.propertyValuation) : ''}</strong></span>
    </div>
    <div className="result-item-bottom">
      <span>Cap Rate</span> <span><strong>{results.capRate !== undefined ? (results.capRate * 100).toFixed(2) + '%' : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
  </div>
);

export default CapRateAndValuation;
