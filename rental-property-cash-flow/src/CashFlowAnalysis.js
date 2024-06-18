import React, { useState } from 'react';

const CashFlowAnalysis = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [cashFlow, setCashFlow] = useState(0);

  const calculateCashFlow = () => {
    setCashFlow(income - expenses);
  };

  return (
    <div>
      <h1>Rental Property Cash Flow Analysis</h1>
      <div>
        <label>Monthly Income:</label>
        <input type="number" value={income} onChange={(e) => setIncome(parseFloat(e.target.value) || 0)} />
      </div>
      <div>
        <label>Monthly Expenses:</label>
        <input type="number" value={expenses} onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)} />
      </div>
      <button onClick={calculateCashFlow}>Calculate Cash Flow</button>
      <div>
        <h2>Monthly Cash Flow: ${cashFlow}</h2>
      </div>
    </div>
  );
};

export default CashFlowAnalysis;
