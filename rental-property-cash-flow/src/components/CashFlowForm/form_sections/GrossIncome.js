import React from 'react';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const GrossIncome = ({ formData, handleChange }) => (
  <div className="form-section">
    <div className="form-group">
      <label>
        Vacancy Rate (%)
        <InfoTooltip description="Percent of time the property is expected to be vacant (in between tenants)" />
      </label>
      <FormattedPercentInput step="1" name="vacancyRate" value={formData.vacancyRate} onChange={handleChange} decimalPlaces={1} min={0} max={100} />
    </div>
  </div>
);

export default GrossIncome;
