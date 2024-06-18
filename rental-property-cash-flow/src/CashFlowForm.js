// CashFlowForm.js

import React, { useState } from 'react';
import cashImg from './assets/cash.png';
import './CashFlowForm.css';

const CashFlowForm = () => {
  const [formData, setFormData] = useState({
    purchasePrice: 120000,
    squareFeet: 2100,
    monthlyRentPerUnit: 1250,
    numberOfUnits: 2,
    propertyTaxRate: 0.0285,
    vacancyRate: 0.1,
    propertyManagementRate: 0.1,
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
    const replacementReserve = squareFeet / 12;
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
      monthlyRentalIncome
    };
  };

  const results = calculateValues();

  return (
    <div className="container">
      <div className='header'>
        <h1>CashFlow.io</h1>
        <img src={cashImg} alt="Cash Flow Logo" className="logo" />
      </div>
      <form className="form">
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
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Cap Rate:</span> <span><strong>{(results.capRate * 100).toFixed(2)}%</strong></span>
        </div>
        <div className="result-item">
          <span>Cash on Cash Return:</span> <span><strong>{(results.cashOnCashReturn * 100).toFixed(2)}%</strong></span>
        </div>
        <div className="result-item">
          <span>Monthly Cash Flow:</span> 
          <span className={results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}>
            <strong>{formatCurrency(results.monthlyCashFlow)}</strong>
          </span>
        </div>
        <div className="result-item">
          <span>Annual Cash Flow:</span> 
          <span className={results.annualCashFlow >= 0 ? 'positive' : 'negative'}>
            <strong>{formatCurrency(results.annualCashFlow)}</strong>
          </span>
        </div>
        <div className="form-divider"></div>

        <h2>Monthly Gross Income</h2>
        <div className="result-item">
          <span>Monthly Rental Income:</span> <span><strong>{formatCurrency(results.monthlyRentalIncome)}</strong></span>
        </div>
        <div className="form-group">
          <label>Vacancy Rate (%): </label>
          <input type="number" step="1.00" name="vacancyRate" value={(formData.vacancyRate * 100).toFixed(0)} onChange={(e) => handleChange({ target: { name: 'vacancyRate', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
        <div className="result-item">
          <span>Vacancy Loss:</span> <span><strong>{formatCurrency(results.vacancyLoss)}</strong></span>
        </div>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Monthly Gross Income:</span> <span className="positive"><strong>{formatCurrency(results.monthlyGrossIncome)}</strong></span>
        </div>

        <h2>Monthly Operating Expenses</h2>
        <div className="form-group">
          <label>Property Management Rate (%): </label>
          <input type="number" step="0.10" name="propertyManagementRate" value={(formData.propertyManagementRate * 100).toFixed(0)} onChange={(e) => handleChange({ target: { name: 'propertyManagementRate', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
        <div className="result-item">
          <span>Property Management Fees:</span> <span><strong>{formatCurrency(results.propertyManagementFees)}</strong></span>
        </div>
        <div className="result-item">
          <span>Property Tax:</span> <span><strong>{formatCurrency(results.propertyTax)}</strong></span>
        </div>
        <div className="form-group">
          <label>Landlord Insurance: </label>
          <input type="number" step="10" name="landlordInsurance" value={formData.landlordInsurance} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Replacement Reserve: </label>
          <input type="number" step="100" name="replacementReserve" value={results.replacementReserve.toFixed(0)} readOnly />
        </div>
        <div className="form-group">
          <label>HOA Fees: </label>
          <input type="number" step="10" name="hoaFees" value={formData.hoaFees} onChange={handleChange} />
        </div>
        
        <h3>Utilities + Other</h3>
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
          <input type="number" step="5" name="garbage" value={formData.garbage} onChange={handleChange} />
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
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Monthly Operating Expenses:</span> <span className="negative"><strong>{formatCurrency(results.monthlyOperatingExpenses)}</strong></span>
        </div>

        <h2>Net Operating Income</h2>
        <div className="result-item">
          <span>Monthly Operating Income:</span> <span>{formatCurrency(results.monthlyGrossIncome)}</span>
        </div>
        <div className="result-item">
          <span>Monthly Operating Expenses:</span> <span>{formatCurrency(results.monthlyOperatingExpenses)}</span>
        </div>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Monthly Net Operating Income:</span> <span className="positive"><strong>{formatCurrency(results.monthlyGrossIncome - results.monthlyOperatingExpenses)}</strong></span>
        </div>

        <h2>Cap Rate and Valuation</h2>
        <div className="form-group">
          <label>Desired Cap Rate (%): </label>
          <input type="number" step="0.50" name="desiredCapRate" value={(formData.desiredCapRate * 100).toFixed(2)} onChange={(e) => handleChange({ target: { name: 'desiredCapRate', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
        <div className="result-item">
          <span>Property Valuation (Offer Price):</span> <span><strong>{formatCurrency(results.propertyValuation)}</strong></span>
        </div>
        <div className="result-item">
          <span>Purchase Price:</span> <span>{formatCurrency(formData.purchasePrice)}</span>
        </div>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Cap Rate:</span> <span><strong>{(results.capRate * 100).toFixed(2)}%</strong></span>
        </div>

        <h2>Loan Information</h2>
        <div className="form-group">
          <label>Down Payment Percentage (%): </label>
          <input type="number" step="5.00" name="downPaymentPercentage" value={(formData.downPaymentPercentage * 100).toFixed(0)} onChange={(e) => handleChange({ target: { name: 'downPaymentPercentage', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
        <div className="result-item">
          <span>Down Payment:</span> <span><strong>{formatCurrency(results.downPayment)}</strong></span>
        </div>
        <div class="result-item">
          <span>Loan Amount:</span> <span><strong>{formatCurrency(results.loanAmount)}</strong></span>
        </div>
        <div className="form-group">
          <label>Length of Mortgage (years): </label>
          <input type="number" step="1" name="lengthOfMortgage" value={formData.lengthOfMortgage} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Mortgage Rate (%): </label>
          <input type="number" step="0.10" name="mortgageRate" value={(formData.mortgageRate * 100).toFixed(2)} onChange={(e) => handleChange({ target: { name: 'mortgageRate', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Monthly Debt Service:</span> <span className="negative"><strong>{formatCurrency(results.monthlyMortgagePayment)}</strong></span>
        </div>

        <h2>Cash Flow and ROI</h2>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Cash on Cash Return:</span> <span><strong>{(results.cashOnCashReturn * 100).toFixed(2)}%</strong></span>
        </div>
        <div className="result-item">
          <span>Monthly Cash Flow:</span> 
          <span className={results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}>
            <strong>{formatCurrency(results.monthlyCashFlow)}</strong>
          </span>
        </div>
        <div className="result-item">
          <span>Annual Cash Flow:</span> 
          <span className={results.annualCashFlow >= 0 ? 'positive' : 'negative'}>
            <strong>{formatCurrency(results.annualCashFlow)}</strong>
          </span>
        </div>
      </form>
    </div>
  );
};

export default CashFlowForm;
