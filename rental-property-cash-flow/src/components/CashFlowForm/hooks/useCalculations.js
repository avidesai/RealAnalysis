// src/components/CashFlowForm/hooks/useCalculations.js
import { useMemo } from 'react';

const useCalculations = (formData) => {
  const results = useMemo(() => {
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
      calculatorMode,
    } = formData;

    const isSTR = calculatorMode === 'str';

    if (!purchasePrice || !numberOfUnits) {
      return null;
    }

    if (isSTR && !formData.nightlyRate) {
      return null;
    }

    if (!isSTR && !monthlyRentPerUnit) {
      return null;
    }

    // Monthly Income Calculations
    let monthlyRentalIncome, vacancyLoss, monthlyGrossIncome;
    let str = null;

    if (isSTR) {
      const nightlyRate = formData.nightlyRate || 0;
      const occupancyRate = formData.occupancyRate || 0.70;
      const avgStay = formData.averageStayLength || 3;
      const cleaningCost = formData.cleaningCostPerTurnover || 0;
      const platformFeeRate = formData.platformFeeRate || 0.03;

      const monthlyOccupiedNights = 30 * occupancyRate * numberOfUnits;
      const monthlyTurnovers = monthlyOccupiedNights / avgStay;
      const monthlyGrossRevenue = nightlyRate * monthlyOccupiedNights;
      const monthlyPlatformFees = monthlyGrossRevenue * platformFeeRate;
      const monthlyCleaningCosts = cleaningCost * monthlyTurnovers;

      monthlyRentalIncome = monthlyGrossRevenue;
      vacancyLoss = nightlyRate * (30 - 30 * occupancyRate) * numberOfUnits;
      monthlyGrossIncome = monthlyGrossRevenue - monthlyPlatformFees - monthlyCleaningCosts;

      str = {
        nightlyRate,
        occupancyRate,
        monthlyOccupiedNights,
        monthlyTurnovers,
        monthlyGrossRevenue,
        monthlyPlatformFees,
        monthlyCleaningCosts,
        revPAR: monthlyGrossRevenue / (30 * numberOfUnits),
      };
    } else {
      monthlyRentalIncome = monthlyRentPerUnit * numberOfUnits;
      vacancyLoss = monthlyRentalIncome * vacancyRate;
      monthlyGrossIncome = monthlyRentalIncome - vacancyLoss;
    }

    // Operating Expense Calculations
    const propertyManagementFees = monthlyGrossIncome * propertyManagementRate;
    const propertyTax = (propertyTaxRate * purchasePrice) / 12;
    const monthlyOperatingExpenses = propertyManagementFees + propertyTax +
      (formData.landlordInsurance || 0) + (formData.hoaFees || 0) + (formData.waterAndSewer || 0) +
      (formData.gasAndElectricity || 0) + (formData.garbage || 0) + (formData.snowRemoval || 0) +
      (formData.maintenanceReserve || 0);

    // Income Calculations
    const monthlyNOI = monthlyGrossIncome - monthlyOperatingExpenses;
    const annualNOI = monthlyNOI * 12;

    // Mortgage Calculations
    const downPayment = purchasePrice * downPaymentPercentage;
    const loanAmount = purchasePrice - downPayment;
    const monthlyRate = mortgageRate / 12;
    const numPayments = lengthOfMortgage * 12;
    const monthlyMortgagePayment = loanAmount > 0 && monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;

    // Final Metrics
    const monthlyCashFlow = monthlyNOI - monthlyMortgagePayment;
    const annualCashFlow = monthlyCashFlow * 12;
    const capRate = purchasePrice > 0 ? annualNOI / purchasePrice : 0;
    const cashOnCashReturn = downPayment > 0 ? annualCashFlow / downPayment : 0;
    const grossRentMultiplier = monthlyRentalIncome > 0 ? purchasePrice / (monthlyRentalIncome * 12) : 0;

    // BRRRR calculations
    let brrrr = null;
    if (formData.calculatorMode === 'brrrr') {
      const repairCost = formData.estimatedRepairCost || 0;
      const arv = formData.afterRepairValue || 0;
      const holdMonths = formData.holdingPeriodMonths || 0;
      const holdCostPerMonth = formData.holdingCostsPerMonth || 0;
      const refiLTV = formData.refinanceLTV || 0.75;
      const refiRate = formData.refinanceInterestRate || 0.065;
      const refiYears = formData.refinanceTermYears || 30;

      const totalInvestment = purchasePrice + repairCost + (holdCostPerMonth * holdMonths);
      const newLoanAmount = arv * refiLTV;
      const cashLeftInDeal = totalInvestment - newLoanAmount;

      // New mortgage payment after refinance
      const refiMonthlyRate = refiRate / 12;
      const refiNumPayments = refiYears * 12;
      const newMonthlyMortgage = newLoanAmount > 0 && refiMonthlyRate > 0
        ? (newLoanAmount * refiMonthlyRate * Math.pow(1 + refiMonthlyRate, refiNumPayments)) /
          (Math.pow(1 + refiMonthlyRate, refiNumPayments) - 1)
        : 0;

      const newMonthlyCashFlow = monthlyNOI - newMonthlyMortgage;
      const newAnnualCashFlow = newMonthlyCashFlow * 12;
      const brrrrCashOnCash = cashLeftInDeal > 0
        ? newAnnualCashFlow / cashLeftInDeal
        : (newAnnualCashFlow > 0 ? Infinity : 0);

      brrrr = {
        totalInvestment,
        newLoanAmount,
        cashLeftInDeal,
        newMonthlyMortgage,
        newMonthlyCashFlow,
        newAnnualCashFlow,
        brrrrCashOnCash,
      };
    }

    return {
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
      brrrr,
      str,
    };
  }, [formData]);

  return results;
};

export default useCalculations;
