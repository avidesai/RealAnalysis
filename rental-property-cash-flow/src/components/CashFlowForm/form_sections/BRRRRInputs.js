import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';

const BRRRRInputs = ({ formData, handleChange }) => (
  <div className="form-section">
    <div className="form-group">
      <label>Estimated Repair Cost</label>
      <FormattedNumberInput step="1000" name="estimatedRepairCost" value={formData.estimatedRepairCost || 0} onChange={handleChange} min={0} max={10000000} />
    </div>
    <div className="form-group">
      <label>After Repair Value (ARV)</label>
      <FormattedNumberInput step="5000" name="afterRepairValue" value={formData.afterRepairValue || 0} onChange={handleChange} min={0} max={100000000} />
    </div>
    <div className="form-group">
      <label>Holding Period (months)</label>
      <FormattedNumberInput step="1" name="holdingPeriodMonths" value={formData.holdingPeriodMonths || 0} onChange={handleChange} min={0} max={60} />
    </div>
    <div className="form-group">
      <label>Holding Costs / mo</label>
      <FormattedNumberInput step="100" name="holdingCostsPerMonth" value={formData.holdingCostsPerMonth || 0} onChange={handleChange} min={0} max={100000} />
    </div>
    <div className="form-group">
      <label>Refinance LTV</label>
      <FormattedPercentInput step="1" name="refinanceLTV" value={formData.refinanceLTV || 0.75} onChange={handleChange} min={0} max={100} />
    </div>
    <div className="form-group">
      <label>Refinance Interest Rate</label>
      <FormattedPercentInput step="0.25" name="refinanceInterestRate" value={formData.refinanceInterestRate || 0.065} onChange={handleChange} min={0} max={30} />
    </div>
    <div className="form-group">
      <label>Refinance Term (years)</label>
      <FormattedNumberInput step="5" name="refinanceTermYears" value={formData.refinanceTermYears || 30} onChange={handleChange} min={1} max={50} />
    </div>
  </div>
);

export default BRRRRInputs;
