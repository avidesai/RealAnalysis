import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import useCalculations from './useCalculations';
import useUndoRedo from './useUndoRedo';

const initialFormData = {
  purchasePrice: 225000,
  monthlyRentPerUnit: 3000,
  numberOfUnits: 1,
  propertyTaxRate: 0.02,
  vacancyRate: 0.05,
  propertyManagementRate: 0.1,
  landlordInsurance: 120,
  maintenanceReserve: 188,
  hoaFees: 0,
  waterAndSewer: 120,
  gasAndElectricity: 0,
  garbage: 30,
  snowRemoval: 0,
  downPaymentPercentage: 0.25,
  lengthOfMortgage: 30,
  mortgageRate: 0.064,
  // BRRRR
  calculatorMode: 'standard',
  estimatedRepairCost: 0,
  afterRepairValue: 0,
  holdingPeriodMonths: 0,
  holdingCostsPerMonth: 0,
  refinanceLTV: 0.75,
  refinanceInterestRate: 0.065,
  refinanceTermYears: 30,
};

const initialPropertyMeta = {
  id: null,
  name: '',
  address: '',
  notes: '',
  listingUrl: '',
};

const useCashFlowCalculations = () => {
  const [formData, setFormData] = useLocalStorage('cashflow-form-data', initialFormData);
  const [propertyMeta, setPropertyMeta] = useLocalStorage('cashflow-property-meta', initialPropertyMeta);
  const { setValue: setFormDataWithHistory, undo, redo, canUndo, canRedo } = useUndoRedo(formData, setFormData);
  const results = useCalculations(formData);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    const parsed = typeof value === 'string' && value !== '' ? parseFloat(value) : value;
    const numericValue = value === '' ? 0 : (isNaN(parsed) ? value : parsed);
    setFormDataWithHistory(prev => {
      const next = { ...prev, [name]: numericValue };
      if (name === 'purchasePrice' && typeof numericValue === 'number') {
        next.maintenanceReserve = Math.round(numericValue * 0.01 / 12);
        next.landlordInsurance = Math.round(numericValue * 0.005 / 12);
      }
      return next;
    });
  }, [setFormDataWithHistory]);

  const batchUpdate = useCallback((updates) => {
    setFormDataWithHistory(prev => ({ ...prev, ...updates }));
  }, [setFormDataWithHistory]);

  const handleMetaChange = useCallback((e) => {
    const { name, value } = e.target;
    setPropertyMeta(prev => ({ ...prev, [name]: value }));
  }, [setPropertyMeta]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setPropertyMeta(initialPropertyMeta);
  }, [setFormData, setPropertyMeta]);

  const loadProperty = useCallback((property) => {
    const { _id, name, address, notes, user, createdAt, updatedAt, __v, ...data } = property;
    setFormData(prev => ({ ...prev, ...data }));
    setPropertyMeta({ id: _id, name: name || '', address: address || '', notes: notes || '', listingUrl: property.listingUrl || '' });
  }, [setFormData, setPropertyMeta]);

  const getPropertyPayload = useCallback(() => {
    return {
      ...formData,
      name: propertyMeta.name,
      address: propertyMeta.address,
      notes: propertyMeta.notes,
    };
  }, [formData, propertyMeta]);

  return {
    formData,
    handleChange,
    batchUpdate,
    propertyMeta,
    handleMetaChange,
    setPropertyMeta,
    resetForm,
    loadProperty,
    getPropertyPayload,
    results,
    formatCurrency,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

export default useCashFlowCalculations;
