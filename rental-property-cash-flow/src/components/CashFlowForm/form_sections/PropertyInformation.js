import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const PropertyInformation = ({
  formData,
  handleChange,
  resetForm,
  results,
  formatCurrency,
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
  </div>
);

export default PropertyInformation;
