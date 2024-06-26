import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';

const OperatingExpenses = ({ formData, handleChange, results, formatCurrency }) => (
  <div className="form-section">
    <h2>Monthly Operating Expenses</h2>
    <div className="form-group">
      <label>Property Management Rate (%)</label>
      <FormattedPercentInput step="1.00" name="propertyManagementRate" value={formData.propertyManagementRate} onChange={handleChange} decimalPlaces={0} />
    </div>
    <div className="form-group">
      <label>Property Tax Rate (%)</label>
      <FormattedPercentInput step="0.05" name="propertyTaxRate" value={formData.propertyTaxRate} onChange={handleChange} />
    </div>
    <div className="result-item">
      <span>Property Management Fees</span> <span><strong>{results.propertyManagementFees !== undefined ? formatCurrency(results.propertyManagementFees) : ''}</strong></span>
    </div>
    <div className="result-item">
      <span>Property Taxes</span> <span><strong>{results.propertyTax !== undefined ? formatCurrency(results.propertyTax) : ''}</strong></span>
    </div>
    <div className="form-group">
      <label>Landlord Insurance</label>
      <FormattedNumberInput step="10" name="landlordInsurance" value={formData.landlordInsurance} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Replacement Reserve</label>
      <FormattedNumberInput step="10" name="replacementReserve" value={formData.replacementReserve} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>HOA Fees</label>
      <FormattedNumberInput step="10" name="hoaFees" value={formData.hoaFees} onChange={handleChange} />
    </div>
    <h3>Utilities + Other Monthly Expenses</h3>
    <div className="form-group">
      <label>Water and Sewer</label>
      <FormattedNumberInput step="10" name="waterAndSewer" value={formData.waterAndSewer} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Gas and Electricity</label>
      <FormattedNumberInput step="10" name="gasAndElectricity" value={formData.gasAndElectricity} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Garbage</label>
      <FormattedNumberInput step="5" name="garbage" value={formData.garbage} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Snow Removal</label>
      <FormattedNumberInput step="5" name="snowRemoval" value={formData.snowRemoval} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Cable, Phone, Internet</label>
      <FormattedNumberInput step="5" name="cablePhoneInternet" value={formData.cablePhoneInternet} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Pest Control</label>
      <FormattedNumberInput step="5" name="pestControl" value={formData.pestControl} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>Accounting, Advertising, and Legal</label>
      <FormattedNumberInput step="5" name="accountingAdvertisingLegal" value={formData.accountingAdvertisingLegal} onChange={handleChange} />
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>Monthly Operating Expenses</span> <span className="negative"><strong>{results.monthlyOperatingExpenses !== undefined ? formatCurrency(results.monthlyOperatingExpenses) : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
  </div>
);

export default OperatingExpenses;
