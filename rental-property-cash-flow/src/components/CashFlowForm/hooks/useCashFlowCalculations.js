// src/components/CashFlowForm/hooks/useCashFlowCalculations.js
import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import useCalculations from './useCalculations';

const initialFormData = {
  purchasePrice: 600000,
  squareFeet: 2000,
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
  cablePhoneInternet: 0,
  pestControl: 0,
  accountingAdvertisingLegal: 0,
  desiredCapRate: 0.1,
  downPaymentPercentage: 0.25,
  lengthOfMortgage: 30,
  mortgageRate: 0.068,
};

const useCashFlowCalculations = () => {
  const [formData, setFormData] = useLocalStorage('cashflow-form-data', initialFormData);
  const [calculationHistory, setCalculationHistory] = useLocalStorage('calculation-history', []);
  const [results, calculateValues] = useCalculations(formData);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  }, [setFormData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, [setFormData]);

  const saveToHistory = useCallback(() => {
    const timestamp = new Date().toISOString();
    const newEntry = {
      id: timestamp,
      timestamp,
      formData: { ...formData },
      results: { ...results },
    };

    setCalculationHistory(prev => {
      const newHistory = [newEntry, ...prev].slice(0, 10); // Keep only last 10 calculations
      return newHistory;
    });
  }, [formData, results, setCalculationHistory]);

  const calculateWithHistory = useCallback(async () => {
    await calculateValues();
    saveToHistory();
  }, [calculateValues, saveToHistory]);

  const deleteHistoryEntry = useCallback((id) => {
    setCalculationHistory(prev => prev.filter(entry => entry.id !== id));
  }, [setCalculationHistory]);

  const loadFromHistory = useCallback((entry) => {
    setFormData(entry.formData);
  }, [setFormData]);

  return {
    formData,
    handleChange,
    resetForm,
    results,
    formatCurrency,
    calculateValues: calculateWithHistory,
    calculationHistory,
    deleteHistoryEntry,
    loadFromHistory,
  };
};

export default useCashFlowCalculations;