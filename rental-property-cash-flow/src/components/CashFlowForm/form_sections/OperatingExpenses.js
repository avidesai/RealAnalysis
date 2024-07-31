import React from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';
import InfoTooltip from '../../InfoTooltip/InfoTooltip';

const OperatingExpenses = ({ formData, handleChange, results, formatCurrency }) => (
  <div className="form-section">
    <h2>Monthly Operating Expenses</h2>
    <div className="form-group">
      <label>
        Property Management Rate (%)
        <InfoTooltip description="Percentage of rental income paid to property management company" />
      </label>
      <FormattedPercentInput step="1.00" name="propertyManagementRate" value={formData.propertyManagementRate} onChange={handleChange} decimalPlaces={0} />
    </div>
    <div className="result-item">
      <span>Property Management Fees</span> <span className='negative'><strong>{results.propertyManagementFees !== undefined ? formatCurrency(results.propertyManagementFees) : ''}</strong></span>
    </div>
    <div className="form-group">
      <label>
        Property Tax Rate (%)
        <InfoTooltip description="Annual property tax rate (varies from county to county)" />
      </label>
      <FormattedPercentInput step="0.05" name="propertyTaxRate" value={formData.propertyTaxRate} onChange={handleChange} />
    </div>
    <div className="result-item">
      <span>Property Taxes</span> <span className='negative'><strong>{results.propertyTax !== undefined ? formatCurrency(results.propertyTax) : ''}</strong></span>
    </div>
    <div className="form-group">
      <label>
        Insurance
        <InfoTooltip description="Monthly cost of insurance for the property (contact insurance agent for estimate)" />
      </label>
      <FormattedNumberInput step="10" name="landlordInsurance" value={formData.landlordInsurance} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        HOA Dues
        <InfoTooltip description="Monthly fees paid to the homeowners association (if applicable)" />
      </label>
      <FormattedNumberInput step="10" name="hoaFees" value={formData.hoaFees} onChange={handleChange} />
    </div>
    <h3>Utilities + Other Monthly Expenses</h3>
    <div className="form-group">
      <label>
        Water and Sewer
        <InfoTooltip description="Monthly water and sewer expenses (verify who pays this)" />
      </label>
      <FormattedNumberInput step="10" name="waterAndSewer" value={formData.waterAndSewer} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Gas and Electricity
        <InfoTooltip description="Monthly gas and electricity expenses (verify who pays this)" />
      </label>
      <FormattedNumberInput step="10" name="gasAndElectricity" value={formData.gasAndElectricity} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Garbage
        <InfoTooltip description="Monthly garbage collection expenses" />
      </label>
      <FormattedNumberInput step="5" name="garbage" value={formData.garbage} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Cable, Phone, Internet
        <InfoTooltip description="Monthly cable, phone, and internet expenses (if applicable)" />
      </label>
      <FormattedNumberInput step="5" name="cablePhoneInternet" value={formData.cablePhoneInternet} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Accounting, Advertising, and Legal
        <InfoTooltip description="Monthly real estate business expenses (accounting, advertising, and legal services)" />
      </label>
      <FormattedNumberInput step="5" name="accountingAdvertisingLegal" value={formData.accountingAdvertisingLegal} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Pest Control
        <InfoTooltip description="Monthly pest control expenses (if applicable)" />
      </label>
      <FormattedNumberInput step="5" name="pestControl" value={formData.pestControl} onChange={handleChange} />
    </div>
    <div className="form-group">
      <label>
        Other Expenses
        <InfoTooltip description="Lawn care, snow removal, and other monthly expenses." />
      </label>
      <FormattedNumberInput step="5" name="snowRemoval" value={formData.snowRemoval} onChange={handleChange} />
    </div>
    <div className="form-divider"></div>
    <div className="result-item-bottom">
      <span>Monthly Operating Expenses</span> <span className="negative"><strong>{results.monthlyOperatingExpenses !== undefined ? formatCurrency(results.monthlyOperatingExpenses) : ''}</strong></span>
    </div>
    <div className="form-divider"></div>
  </div>
);

export default OperatingExpenses;
