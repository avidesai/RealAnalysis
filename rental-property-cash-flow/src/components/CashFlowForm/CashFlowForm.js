import React from 'react';
import useCashFlowCalculations from './helper_files/useCashFlowCalculations';
import FormattedNumberInput from './helper_files/FormattedNumberInput';
import FormattedPercentInput from './helper_files/FormattedPercentInput';
import './CashFlowForm.css';

const CashFlowForm = () => {
  const {
    formData,
    handleChange,
    results,
    formatCurrency,
    calculateValues,
  } = useCashFlowCalculations();

  return (
    <div className="container">
      <div className='header'>
        <h1>CashFlow.io</h1>
      </div>
      <div className="form-divider"></div>
      <form className="form">
        <div className="form-group">
          <label>Purchase Price: </label>
          <FormattedNumberInput step="10000" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Square Feet: </label>
          <FormattedNumberInput step="100" name="squareFeet" value={formData.squareFeet} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Monthly Rent per Unit: </label>
          <FormattedNumberInput step="100" name="monthlyRentPerUnit" value={formData.monthlyRentPerUnit} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Number of Units: </label>
          <FormattedNumberInput step="1" name="numberOfUnits" value={formData.numberOfUnits} onChange={handleChange} />
        </div>
        
        <button type="button" className="calculate-button" onClick={calculateValues}>Calculate</button>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Cap Rate:</span> <span><strong>{results.capRate !== undefined ? (results.capRate * 100).toFixed(2) + '%' : ''}</strong></span>
        </div>
        <div className="result-item">
          <span>Cash on Cash Return:</span> <span><strong>{results.cashOnCashReturn !== undefined ? (results.cashOnCashReturn * 100).toFixed(2) + '%' : ''}</strong></span>
        </div>
        <div className="result-item">
          <span>Monthly Cash Flow:</span> 
          <span className={results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}>
            <strong>{results.monthlyCashFlow !== undefined ? formatCurrency(results.monthlyCashFlow) : ''}</strong>
          </span>
        </div>
        <div className="result-item">
          <span>Annual Cash Flow:</span> 
          <span className={results.annualCashFlow >= 0 ? 'positive' : 'negative'}>
            <strong>{results.annualCashFlow !== undefined ? formatCurrency(results.annualCashFlow) : ''}</strong>
          </span>
        </div>
        <div className="form-divider"></div>

        <h2>Monthly Gross Income</h2>
        <div className="result-item">
          <span>Monthly Rental Income:</span> <span><strong>{results.monthlyRentalIncome !== undefined ? formatCurrency(results.monthlyRentalIncome) : ''}</strong></span>
        </div>
        <div className="form-group">
          <label>Vacancy Rate (%): </label>
          <FormattedPercentInput step="1.00" name="vacancyRate" value={formData.vacancyRate} onChange={handleChange} decimalPlaces={0} />
        </div>
        <div className="result-item">
          <span>Vacancy Loss:</span> <span className='negative'><strong>{results.vacancyLoss !== undefined ? formatCurrency(results.vacancyLoss) : ''}</strong></span>
        </div>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Monthly Gross Income:</span> <span className="positive"><strong>{results.monthlyGrossIncome !== undefined ? formatCurrency(results.monthlyGrossIncome) : ''}</strong></span>
        </div>
        <div className="form-divider"></div>

        <h2>Monthly Operating Expenses</h2>
        <div className="form-group">
          <label>Property Management Rate (%): </label>
          <FormattedPercentInput step="1.00" name="propertyManagementRate" value={formData.propertyManagementRate} onChange={handleChange} decimalPlaces={0} />
        </div>
        <div className="result-item">
          <span>Property Management Fees:</span> <span><strong>{results.propertyManagementFees !== undefined ? formatCurrency(results.propertyManagementFees) : ''}</strong></span>
        </div>
        <div className="form-group">
          <label>Property Tax Rate (%): </label>
          <FormattedPercentInput step="0.05" name="propertyTaxRate" value={formData.propertyTaxRate} onChange={handleChange} />
        </div>
        <div className="result-item">
          <span>Property Taxes:</span> <span><strong>{results.propertyTax !== undefined ? formatCurrency(results.propertyTax) : ''}</strong></span>
        </div>
        <div className="form-group">
          <label>Landlord Insurance: </label>
          <FormattedNumberInput step="10" name="landlordInsurance" value={formData.landlordInsurance} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Replacement Reserve: </label>
          <FormattedNumberInput step="10" name="replacementReserve" value={formData.replacementReserve} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>HOA Fees: </label>
          <FormattedNumberInput step="10" name="hoaFees" value={formData.hoaFees} onChange={handleChange} />
        </div>
        
        <h3>Utilities + Other Monthly Expenses</h3>
        <div className="form-group">
          <label>Water and Sewer: </label>
          <FormattedNumberInput step="10" name="waterAndSewer" value={formData.waterAndSewer} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Gas and Electricity: </label>
          <FormattedNumberInput step="10" name="gasAndElectricity" value={formData.gasAndElectricity} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Garbage: </label>
          <FormattedNumberInput step="5" name="garbage" value={formData.garbage} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Snow Removal: </label>
          <FormattedNumberInput step="5" name="snowRemoval" value={formData.snowRemoval} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Cable, Phone, Internet: </label>
          <FormattedNumberInput step="5" name="cablePhoneInternet" value={formData.cablePhoneInternet} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Pest Control: </label>
          <FormattedNumberInput step="5" name="pestControl" value={formData.pestControl} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Accounting, Advertising, and Legal: </label>
          <FormattedNumberInput step="5" name="accountingAdvertisingLegal" value={formData.accountingAdvertisingLegal} onChange={handleChange} />
        </div>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Monthly Operating Expenses:</span> <span className="negative"><strong>{results.monthlyOperatingExpenses !== undefined ? formatCurrency(results.monthlyOperatingExpenses) : ''}</strong></span>
        </div>
        <div className="form-divider"></div>

        <h2>Net Operating Income</h2>
        <div className="result-item">
          <span>Monthly Operating Income:</span> <span>{results.monthlyGrossIncome !== undefined ? formatCurrency(results.monthlyGrossIncome) : ''}</span>
        </div>
        <div className="result-item">
          <span>Monthly Operating Expenses:</span> <span className='negative'>{results.monthlyOperatingExpenses !== undefined ? formatCurrency(results.monthlyOperatingExpenses) : ''}</span>
        </div>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Monthly Net Operating Income:</span> <span className="positive"><strong>{results.monthlyGrossIncome !== undefined && results.monthlyOperatingExpenses !== undefined ? formatCurrency(results.monthlyGrossIncome - results.monthlyOperatingExpenses) : ''}</strong></span>
        </div>
        <div className="form-divider"></div>

        <h2>Cap Rate and Valuation</h2>
        <div className="result-item">
          <span>Purchase Price:</span> <span>{formatCurrency(formData.purchasePrice)}</span>
        </div>
        <div className="result-item">
          <span>Dollar per Square Foot:</span> <span><strong>{results.dollarPerSquareFoot !== undefined ? formatCurrency(results.dollarPerSquareFoot) : ''}</strong></span>
        </div>
        <div className="form-group">
          <label>Desired Cap Rate (%): </label>
          <FormattedPercentInput step="1.00" name="desiredCapRate" value={formData.desiredCapRate} onChange={handleChange} decimalPlaces={0} />
        </div>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Property Valuation (Ideal Offer Price):</span> <span><strong>{results.propertyValuation !== undefined ? formatCurrency(results.propertyValuation) : ''}</strong></span>
        </div>
        <div className="result-item">
          <span>Cap Rate:</span> <span><strong>{results.capRate !== undefined ? (results.capRate * 100).toFixed(2) + '%' : ''}</strong></span>
        </div>
        <div className="form-divider"></div>

        <h2>Loan Information</h2>
        <div className="form-group">
          <label>Down Payment Percentage (%): </label>
          <FormattedPercentInput step="5.00" name="downPaymentPercentage" value={formData.downPaymentPercentage} onChange={handleChange} decimalPlaces={0} />
        </div>
        <div className="result-item">
          <span>Down Payment:</span> <span><strong>{results.downPayment !== undefined ? formatCurrency(results.downPayment) : ''}</strong></span>
        </div>
        <div className="result-item">
          <span>Loan Amount:</span> <span><strong>{results.loanAmount !== undefined ? formatCurrency(results.loanAmount) : ''}</strong></span>
        </div>
        <div className="form-group">
          <label>Length of Mortgage (years): </label>
          <FormattedNumberInput step="1" name="lengthOfMortgage" value={formData.lengthOfMortgage} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Mortgage Rate (%): </label>
          <FormattedPercentInput step="0.10" name="mortgageRate" value={formData.mortgageRate} onChange={handleChange} />
        </div>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Monthly Mortgage Payment:</span> <span className="negative"><strong>{results.monthlyMortgagePayment !== undefined ? formatCurrency(results.monthlyMortgagePayment) : ''}</strong></span>
        </div>
        <div className="form-divider"></div>

        <h2>Cash Flow and ROI</h2>
        <button type="button" className="calculate-button" onClick={calculateValues}>Calculate</button>
        <div className="form-divider"></div>
        <div className="result-item">
          <span>Cash on Cash Return:</span> <span><strong>{results.cashOnCashReturn !== undefined ? (results.cashOnCashReturn * 100).toFixed(2) + '%' : ''}</strong></span>
        </div>
        <div className="result-item">
          <span>Monthly Cash Flow:</span> 
          <span className={results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}>
            <strong>{results.monthlyCashFlow !== undefined ? formatCurrency(results.monthlyCashFlow) : ''}</strong>
          </span>
        </div>
        <div className="result-item">
          <span>Annual Cash Flow:</span> 
          <span className={results.annualCashFlow >= 0 ? 'positive' : 'negative'}>
            <strong>{results.annualCashFlow !== undefined ? formatCurrency(results.annualCashFlow) : ''}</strong>
          </span>
        </div>
        <div className="form-divider"></div>
      </form>
    </div>
  );
};

export default CashFlowForm;
