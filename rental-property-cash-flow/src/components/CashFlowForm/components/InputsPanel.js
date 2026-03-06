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
  rentEstimate,
  autoFillData,
  onDismissAutoFill,
}) => {
  const [openSections, setOpenSections] = useState({
    property: true,
    income: true,
    expenses: true,
    loan: true,
    brrrr: true,
    notes: false,
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
          onDismiss={onDismissAutoFill}
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

      {/* Notes & Details Section */}
      <div className="input-section">
        <button
          type="button"
          className="section-toggle"
          onClick={() => toggleSection('notes')}
          aria-expanded={openSections.notes}
        >
          <span className="section-toggle-label">Notes & Details</span>
          <ChevronIcon isOpen={openSections.notes} />
        </button>
        {openSections.notes && (
          <div className="section-content">
            <div className="notes-detail-field">
              <label htmlFor="meta-listing-url">Listing URL</label>
              <div className="listing-url-row">
                <input
                  id="meta-listing-url"
                  type="url"
                  name="listingUrl"
                  value={propertyMeta?.listingUrl || ''}
                  onChange={handleMetaChange}
                  placeholder="https://zillow.com/..."
                  className="notes-detail-input"
                />
                {propertyMeta?.listingUrl && (
                  <a
                    href={propertyMeta.listingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="listing-url-link"
                    title="Open listing"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8.667v4A1.333 1.333 0 0110.667 14H3.333A1.333 1.333 0 012 12.667V5.333A1.333 1.333 0 013.333 4h4M10 2h4v4M6.667 9.333L14 2" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
            <div className="notes-detail-field">
              <label htmlFor="meta-notes">Notes</label>
              <textarea
                id="meta-notes"
                name="notes"
                value={propertyMeta?.notes || ''}
                onChange={handleMetaChange}
                placeholder="Any notes about this property..."
                rows={4}
                className="notes-detail-textarea"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputsPanel;
