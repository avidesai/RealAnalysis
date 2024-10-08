// GrossIncome.js

import React from 'react';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const GrossIncome = ({ formData, handleChange, results, formatCurrency }) => (
  <div className="form-section">
    <h2>Monthly Gross Income</h2>
    <div className="result-item">
      <span>Monthly Rental Income:</span> <span className='positive'><strong>{results.monthlyRentalIncome !== undefined ? formatCurrency(results.monthlyRentalIncome) : ''}</strong></span>
    </div>
    <div className="form-group">
      <label>
        Vacancy Rate (%)
        <InfoTooltip description="Percent of time the property is expected to be vacant (in between tenants)" />
      </label>
      <FormattedPercentInput step="1" name="vacancyRate" value={formData.vacancyRate} onChange={handleChange} decimalPlaces={1} />
    </div>
    <div className="result-item">
      <span>Vacancy Loss</span> <span className='negative'><strong>{results.vacancyLoss !== undefined ? formatCurrency(results.vacancyLoss) : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>Monthly Gross Income</span> <span className="positive"><strong>{results.monthlyGrossIncome !== undefined ? formatCurrency(results.monthlyGrossIncome) : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
  </div>
);

export default GrossIncome;
