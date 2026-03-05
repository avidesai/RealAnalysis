import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSharedProperty } from '../../services/api';
import useCalculations from './hooks/useCalculations';
import ResultsPanel from './components/ResultsPanel';
import './CashFlowForm.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const SharedAnalysis = () => {
  const { token } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSharedProperty(token);
        setProperty(res.data);
      } catch {
        setError('This shared analysis could not be found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const formData = useMemo(() => {
    if (!property) return null;
    const { _id, name, address, notes, createdAt, updatedAt, __v, ...data } = property;
    return data;
  }, [property]);

  const results = useCalculations(formData || {});

  if (loading) {
    return (
      <div className="container" role="main">
        <div className="shared-loading">Loading shared analysis...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container" role="main">
        <div className="shared-error">
          <h2>Not Found</h2>
          <p>{error || 'This shared analysis does not exist.'}</p>
        </div>
      </div>
    );
  }

  const inputRows = [
    ['Purchase Price', formatCurrency(property.purchasePrice)],
    ['Monthly Rent / Unit', formatCurrency(property.monthlyRentPerUnit)],
    ['Units', property.numberOfUnits],
    ['Vacancy Rate', `${(property.vacancyRate * 100).toFixed(1)}%`],
    ['Property Tax Rate', `${(property.propertyTaxRate * 100).toFixed(2)}%`],
    ['Management Rate', `${(property.propertyManagementRate * 100).toFixed(1)}%`],
    ['Down Payment', `${(property.downPaymentPercentage * 100).toFixed(0)}%`],
    ['Mortgage Rate', `${(property.mortgageRate * 100).toFixed(2)}%`],
    ['Mortgage Term', `${property.lengthOfMortgage} years`],
  ];

  return (
    <div className="container" role="main">
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="toolbar-property-info">
            <span className="toolbar-property-name">
              {property.address || property.name || 'Shared Analysis'}
            </span>
            <span className="toolbar-saved-badge" style={{ color: 'var(--color-accent)', background: 'var(--color-accent-subtle)', borderColor: 'rgba(59,130,246,0.2)' }}>
              Shared
            </span>
          </div>
        </div>
      </div>

      <div className="calculator-layout">
        <div className="inputs-column">
          <div className="inputs-panel">
            <h3>Property Details</h3>
            <div className="shared-inputs-table">
              {inputRows.map(([label, value]) => (
                <div key={label} className="detail-row">
                  <span>{label}</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
            {property.notes && (
              <div className="shared-notes">
                <strong>Notes:</strong> {property.notes}
              </div>
            )}
          </div>
        </div>
        <div className="results-column">
          <ResultsPanel
            results={results}
            formData={formData}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedAnalysis;
