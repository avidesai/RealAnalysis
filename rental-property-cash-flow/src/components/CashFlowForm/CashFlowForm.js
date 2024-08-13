// CashFlowForm.js

import React from 'react';
import useIpBasedCalculationLimit from './helper_files/useIpBasedCalculationLimit'; // Import the new hook
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
  const { isCalculateDisabled, clickCount, incrementCalculationCount } = useIpBasedCalculationLimit(); // Use the new hook

  const {
    formData,
    handleChange,
    resetForm,
    results,
    formatCurrency,
    calculateValues: originalCalculateValues,
  } = useCashFlowCalculations();

  // Wrap the original calculate function to include the increment logic
  const calculateValues = () => {
    if (!isCalculateDisabled) {
      incrementCalculationCount();
      originalCalculateValues();
    }
  };

  return (
    <div className="container">
      <form className="form">
        <PropertyInformation 
          formData={formData} 
          handleChange={handleChange} 
          calculateValues={calculateValues} 
          resetForm={resetForm} 
          results={results} 
          formatCurrency={formatCurrency} 
          isCalculateDisabled={isCalculateDisabled} 
          clickCount={clickCount} 
          calculationLimit={5} 
        />
        <GrossIncome formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <OperatingExpenses formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <NetOperatingIncome results={results} formatCurrency={formatCurrency} />
        <CapRateAndValuation formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <LoanInformation formData={formData} handleChange={handleChange} results={results} formatCurrency={formatCurrency} />
        <CashFlowAndROI
          calculateValues={calculateValues}
          resetForm={resetForm}
          results={results}
          formatCurrency={formatCurrency}
          isCalculateDisabled={isCalculateDisabled}
          clickCount={clickCount}
          calculationLimit={5}
        />
      </form>
    </div>
  );
};

export default CashFlowForm;
