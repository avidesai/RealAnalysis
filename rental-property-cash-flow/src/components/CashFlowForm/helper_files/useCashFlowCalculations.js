import { useState, useEffect } from 'react';

const initialFormData = {
  purchasePrice: 400000,
  squareFeet: 2500,
  monthlyRentPerUnit: 1300,
  numberOfUnits: 4,
  propertyTaxRate: 0.0200,
  vacancyRate: 0.1,
  propertyManagementRate: 0.1,
  landlordInsurance: 120,
  replacementReserve: Math.round(2500 / 12),
  hoaFees: 0,
  waterAndSewer: 200,
  gasAndElectricity: 0,
  garbage: 30,
  snowRemoval: 0,
  cablePhoneInternet: 0,
  pestControl: 20,
  accountingAdvertisingLegal: 20,
  desiredCapRate: 0.10,
  downPaymentPercentage: 0.25,
  lengthOfMortgage: 30,
  mortgageRate: 0.072,
};

const useCashFlowCalculations = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState({});

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      replacementReserve: Math.round(prevData.squareFeet / 12),
    }));
  }, [formData.squareFeet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value === '' ? '' : parseFloat(value.replace(/,/g, '')) || value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setResults({});
  };

  const formatNumberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatCurrency = (value) => {
    const formattedValue = formatNumberWithCommas(Math.abs(value).toFixed(0));
    return value < 0 ? `-$${formattedValue}` : `$${formattedValue}`;
  };

  const calculateValues = () => {
    const {
      purchasePrice,
      squareFeet,
      monthlyRentPerUnit,
      numberOfUnits,
      propertyTaxRate,
      vacancyRate,
      propertyManagementRate,
      landlordInsurance,
      hoaFees,
      waterAndSewer,
      gasAndElectricity,
      garbage,
      snowRemoval,
      cablePhoneInternet,
      pestControl,
      accountingAdvertisingLegal,
      desiredCapRate,
      downPaymentPercentage,
      lengthOfMortgage,
      mortgageRate,
      replacementReserve
    } = formData;

    const monthlyRentalIncome = monthlyRentPerUnit * numberOfUnits;
    const vacancyLoss = monthlyRentalIncome * vacancyRate;
    const monthlyGrossIncome = monthlyRentalIncome - vacancyLoss;

    const propertyManagementFees = monthlyRentalIncome * propertyManagementRate;
    const propertyTax = (propertyTaxRate * purchasePrice) / 12;
    const monthlyOperatingExpenses =
      propertyManagementFees +
      propertyTax +
      landlordInsurance +
      hoaFees +
      waterAndSewer +
      gasAndElectricity +
      garbage +
      snowRemoval +
      cablePhoneInternet +
      pestControl +
      accountingAdvertisingLegal +
      replacementReserve;

    const annualOperatingIncome = monthlyGrossIncome * 12;
    const annualOperatingExpenses = monthlyOperatingExpenses * 12;
    const annualNetOperatingIncome = annualOperatingIncome - annualOperatingExpenses;

    const downPayment = purchasePrice * downPaymentPercentage;
    const loanAmount = purchasePrice - downPayment;
    const monthlyMortgagePayment =
      loanAmount > 0
        ? (loanAmount * mortgageRate / 12 * Math.pow(1 + mortgageRate / 12, lengthOfMortgage * 12)) /
          (Math.pow(1 + mortgageRate / 12, lengthOfMortgage * 12) - 1)
        : 0;

    const capRate = annualNetOperatingIncome / purchasePrice;
    const propertyValuation = annualNetOperatingIncome / desiredCapRate;
    const dollarPerSquareFoot = purchasePrice / squareFeet;

    const monthlyCashFlow = monthlyGrossIncome - monthlyOperatingExpenses - monthlyMortgagePayment;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCashReturn = annualCashFlow / downPayment;

    setResults({
      capRate,
      propertyValuation,
      cashOnCashReturn,
      monthlyCashFlow,
      annualCashFlow,
      replacementReserve: Math.round(squareFeet / 12),
      monthlyOperatingExpenses,
      annualOperatingIncome,
      annualOperatingExpenses,
      annualNetOperatingIncome,
      monthlyMortgagePayment,
      downPayment,
      loanAmount,
      propertyManagementFees,
      propertyTax,
      monthlyGrossIncome,
      vacancyLoss,
      monthlyRentalIncome,
      dollarPerSquareFoot
    });
  };

  return {
    formData,
    handleChange,
    resetForm,
    results,
    formatCurrency,
    formatNumberWithCommas,
    calculateValues,
  };
};

export default useCashFlowCalculations;
