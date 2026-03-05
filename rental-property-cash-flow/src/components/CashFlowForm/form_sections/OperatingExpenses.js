import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const OperatingExpenses = ({ formData, handleChange }) => (
  <div className="form-section">
    <div className="form-group">
      <label>
        Property Management Rate (%)
        <InfoTooltip description="Percentage of rental income paid to property management company" />
      </label>
      <FormattedPercentInput step="1" name="propertyManagementRate" value={formData.propertyManagementRate} onChange={handleChange} decimalPlaces={0} min={0} max={50} />
    </div>
    <div className="form-group">
      <label>
        Property Tax Rate (%)
        <InfoTooltip description="Annual property tax rate (varies from county to county)" />
      </label>
      <FormattedPercentInput step="0.05" name="propertyTaxRate" value={formData.propertyTaxRate} onChange={handleChange} min={0} max={25} />
    </div>
    <div className="form-group">
      <label>
        Insurance
        <InfoTooltip description="Monthly cost of insurance for the property" />
      </label>
      <FormattedNumberInput step="10" name="landlordInsurance" value={formData.landlordInsurance} onChange={handleChange} min={0} max={50000} />
    </div>
    <div className="form-group">
      <label>
        HOA Dues
        <InfoTooltip description="Monthly fees paid to the homeowners association (if applicable)" />
      </label>
      <FormattedNumberInput step="10" name="hoaFees" value={formData.hoaFees} onChange={handleChange} min={0} max={50000} />
    </div>
    <div className="form-group">
      <label>
        Maintenance Reserve
        <InfoTooltip description="Monthly reserve for repairs and maintenance (commonly ~1% of property value per year)" />
      </label>
      <FormattedNumberInput step="10" name="maintenanceReserve" value={formData.maintenanceReserve} onChange={handleChange} min={0} max={50000} />
    </div>

    <h4>Utilities + Other Monthly Expenses</h4>

    <div className="form-group">
      <label>
        Water and Sewer
        <InfoTooltip description="Monthly water and sewer expenses" />
      </label>
      <FormattedNumberInput step="10" name="waterAndSewer" value={formData.waterAndSewer} onChange={handleChange} min={0} max={50000} />
    </div>
    <div className="form-group">
      <label>
        Gas and Electricity
        <InfoTooltip description="Monthly gas and electricity expenses" />
      </label>
      <FormattedNumberInput step="10" name="gasAndElectricity" value={formData.gasAndElectricity} onChange={handleChange} min={0} max={50000} />
    </div>
    <div className="form-group">
      <label>
        Garbage
        <InfoTooltip description="Monthly garbage collection expenses" />
      </label>
      <FormattedNumberInput step="5" name="garbage" value={formData.garbage} onChange={handleChange} min={0} max={5000} />
    </div>
    <div className="form-group">
      <label>
        Other Expenses
        <InfoTooltip description="Lawn care, snow removal, and other monthly expenses" />
      </label>
      <FormattedNumberInput step="5" name="snowRemoval" value={formData.snowRemoval} onChange={handleChange} min={0} max={50000} />
    </div>
  </div>
);

export default OperatingExpenses;
