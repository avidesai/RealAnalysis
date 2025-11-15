// src/components/CashFlowForm/hooks/useCashFlowCalculations.js
import { useCallback, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import useCalculations from './useCalculations';

const initialFormData = {
  purchasePrice: 600000,
  monthlyRentPerUnit: 3000,
  numberOfUnits: 2,
  propertyTaxRate: 0.02,
  vacancyRate: 0.05,
  propertyManagementRate: 0.1,
  landlordInsurance: 120,
  hoaFees: 0,
  waterAndSewer: 200,
  gasAndElectricity: 0,
  garbage: 30,
  snowRemoval: 0,
  downPaymentPercentage: 0.25,
  lengthOfMortgage: 30,
  mortgageRate: 0.068,
};

const useCashFlowCalculations = () => {
  const [formData, setFormData] = useLocalStorage('cashflow-form-data', initialFormData);
  const [results, calculateValues] = useCalculations(formData);
  const [isCalculating, setIsCalculating] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const performCalculation = useCallback(async () => {
    setIsCalculating(true);
    try {
      await calculateValues();
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [calculateValues]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  }, [setFormData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    // Note: No automatic calculation on reset - users must manually calculate
  }, [setFormData]);

  return {
    formData,
    handleChange,
    resetForm,
    results,
    formatCurrency,
    calculateValues: performCalculation,
    isCalculating,
  };
};

export default useCashFlowCalculations;