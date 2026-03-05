import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchProperties, deleteProperty, createProperty } from '../../services/api';
import { exportToCSV, exportToXLSX } from '../../utils/exportAnalysis';
import './Properties.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

// Quick calculation for card display
const calcMetrics = (p) => {
  const monthlyRent = p.monthlyRentPerUnit * p.numberOfUnits;
  const vacancy = monthlyRent * p.vacancyRate;
  const grossIncome = monthlyRent - vacancy;
  const mgmt = monthlyRent * p.propertyManagementRate;
  const tax = (p.propertyTaxRate * p.purchasePrice) / 12;
  const opex = mgmt + tax + (p.landlordInsurance || 0) + (p.maintenanceReserve || 0) + (p.hoaFees || 0) +
    (p.waterAndSewer || 0) + (p.gasAndElectricity || 0) + (p.garbage || 0) + (p.snowRemoval || 0);
  const noi = grossIncome - opex;
  const down = p.purchasePrice * p.downPaymentPercentage;
  const loan = p.purchasePrice - down;
  const mr = p.mortgageRate / 12;
  const np = p.lengthOfMortgage * 12;
  const mortgage = loan > 0 && mr > 0
    ? (loan * mr * Math.pow(1 + mr, np)) / (Math.pow(1 + mr, np) - 1) : 0;
  const cashFlow = noi - mortgage;
  const annualNOI = noi * 12;
  const capRate = p.purchasePrice > 0 ? annualNOI / p.purchasePrice : 0;
  const coc = down > 0 ? (cashFlow * 12) / down : 0;
  return { cashFlow, capRate, coc };
};

const PropertiesPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetchProperties();
      setProperties(res.data);
    } catch {
      addToast('Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    load();
  }, [isAuthenticated, navigate, load]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name || 'Untitled'}"? This cannot be undone.`)) return;
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p._id !== id));
      addToast('Property deleted', 'success');
    } catch {
      addToast('Failed to delete', 'error');
    }
  };

  const handleDuplicate = async (property) => {
    try {
      const { _id, user, createdAt, updatedAt, __v, ...data } = property;
      data.name = (data.name || '') ? `${data.name} (Copy)` : 'Copy';
      await createProperty(data);
      await load();
      addToast('Property duplicated', 'success');
    } catch {
      addToast('Failed to duplicate', 'error');
    }
  };

  const handleExport = (property, format) => {
    const metrics = calcMetrics(property);
    const results = {
      ...metrics,
      monthlyRentalIncome: property.monthlyRentPerUnit * property.numberOfUnits,
      vacancyLoss: property.monthlyRentPerUnit * property.numberOfUnits * property.vacancyRate,
      monthlyGrossIncome: 0, monthlyOperatingExpenses: 0, monthlyNOI: 0, annualNOI: 0,
      monthlyMortgagePayment: 0, downPayment: property.purchasePrice * property.downPaymentPercentage,
      loanAmount: property.purchasePrice * (1 - property.downPaymentPercentage),
      monthlyCashFlow: metrics.cashFlow,
      annualCashFlow: metrics.cashFlow * 12,
      capRate: metrics.capRate,
      cashOnCashReturn: metrics.coc,
      grossRentMultiplier: property.purchasePrice / (property.monthlyRentPerUnit * property.numberOfUnits * 12),
      propertyManagementFees: property.monthlyRentPerUnit * property.numberOfUnits * property.propertyManagementRate,
      propertyTax: (property.propertyTaxRate * property.purchasePrice) / 12,
    };
    const meta = { name: property.name, address: property.address };
    if (format === 'csv') exportToCSV(property, results, formatCurrency, meta);
    else exportToXLSX(property, results, formatCurrency, meta);
    addToast(`${format.toUpperCase()} exported`, 'success');
  };

  if (loading) {
    return (
      <div className="properties-page">
        <div className="properties-loading">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <div className="properties-header">
        <div>
          <h1>My Properties</h1>
          <p>{properties.length} saved {properties.length === 1 ? 'analysis' : 'analyses'}</p>
        </div>
        <button className="new-analysis-btn" onClick={() => navigate('/')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M8 3v10M3 8h10" />
          </svg>
          New Analysis
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="properties-empty">
          <p>No saved properties yet</p>
          <button onClick={() => navigate('/')}>Create your first analysis</button>
        </div>
      ) : (
        <div className="properties-grid">
          {properties.map(p => {
            const m = calcMetrics(p);
            return (
              <div
                key={p._id}
                className="property-card"
                onClick={() => navigate(`/?id=${p._id}`)}
              >
                <div className="property-card-header">
                  <div className="property-card-address">
                    {p.address || 'No address'}
                  </div>
                  {p.name && <div className="property-card-name">{p.name}</div>}
                </div>

                <div className="property-card-metrics">
                  <div className="property-metric">
                    <span className="metric-label">CoC Return</span>
                    <span className={`metric-value ${m.coc >= 0 ? 'positive' : 'negative'}`}>
                      {(m.coc * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="property-metric">
                    <span className="metric-label">Cash Flow</span>
                    <span className={`metric-value ${m.cashFlow >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(m.cashFlow)}/mo
                    </span>
                  </div>
                  <div className="property-metric">
                    <span className="metric-label">Cap Rate</span>
                    <span className="metric-value">
                      {(m.capRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="property-card-footer">
                  <span className="property-card-price">
                    {formatCurrency(p.purchasePrice)}
                  </span>
                  <span className="property-card-date">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="property-card-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className="card-action-btn"
                    onClick={() => handleDuplicate(p)}
                    title="Duplicate"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="5" y="5" width="9" height="9" rx="1" />
                      <path d="M3 11V3a1 1 0 011-1h8" />
                    </svg>
                  </button>
                  <button
                    className="card-action-btn"
                    onClick={() => handleExport(p, 'xlsx')}
                    title="Export XLSX"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 10v2.667A1.333 1.333 0 0112.667 14H3.333A1.333 1.333 0 012 12.667V10M4.667 6.667L8 10l3.333-3.333M8 10V2" />
                    </svg>
                  </button>
                  <button
                    className="card-action-btn card-action-delete"
                    onClick={() => handleDelete(p._id, p.address || p.name)}
                    title="Delete"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M2 4h12M5.333 4V2.667A1.333 1.333 0 016.667 1.333h2.666A1.333 1.333 0 0110.667 2.667V4M12.667 4v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
