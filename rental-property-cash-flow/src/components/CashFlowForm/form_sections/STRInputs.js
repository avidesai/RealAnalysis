import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const STRInputs = ({ formData, handleChange }) => (
  <div className="form-section">
    <div className="form-group">
      <label>
        Average Stay Length (nights)
        <InfoTooltip description="Average number of nights per guest booking. Used to estimate turnover frequency for cleaning costs." />
      </label>
      <FormattedNumberInput step="1" name="averageStayLength" value={formData.averageStayLength || 3} onChange={handleChange} min={1} max={365} />
    </div>
    <div className="form-group">
      <label>
        Cleaning Cost per Turnover
        <InfoTooltip description="Cost to clean the property between each guest stay (paid to cleaners)" />
      </label>
      <FormattedNumberInput step="10" name="cleaningCostPerTurnover" value={formData.cleaningCostPerTurnover || 0} onChange={handleChange} min={0} max={10000} />
    </div>
    <div className="form-group">
      <label>
        Platform Fee (%)
        <InfoTooltip description="Host service fee charged by platforms like Airbnb (~3%) or VRBO (~3-5%)" />
      </label>
      <FormattedPercentInput step="0.5" name="platformFeeRate" value={formData.platformFeeRate || 0.03} onChange={handleChange} min={0} max={30} />
    </div>
  </div>
);

export default STRInputs;
