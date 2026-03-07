import React from 'react';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const GrossIncome = ({ formData, handleChange }) => {
  const isSTR = formData.calculatorMode === 'str';

  return (
    <div className="form-section">
      {isSTR ? (
        <div className="form-group">
          <label>
            Occupancy Rate (%)
            <InfoTooltip description="Percentage of nights the property is expected to be booked. 70% is a common target for short term rentals." />
          </label>
          <FormattedPercentInput step="1" name="occupancyRate" value={formData.occupancyRate || 0.70} onChange={handleChange} decimalPlaces={1} min={0} max={100} />
        </div>
      ) : (
        <div className="form-group">
          <label>
            Vacancy Rate (%)
            <InfoTooltip description="Percent of time the property is expected to be vacant (in between tenants)" />
          </label>
          <FormattedPercentInput step="1" name="vacancyRate" value={formData.vacancyRate} onChange={handleChange} decimalPlaces={1} min={0} max={100} />
        </div>
      )}
    </div>
  );
};

export default GrossIncome;
