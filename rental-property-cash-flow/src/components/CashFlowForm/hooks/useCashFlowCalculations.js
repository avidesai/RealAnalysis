import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import useCalculations from './useCalculations';

const initialFormData = {
  purchasePrice: 225000,
  monthlyRentPerUnit: 3000,
  numberOfUnits: 1,
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

const initialPropertyMeta = {
  id: null,
  name: '',
  address: '',
  notes: '',
};

const useCashFlowCalculations = () => {
  const [formData, setFormData] = useLocalStorage('cashflow-form-data', initialFormData);
  const [propertyMeta, setPropertyMeta] = useLocalStorage('cashflow-property-meta', initialPropertyMeta);
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
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  }, [setFormData]);

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
    setPropertyMeta({ id: _id, name: name || '', address: address || '', notes: notes || '' });
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
    propertyMeta,
    handleMetaChange,
    setPropertyMeta,
    resetForm,
    loadProperty,
    getPropertyPayload,
    results,
    formatCurrency,
  };
};

export default useCashFlowCalculations;
