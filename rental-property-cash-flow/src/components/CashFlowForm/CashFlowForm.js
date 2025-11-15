// src/components/CashFlowForm/CashFlowForm.js
import React, { useState } from 'react';
import useCashFlowCalculations from './hooks/useCashFlowCalculations';
import LoadingSpinner from './LoadingSpinner';
import { Alert, AlertDescription } from './Alert';
import InputsPanel from './components/InputsPanel';
import ResultsPanel from './components/ResultsPanel';
import './CashFlowForm.css';

const CashFlowForm = () => {
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const {
    formData,
    handleChange,
    resetForm,
    results,
    formatCurrency,
    calculateValues,
    isCalculating,
  } = useCashFlowCalculations();

  const validateForm = () => {
    const newErrors = {};

    // Property Information Validation
    if (!formData.purchasePrice || formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
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
    // Validate form before calculation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setGlobalError('Please fix the validation errors before calculating.');
      return;
    }

    // Clear any existing errors
    setErrors({});
    setGlobalError('');

    // Perform calculation
    await calculateValues();
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    // Clear any existing errors for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // Clear global error when user starts typing
    if (globalError) {
      setGlobalError('');
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

      <div className="calculator-layout">
        <div className="inputs-column">
          <InputsPanel
            formData={formData}
            handleChange={handleInputChange}
            resetForm={resetForm}
            results={results}
            formatCurrency={formatCurrency}
            errors={errors}
            isCalculating={isCalculating}
            calculateValues={handleCalculate}
          />
        </div>

        <div className="results-column">
          <ResultsPanel
            results={results}
            formatCurrency={formatCurrency}
            isCalculating={isCalculating}
          />
        </div>
      </div>

      {isCalculating && <LoadingSpinner />}
    </div>
  );
};

export default CashFlowForm;