import React, { useState, useEffect } from 'react';
import './MultiYearProjections.css';

const MultiYearProjections = ({ formData, results, formatCurrency }) => {
  const [projections, setProjections] = useState([]);

  useEffect(() => {
    const generateProjections = () => {
      const {
        purchasePrice,
        monthlyRentPerUnit,
        numberOfUnits,
        propertyTaxRate,
        landlordInsurance,
        hoaFees,
        waterAndSewer,
        gasAndElectricity,
        garbage,
        mortgageRate,
        lengthOfMortgage,
        // propertyManagementRate, // Commented out since it's not used
        // vacancyRate, // Commented out since it's not used
      } = formData;

      const initialRentalIncome = monthlyRentPerUnit * numberOfUnits * 12;
      const initialOperatingExpenses =
        propertyTaxRate * purchasePrice +
        landlordInsurance +
        hoaFees +
        waterAndSewer +
        gasAndElectricity +
        garbage;
      const mortgagePayment =
        (purchasePrice * (1 - formData.downPaymentPercentage)) * mortgageRate /
        (1 - Math.pow(1 + mortgageRate, -lengthOfMortgage * 12));

      const projections = [];

      for (let year = 1; year <= 10; year++) {
        const rentalIncome = initialRentalIncome * Math.pow(1 + 0.02, year - 1);
        const operatingExpenses = initialOperatingExpenses * Math.pow(1 + 0.03, year - 1);
        const netOperatingIncome = rentalIncome - operatingExpenses;
        const cashFlow = netOperatingIncome - mortgagePayment * 12;
        const cashOnCashReturn = (cashFlow / (purchasePrice * formData.downPaymentPercentage)) * 100;

        projections.push({
          year,
          rentalIncome,
          operatingExpenses,
          netOperatingIncome,
          cashFlow,
          cashOnCashReturn,
        });
      }

      setProjections(projections);
    };

    generateProjections();
  }, [formData]); // `generateProjections` is now inline, so we depend on `formData`

  return (
    <div className="multi-year-projections-container">
      <h2>Multi-Year Projections</h2>
      <table className="projections-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Rental Income</th>
            <th>Operating Expenses</th>
            <th>Net Operating Income</th>
            <th>Cash Flow</th>
            <th>Cash on Cash Return (%)</th>
          </tr>
        </thead>
        <tbody>
          {projections.map((projection) => (
            <tr key={projection.year}>
              <td>{projection.year}</td>
              <td>{formatCurrency(projection.rentalIncome)}</td>
              <td>{formatCurrency(projection.operatingExpenses)}</td>
              <td>{formatCurrency(projection.netOperatingIncome)}</td>
              <td>{formatCurrency(projection.cashFlow)}</td>
              <td>{projection.cashOnCashReturn.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MultiYearProjections;
