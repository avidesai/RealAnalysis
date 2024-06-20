// useCashFlowCalculations.js

import { useState, useEffect } from 'react';

const useCashFlowCalculations = () => {
  const [formData, setFormData] = useState({
    purchasePrice: 120000,
    squareFeet: 2100,
    monthlyRentPerUnit: 1250,
    numberOfUnits: 2,
    propertyTaxRate: 0.0285,
    vacancyRate: 0.1,
    propertyManagementRate: 0.1,
    landlordInsurance: 120,
    replacementReserve: 175,
    hoaFees: 0,
    waterAndSewer: 200,
    gasAndElectricity: 0,
    garbage: 30,
    snowRemoval: 0,
    cablePhoneInternet: 0,
    pestControl: 20,
    accountingAdvertisingLegal: 20,
    desiredCapRate: 0.08,
    downPaymentPercentage: 0.25,
    lengthOfMortgage: 30,
    mortgageRate: 0.072,
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      replacementReserve: Math.round(prevData.squareFeet / 12),
    }));
  }, [formData.squareFeet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : parseFloat(value.replace(/,/g, '')) || 0,
    });
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

    return {
      capRate,
      propertyValuation,
      cashOnCashReturn,
      monthlyCashFlow,
      annualCashFlow,
      replacementReserve,
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
    };
  };

  const results = calculateValues();

  return {
    formData,
    handleChange,
    results,
    formatCurrency,
    formatNumberWithCommas,
  };
};

export default useCashFlowCalculations;
