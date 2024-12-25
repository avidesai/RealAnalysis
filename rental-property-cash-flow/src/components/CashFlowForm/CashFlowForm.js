// CashFlowForm.js
import React, { useState } from 'react';
import useCashFlowCalculations from './helper_files/useCashFlowCalculations';
import PropertyInformation from './form_sections/PropertyInformation';
import GrossIncome from './form_sections/GrossIncome';
import OperatingExpenses from './form_sections/OperatingExpenses';
import NetOperatingIncome from './form_sections/NetOperatingIncome';
import CapRateAndValuation from './form_sections/CapRateAndValuation';
import LoanInformation from './form_sections/LoanInformation';
import CashFlowAndROI from './form_sections/CashFlowAndROI';
import LoadingSpinner from './LoadingSpinner';
import { Alert, AlertDescription } from './Alert';
import './CashFlowForm.css';

const CashFlowForm = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const {
    formData,
    handleChange,
    resetForm,
    results,
    formatCurrency,
    calculateValues: originalCalculateValues,
  } = useCashFlowCalculations();

  const validateForm = () => {
    const newErrors = {};

    // Property Information Validation
    if (!formData.purchasePrice || formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
    }
    if (!formData.squareFeet || formData.squareFeet <= 0) {
      newErrors.squareFeet = 'Square feet must be greater than 0';
    }
    if (!formData.monthlyRentPerUnit || formData.monthlyRentPerUnit <= 0) {
      newErrors.monthlyRentPerUnit = 'Monthly rent must be greater than 0';
    }
    if (!formData.numberOfUnits || formData.numberOfUnits <= 0) {
      newErrors.numberOfUnits = 'Number of units must be greater than 0';
    }

    // Rate Validations
    if (formData.propertyTaxRate < 0 || formData.propertyTaxRate > 1) {
      newErrors.propertyTaxRate = 'Property tax rate must be between 0% and 100%';
    }
    if (formData.vacancyRate < 0 || formData.vacancyRate > 1) {
      newErrors.vacancyRate = 'Vacancy rate must be between 0% and 100%';
    }
    if (formData.propertyManagementRate < 0 || formData.propertyManagementRate > 1) {
      newErrors.propertyManagementRate = 'Property management rate must be between 0% and 100%';
    }

    // Financing Validation
    if (formData.downPaymentPercentage <= 0 || formData.downPaymentPercentage > 1) {
      newErrors.downPaymentPercentage = 'Down payment must be between 1% and 100%';
    }
    if (formData.mortgageRate < 0 || formData.mortgageRate > 1) {
      newErrors.mortgageRate = 'Mortgage rate must be between 0% and 100%';
    }
    if (formData.lengthOfMortgage <= 0 || formData.lengthOfMortgage > 50) {
      newErrors.lengthOfMortgage = 'Mortgage length must be between 1 and 50 years';
    }

    return newErrors;
  };

  const handleCalculate = async () => {
    try {
      setIsCalculating(true);
      setGlobalError('');
      setErrors({});

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      await originalCalculateValues();
    } catch (error) {
      setGlobalError('An error occurred while calculating. Please check your inputs and try again.');
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    handleChange(e);
  };

  return (
    <div className="container" role="main">
      {globalError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <PropertyInformation
          formData={formData}
          handleChange={handleInputChange}
          calculateValues={handleCalculate}
          resetForm={resetForm}
          results={results}
          formatCurrency={formatCurrency}
          errors={errors}
          isCalculating={isCalculating}
        />
        
        <GrossIncome
          formData={formData}
          handleChange={handleInputChange}
          results={results}
          formatCurrency={formatCurrency}
          errors={errors}
        />
        
        <OperatingExpenses
          formData={formData}
          handleChange={handleInputChange}
          results={results}
          formatCurrency={formatCurrency}
          errors={errors}
        />
        
        <NetOperatingIncome
          results={results}
          formatCurrency={formatCurrency}
        />
        
        <CapRateAndValuation
          formData={formData}
          handleChange={handleInputChange}
          results={results}
          formatCurrency={formatCurrency}
          errors={errors}
        />
        
        <LoanInformation
          formData={formData}
          handleChange={handleInputChange}
          results={results}
          formatCurrency={formatCurrency}
          errors={errors}
        />
        
        <CashFlowAndROI
          calculateValues={handleCalculate}
          resetForm={resetForm}
          results={results}
          formatCurrency={formatCurrency}
          isCalculating={isCalculating}
        />

        {isCalculating && <LoadingSpinner />}
      </form>
    </div>
  );
};

export default CashFlowForm;