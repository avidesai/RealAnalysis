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

      {/* Property & Financing Section */}
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

        <div className="input-subsection">
          <LoanInformation
            formData={formData}
            handleChange={handleChange}
            results={{}} // Remove results from input sections
            formatCurrency={formatCurrency}
            errors={errors}
          />
        </div>
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

      {/* Action Buttons */}
      <div className="button-container">
        <button
          type="button"
          className={`calculate-button ${isCalculating ? 'disabled' : ''}`}
          onClick={calculateValues}
          disabled={isCalculating}
        >
          {isCalculating ? 'Calculating...' : 'Calculate'}
        </button>
        <button type="button" className="reset-button" onClick={resetForm}>
          Reset Form
        </button>
      </div>
    </div>
  );
};

export default InputsPanel;
