// src/components/CashFlowForm/components/CalculationHistory.js
import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

const CalculationHistory = ({
  history,
  onLoad,
  onDelete,
  formatCurrency
}) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="calculation-history">
      <h3>Calculation History</h3>
      <div className="history-list">
        {history.map((entry) => (
          <div key={entry.id} className="history-item">
            <div className="history-item-header">
              <span className="history-timestamp">
                {formatDate(entry.timestamp)}
              </span>
              <div className="history-actions">
                <button
                  onClick={() => onLoad(entry)}
                  className="history-button load"
                  aria-label="Load this calculation"
                >
                  Load
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="history-button delete"
                  aria-label="Delete this calculation"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="history-details">
              <div className="history-row">
                <span>Purchase Price:</span>
                <span>{formatCurrency(entry.formData.purchasePrice)}</span>
              </div>
              <div className="history-row">
                <span>Monthly Cash Flow:</span>
                <span className={entry.results.monthlyCashFlow >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(entry.results.monthlyCashFlow)}
                </span>
              </div>
              <div className="history-row">
                <span>Cap Rate:</span>
                <span>
                  {(entry.results.capRate * 100).toFixed(2)}%
                </span>
              </div>
              <div className="history-row">
                <span>Cash on Cash Return:</span>
                <span>
                  {(entry.results.cashOnCashReturn * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculationHistory;