import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';
import RentEstimate from '../components/RentEstimate';

const PropertyInformation = ({
  formData,
  handleChange,
  rentEstimate,
}) => (
  <div className="form-section">
    <div className="form-group">
      <label>
        Purchase Price
        <InfoTooltip description="The price paid for the property" />
      </label>
      <FormattedNumberInput step="10000" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} min={0} max={100000000} />
    </div>
    <div className="form-group">
      <label>
        Monthly Rent per Unit
        <InfoTooltip description="Average monthly rent per unit" />
      </label>
      <FormattedNumberInput step="100" name="monthlyRentPerUnit" value={formData.monthlyRentPerUnit} onChange={handleChange} min={0} max={1000000} />
    </div>
    {rentEstimate && (
      <RentEstimate
        rentData={rentEstimate}
        onApply={(val) => handleChange({ target: { name: 'monthlyRentPerUnit', value: val } })}
      />
    )}
    <div className="form-group">
      <label>
        Number of Units
        <InfoTooltip description="Number of units being rented out" />
      </label>
      <FormattedNumberInput step="1" name="numberOfUnits" value={formData.numberOfUnits} onChange={handleChange} min={1} max={1000} />
    </div>
  </div>
);

export default PropertyInformation;
