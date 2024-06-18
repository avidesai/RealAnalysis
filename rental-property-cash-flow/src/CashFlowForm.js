import React, { useState } from 'react';
import './CashFlowForm.css';

const CashFlowForm = () => {
  const [formData, setFormData] = useState({
    purchasePrice: 0,
    squareFeet: 0,
    monthlyRentPerUnit: 0,
    numberOfUnits: 0,
    propertyTaxRate: 0.02,
    vacancyRate: 0.1,
    landlordInsurance: 120,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : parseFloat(value) || 0,
    });
  };

  const formatCurrency = (value) => {
    const formattedValue = Math.abs(value).toFixed(0);
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
    const yearlyGrossIncome = monthlyGrossIncome * 12;

    const propertyTax = (propertyTaxRate * purchasePrice) / 12;
    const replacementReserve = squareFeet / 12;
    const monthlyOperatingExpenses =
      propertyTax +
      landlordInsurance +
      replacementReserve +
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
        ? -(loanAmount * mortgageRate / 12 * Math.pow(1 + mortgageRate / 12, lengthOfMortgage * 12)) /
          (Math.pow(1 + mortgageRate / 12, lengthOfMortgage * 12) - 1)
        : 0;
    const annualDebtService = monthlyMortgagePayment * 12;

    const capRate = annualNetOperatingIncome / purchasePrice;
    const propertyValuation = annualNetOperatingIncome / desiredCapRate;

    const cashOnCashReturn = annualNetOperatingIncome / downPayment;

    const monthlyCashFlow = monthlyGrossIncome - monthlyOperatingExpenses - monthlyMortgagePayment;
    const annualCashFlow = monthlyCashFlow * 12;

    return {
      capRate,
      propertyValuation,
      cashOnCashReturn,
      monthlyCashFlow,
      annualCashFlow,
    };
  };

  const results = calculateValues();

  return (
    <div className="container">
      <h1>Rental Property Cash Flow Analysis</h1>
      <form className="form">
        <h2>Property Information</h2>
        <div className="form-group">
          <label>Purchase Price: </label>
          <input type="number" step="10000" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Square Feet: </label>
          <input type="number" step="100" name="squareFeet" value={formData.squareFeet} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Monthly Rent per Unit: </label>
          <input type="number" step="100" name="monthlyRentPerUnit" value={formData.monthlyRentPerUnit} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Number of Units: </label>
          <input type="number" name="numberOfUnits" value={formData.numberOfUnits} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Property Tax Rate (%): </label>
          <input type="number" step="0.10" name="propertyTaxRate" value={(formData.propertyTaxRate * 100).toFixed(2)} onChange={(e) => handleChange({ target: { name: 'propertyTaxRate', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
        <div className="form-group">
          <label>Vacancy Rate (%): </label>
          <input type="number" step="1.00" name="vacancyRate" value={(formData.vacancyRate * 100).toFixed(0)} onChange={(e) => handleChange({ target: { name: 'vacancyRate', value: (e.target.value / 100).toFixed(4) } })} />
        </div>

        <h2>Monthly Operating Expenses</h2>
        <div className="form-group">
          <label>Landlord Insurance: </label>
          <input type="number" step="10" name="landlordInsurance" value={formData.landlordInsurance} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>HOA Fees: </label>
          <input type="number" step="100" name="hoaFees" value={formData.hoaFees} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Water and Sewer: </label>
          <input type="number" step="10" name="waterAndSewer" value={formData.waterAndSewer} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Gas and Electricity: </label>
          <input type="number" step="10" name="gasAndElectricity" value={formData.gasAndElectricity} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Garbage: </label>
          <input type="number" step="10" name="garbage" value={formData.garbage} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Snow Removal: </label>
          <input type="number" step="5" name="snowRemoval" value={formData.snowRemoval} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Cable, Phone, Internet: </label>
          <input type="number" step="5" name="cablePhoneInternet" value={formData.cablePhoneInternet} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Pest Control: </label>
          <input type="number" step="5" name="pestControl" value={formData.pestControl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Accounting, Advertising, and Legal: </label>
          <input type="number" step="5" name="accountingAdvertisingLegal" value={formData.accountingAdvertisingLegal} onChange={handleChange} />
        </div>

        <h2>Cap Rate and Valuation</h2>
        <div className="form-group">
          <label>Desired Cap Rate (%): </label>
          <input type="number" step="0.10" name="desiredCapRate" value={(formData.desiredCapRate * 100).toFixed(2)} onChange={(e) => handleChange({ target: { name: 'desiredCapRate', value: (e.target.value / 100).toFixed(4) } })} />
        </div>

        <h2>Loan Information</h2>
        <div className="form-group">
          <label>Down Payment Percentage (%): </label>
          <input type="number" step="5.00" name="downPaymentPercentage" value={(formData.downPaymentPercentage * 100).toFixed(0)} onChange={(e) => handleChange({ target: { name: 'downPaymentPercentage', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
        <div className="form-group">
          <label>Length of Mortgage (Years): </label>
          <input type="number" name="lengthOfMortgage" value={formData.lengthOfMortgage} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Mortgage Rate (%): </label>
          <input type="number" step="0.10" name="mortgageRate" value={(formData.mortgageRate * 100).toFixed(2)} onChange={(e) => handleChange({ target: { name: 'mortgageRate', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
      </form>

      <div className="results">
        <h2>Results</h2>
        <div className="result-item">
          <span>Cap Rate:</span> <span>{(results.capRate * 100).toFixed(2)}%</span>
        </div>
        <div className="result-item">
          <span>Cash on Cash Return:</span> <span>{(results.cashOnCashReturn * 100).toFixed(2)}%</span>
        </div>
        <div className="result-item">
          <span>Monthly Cash Flow:</span> 
          <span className={results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}>
            {formatCurrency(results.monthlyCashFlow)}
          </span>
        </div>
        <div className="result-item">
          <span>Annual Cash Flow:</span> 
          <span className={results.annualCashFlow >= 0 ? 'positive' : 'negative'}>
            {formatCurrency(results.annualCashFlow)}
          </span>
        </div>
        <div className="result-item">
          <span>Property Valuation:</span> <span>${results.propertyValuation.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
};

export default CashFlowForm;
