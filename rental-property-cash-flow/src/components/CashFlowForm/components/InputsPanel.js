import React from 'react';
import PropertyInformation from '../form_sections/PropertyInformation';
import GrossIncome from '../form_sections/GrossIncome';
import OperatingExpenses from '../form_sections/OperatingExpenses';
import LoanInformation from '../form_sections/LoanInformation';

const InputsPanel = ({
  formData,
  handleChange,
  resetForm,
  results,
  formatCurrency,
  errors,
  isCalculating,
  calculateValues,
}) => {
  return (
    <div className="inputs-panel">
      <h3>Property Setup</h3>

      {/* Property Section */}
      <div className="input-section">
        <h4>Property Details</h4>
        <PropertyInformation
          formData={formData}
          handleChange={handleChange}
          resetForm={resetForm}
          results={{}} // Remove results from input sections
          formatCurrency={formatCurrency}
          errors={errors}
        />
      </div>

      {/* Income Section */}
      <div className="input-section">
        <h4>Income Settings</h4>
        <GrossIncome
          formData={formData}
          handleChange={handleChange}
          results={{}} // Remove results from input sections
          formatCurrency={formatCurrency}
          errors={errors}
        />
      </div>

      {/* Expenses Section */}
      <div className="input-section">
        <h4>Expense Settings</h4>
        <OperatingExpenses
          formData={formData}
          handleChange={handleChange}
          results={{}} // Remove results from input sections
          formatCurrency={formatCurrency}
          errors={errors}
        />
      </div>

      {/* Loan/Mortgage Section */}
      <div className="input-section">
        <h4>Loan Information</h4>
        <LoanInformation
          formData={formData}
          handleChange={handleChange}
          results={{}} // Remove results from input sections
          formatCurrency={formatCurrency}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default InputsPanel;
