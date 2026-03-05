import React, { useState } from 'react';
import PropertyInformation from '../form_sections/PropertyInformation';
import GrossIncome from '../form_sections/GrossIncome';
import OperatingExpenses from '../form_sections/OperatingExpenses';
import LoanInformation from '../form_sections/LoanInformation';
import BRRRRInputs from '../form_sections/BRRRRInputs';
import AddressAutocomplete from './AddressAutocomplete';
import AutoFillBanner from './AutoFillBanner';

const ChevronIcon = ({ isOpen }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={`section-chevron ${isOpen ? 'open' : ''}`}
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InputsPanel = ({
  formData,
  handleChange,
  propertyMeta,
  handleMetaChange,
  resetForm,
  formatCurrency,
  onAddressSelect,
  taxSuggestion,
  onApplyTax,
  onDismissTax,
  rentEstimate,
  autoFillData,
  onApplyAutoFill,
  onDismissAutoFill,
}) => {
  const [openSections, setOpenSections] = useState({
    property: true,
    income: true,
    expenses: true,
    loan: true,
    brrrr: true,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="inputs-panel">
      <div className="inputs-panel-header">
        <h3>Property Setup</h3>
        <button type="button" className="reset-link" onClick={resetForm}>
          Reset
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle-wrapper">
        <button
          type="button"
          className={`mode-toggle-btn ${formData.calculatorMode !== 'brrrr' ? 'active' : ''}`}
          onClick={() => handleChange({ target: { name: 'calculatorMode', value: 'standard' } })}
        >
          Standard
        </button>
        <button
          type="button"
          className={`mode-toggle-btn ${formData.calculatorMode === 'brrrr' ? 'active' : ''}`}
          onClick={() => handleChange({ target: { name: 'calculatorMode', value: 'brrrr' } })}
        >
          BRRRR
        </button>
      </div>

      {/* Address field */}
      <div className="address-field">
        <AddressAutocomplete
          value={propertyMeta?.address || ''}
          onChange={handleMetaChange}
          onAddressSelect={onAddressSelect}
        />
      </div>

      {/* Auto-fill banner */}
      {autoFillData && (
        <AutoFillBanner
          data={autoFillData}
          onApply={onApplyAutoFill}
          onDismiss={onDismissAutoFill}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Property Section */}
      <div className="input-section">
        <button
          type="button"
          className="section-toggle"
          onClick={() => toggleSection('property')}
          aria-expanded={openSections.property}
        >
          <span className="section-toggle-label">Property Details</span>
          <ChevronIcon isOpen={openSections.property} />
        </button>
        {openSections.property && (
          <div className="section-content">
            <PropertyInformation
              formData={formData}
              handleChange={handleChange}
              resetForm={resetForm}
              results={{}}
              formatCurrency={formatCurrency}
              rentEstimate={rentEstimate}
            />
          </div>
        )}
      </div>

      {/* Income Section */}
      <div className="input-section">
        <button
          type="button"
          className="section-toggle"
          onClick={() => toggleSection('income')}
          aria-expanded={openSections.income}
        >
          <span className="section-toggle-label">Income Settings</span>
          <ChevronIcon isOpen={openSections.income} />
        </button>
        {openSections.income && (
          <div className="section-content">
            <GrossIncome
              formData={formData}
              handleChange={handleChange}
              results={{}}
              formatCurrency={formatCurrency}
            />
          </div>
        )}
      </div>

      {/* Expenses Section */}
      <div className="input-section">
        <button
          type="button"
          className="section-toggle"
          onClick={() => toggleSection('expenses')}
          aria-expanded={openSections.expenses}
        >
          <span className="section-toggle-label">Expense Settings</span>
          <ChevronIcon isOpen={openSections.expenses} />
        </button>
        {openSections.expenses && (
          <div className="section-content">
            <OperatingExpenses
              formData={formData}
              handleChange={handleChange}
              results={{}}
              formatCurrency={formatCurrency}
            />
            {taxSuggestion && (
              <div className="tax-suggestion">
                <span>Avg tax rate for this area: {(taxSuggestion * 100).toFixed(2)}%</span>
                <button type="button" className="tax-suggestion-apply" onClick={onApplyTax}>Apply</button>
                <button type="button" className="tax-suggestion-dismiss" onClick={onDismissTax}>&times;</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loan/Mortgage Section */}
      <div className="input-section">
        <button
          type="button"
          className="section-toggle"
          onClick={() => toggleSection('loan')}
          aria-expanded={openSections.loan}
        >
          <span className="section-toggle-label">Loan Information</span>
          <ChevronIcon isOpen={openSections.loan} />
        </button>
        {openSections.loan && (
          <div className="section-content">
            <LoanInformation
              formData={formData}
              handleChange={handleChange}
              results={{}}
              formatCurrency={formatCurrency}
            />
          </div>
        )}
      </div>

      {/* BRRRR Section */}
      {formData.calculatorMode === 'brrrr' && (
        <div className="input-section">
          <button
            type="button"
            className="section-toggle"
            onClick={() => toggleSection('brrrr')}
            aria-expanded={openSections.brrrr}
          >
            <span className="section-toggle-label">BRRRR Details</span>
            <ChevronIcon isOpen={openSections.brrrr} />
          </button>
          {openSections.brrrr && (
            <div className="section-content">
              <BRRRRInputs
                formData={formData}
                handleChange={handleChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InputsPanel;
