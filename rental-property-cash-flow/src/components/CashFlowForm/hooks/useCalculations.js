// src/components/CashFlowForm/hooks/useCalculations.js
import { useState } from 'react';

const useCalculations = (formData) => {
  const [calculationResults, setCalculationResults] = useState({});

  const calculateValues = () => {
    const {
      monthlyRentPerUnit,
      numberOfUnits,
      propertyTaxRate,
      vacancyRate,
      propertyManagementRate,
      purchasePrice,
      downPaymentPercentage,
      mortgageRate,
      lengthOfMortgage,
    } = formData;

    // Monthly Income Calculations
    const monthlyRentalIncome = monthlyRentPerUnit * numberOfUnits;
    const vacancyLoss = monthlyRentalIncome * vacancyRate;
    const monthlyGrossIncome = monthlyRentalIncome - vacancyLoss;

    // Operating Expense Calculations
    const propertyManagementFees = monthlyRentalIncome * propertyManagementRate;
    const propertyTax = (propertyTaxRate * purchasePrice) / 12;
    const monthlyOperatingExpenses = propertyManagementFees + propertyTax +
      formData.landlordInsurance + formData.hoaFees + formData.waterAndSewer +
      formData.gasAndElectricity + formData.garbage + formData.snowRemoval;

    // Income Calculations
    const monthlyNOI = monthlyGrossIncome - monthlyOperatingExpenses;
    const annualNOI = monthlyNOI * 12;

    // Mortgage Calculations
    const downPayment = purchasePrice * downPaymentPercentage;
    const loanAmount = purchasePrice - downPayment;
    const monthlyRate = mortgageRate / 12;
    const numPayments = lengthOfMortgage * 12;
    const monthlyMortgagePayment = loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;

    // Final Metrics
    const monthlyCashFlow = monthlyNOI - monthlyMortgagePayment;
    const annualCashFlow = monthlyCashFlow * 12;
    const capRate = annualNOI / purchasePrice;
    const cashOnCashReturn = annualCashFlow / downPayment;
    const grossRentMultiplier = purchasePrice / (monthlyRentalIncome * 12);

    setCalculationResults({
      monthlyRentalIncome,
      vacancyLoss,
      monthlyGrossIncome,
      propertyManagementFees,
      propertyTax,
      monthlyOperatingExpenses,
      monthlyNOI,
      annualNOI,
      monthlyMortgagePayment,
      downPayment,
      loanAmount,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
      grossRentMultiplier,
    });
  };

  return [calculationResults, calculateValues];
};

export default useCalculations;