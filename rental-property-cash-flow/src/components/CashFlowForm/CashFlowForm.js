// CashFlowForm.js

import React from 'react';
import useCashFlowCalculations from './helper_files/useCashFlowCalculations';
import PropertyInformation from './form_sections/PropertyInformation';
import GrossIncome from './form_sections/GrossIncome';
import OperatingExpenses from './form_sections/OperatingExpenses';
import NetOperatingIncome from './form_sections/NetOperatingIncome';
import CapRateAndValuation from './form_sections/CapRateAndValuation';
import LoanInformation from './form_sections/LoanInformation';
import CashFlowAndROI from './form_sections/CashFlowAndROI';
import './CashFlowForm.css';

const CashFlowForm = () => {
  const {
    formData,
    handleChange,
    results,
    formatCurrency,
    calculateValues,
  } = useCashFlowCalculations();

  return (
    <div className="container">
      <div className='header'>
        <h1>CashFlow.io</h1>
      </div>
      <div className="form-divider"></div>
      <form className="form">
        <PropertyInformation formData={formData} handleChange={handleChange} calculateValues={calculateValues} results={results} formatCurrency={formatCurrency} />
        <GrossIncome formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <OperatingExpenses formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <NetOperatingIncome results={results} formatCurrency={formatCurrency} />
        <CapRateAndValuation formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <LoanInformation formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <CashFlowAndROI calculateValues={calculateValues} results={results} formatCurrency={formatCurrency} />
      </form>
    </div>
  );
};

export default CashFlowForm;
