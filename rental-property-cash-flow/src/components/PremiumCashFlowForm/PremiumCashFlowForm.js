// PremiumCashFlowForm.js

import React from 'react';
import usePremiumCashFlowCalculations from './helper_files/usePremiumCashFlowCalculations';
import PropertyInformation from './form_sections/PropertyInformation';
import GrossIncome from './form_sections/GrossIncome';
import OperatingExpenses from './form_sections/OperatingExpenses';
import NetOperatingIncome from './form_sections/NetOperatingIncome';
import CapRateAndValuation from './form_sections/CapRateAndValuation';
import LoanInformation from './form_sections/LoanInformation';
import CashFlowAndROI from './form_sections/CashFlowAndROI';
import './CashFlowForm.css';

const PremiumCashFlowForm = ({ onCalculate }) => {
  const {
    formData,
    handleChange,
    resetForm,
    results,
    formatCurrency,
    calculateValues,
  } = usePremiumCashFlowCalculations();

  const handleCalculateClick = () => {
    calculateValues();
    if (onCalculate) {
      onCalculate(); // Notify parent to show analysis view
    }
  };

  return (
    <div className="container">
      <form className="form">
        <PropertyInformation formData={formData} handleChange={handleChange} calculateValues={handleCalculateClick} resetForm={resetForm} results={results} formatCurrency={formatCurrency} />
        <GrossIncome formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <OperatingExpenses formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <NetOperatingIncome results={results} formatCurrency={formatCurrency} />
        <CapRateAndValuation formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <LoanInformation formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <CashFlowAndROI calculateValues={handleCalculateClick} resetForm={resetForm} results={results} formatCurrency={formatCurrency} />
      </form>
    </div>
  );
};

export default PremiumCashFlowForm;
