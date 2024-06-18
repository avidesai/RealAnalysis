import React from 'react';
import cashImg from '../../assets/cash.png';
import useCashFlowCalculations from './useCashFlowCalculations';
import './CashFlowForm.css';

const CashFlowForm = () => {
  const {
    formData,
    handleChange,
    results,
    formatCurrency,
    formatNumberWithCommas,
  } = useCashFlowCalculations();

  return (
    <div className="container">
      <div className='header'>
        <h1>CashFlow.io</h1>
        <img src={cashImg} alt="Cash Flow Logo" className="logo" />
      </div>
      <form className="form">
        <div className="form-group">
          <label>Purchase Price: </label>
          <input type="text" name="purchasePrice" value={formatNumberWithCommas(formData.purchasePrice)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Square Feet: </label>
          <input type="text" name="squareFeet" value={formatNumberWithCommas(formData.squareFeet)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Monthly Rent per Unit: </label>
          <input type="text" name="monthlyRentPerUnit" value={formatNumberWithCommas(formData.monthlyRentPerUnit)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Number of Units: </label>
          <input type="text" name="numberOfUnits" value={formatNumberWithCommas(formData.numberOfUnits)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Property Tax Rate (%): </label>
          <input type="text" name="propertyTaxRate" value={(formData.propertyTaxRate * 100).toFixed(2)} onChange={(e) => handleChange({ target: { name: 'propertyTaxRate', value: (e.target.value / 100).toFixed(4) } })} />
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
          <input type="text" name="vacancyRate" value={(formData.vacancyRate * 100).toFixed(0)} onChange={(e) => handleChange({ target: { name: 'vacancyRate', value: (e.target.value / 100).toFixed(4) } })} />
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
          <input type="text" name="propertyManagementRate" value={(formData.propertyManagementRate * 100).toFixed(0)} onChange={(e) => handleChange({ target: { name: 'propertyManagementRate', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
        <div className="result-item">
          <span>Property Management Fees:</span> <span><strong>{formatCurrency(results.propertyManagementFees)}</strong></span>
        </div>
        <div className="result-item">
          <span>Property Tax:</span> <span><strong>{formatCurrency(results.propertyTax)}</strong></span>
        </div>
        <div className="form-group">
          <label>Landlord Insurance: </label>
          <input type="text" name="landlordInsurance" value={formatNumberWithCommas(formData.landlordInsurance)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Replacement Reserve: </label>
          <input type="text" name="replacementReserve" value={formatNumberWithCommas(formData.replacementReserve)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>HOA Fees: </label>
          <input type="text" name="hoaFees" value={formatNumberWithCommas(formData.hoaFees)} onChange={handleChange} />
        </div>
        
        <h3>Utilities + Other</h3>
        <div className="form-group">
          <label>Water and Sewer: </label>
          <input type="text" name="waterAndSewer" value={formatNumberWithCommas(formData.waterAndSewer)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Gas and Electricity: </label>
          <input type="text" name="gasAndElectricity" value={formatNumberWithCommas(formData.gasAndElectricity)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Garbage: </label>
          <input type="text" name="garbage" value={formatNumberWithCommas(formData.garbage)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Snow Removal: </label>
          <input type="text" name="snowRemoval" value={formatNumberWithCommas(formData.snowRemoval)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Cable, Phone, Internet: </label>
          <input type="text" name="cablePhoneInternet" value={formatNumberWithCommas(formData.cablePhoneInternet)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Pest Control: </label>
          <input type="text" name="pestControl" value={formatNumberWithCommas(formData.pestControl)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Accounting, Advertising, and Legal: </label>
          <input type="text" name="accountingAdvertisingLegal" value={formatNumberWithCommas(formData.accountingAdvertisingLegal)} onChange={handleChange} />
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
          <input type="text" name="desiredCapRate" value={(formData.desiredCapRate * 100).toFixed(2)} onChange={(e) => handleChange({ target: { name: 'desiredCapRate', value: (e.target.value / 100).toFixed(4) } })} />
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
          <input type="text" name="downPaymentPercentage" value={(formData.downPaymentPercentage * 100).toFixed(0)} onChange={(e) => handleChange({ target: { name: 'downPaymentPercentage', value: (e.target.value / 100).toFixed(4) } })} />
        </div>
        <div className="result-item">
          <span>Down Payment:</span> <span><strong>{formatCurrency(results.downPayment)}</strong></span>
        </div>
        <div className="result-item">
          <span>Loan Amount:</span> <span><strong>{formatCurrency(results.loanAmount)}</strong></span>
        </div>
        <div className="form-group">
          <label>Length of Mortgage (years): </label>
          <input type="text" name="lengthOfMortgage" value={formatNumberWithCommas(formData.lengthOfMortgage)} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Mortgage Rate (%): </label>
          <input type="text" name="mortgageRate" value={(formData.mortgageRate * 100).toFixed(2)} onChange={(e) => handleChange({ target: { name: 'mortgageRate', value: (e.target.value / 100).toFixed(4) } })} />
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
