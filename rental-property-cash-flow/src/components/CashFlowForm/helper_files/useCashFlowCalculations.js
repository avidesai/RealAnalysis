// useCashFlowCalculations.js

import { useState } from 'react';

const initialFormData = {
  purchasePrice: 600000,
  squareFeet: 2000,
  monthlyRentPerUnit: 3000,
  numberOfUnits: 2,
  propertyTaxRate: 0.02,
  vacancyRate: 0.05,  // Stored as 0.05 (5%)
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
  mortgageRate: 0.068,  // Stored as 0.068 (6.8%)
};

const useCashFlowCalculations = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState({});
  const [clickCount, setClickCount] = useState(0);
  const [isCalculateDisabled, setIsCalculateDisabled] = useState(false);
  const [hasAlerted, setHasAlerted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setResults({});
    setClickCount(0);
    setHasAlerted(false);
  };

  const formatNumberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formatCurrency = (value) => {
    const formattedValue = formatNumberWithCommas(Math.abs(value).toFixed(0));
    return value < 0 ? `-$${formattedValue}` : `$${formattedValue}`;
  };

  const calculateValues = () => {
    if (isCalculateDisabled) {
      if (!hasAlerted) {
        alert("You've reached your daily limit of 5 calculations. Upgrade to the Premium Plan for unlimited calculations.");
        setHasAlerted(true);
      }
      return;
    }

    setClickCount((prevCount) => prevCount + 1);
    if (clickCount + 1 >= 5) {
      setIsCalculateDisabled(true);
    }

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
      accountingAdvertisingLegal;

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
    const grossRentMultiplier = purchasePrice / (monthlyRentalIncome * 12);

    const monthlyCashFlow = monthlyGrossIncome - monthlyOperatingExpenses - monthlyMortgagePayment;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCashReturn = annualCashFlow / downPayment;

    setResults({
      capRate,
      propertyValuation,
      cashOnCashReturn,
      monthlyCashFlow,
      annualCashFlow,
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
      dollarPerSquareFoot,
      grossRentMultiplier,
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
    clickCount,
    isCalculateDisabled,
  };
};

export default useCashFlowCalculations;
