import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchProperties, deleteProperty, shareProperty } from '../../services/api';
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
  return { cashFlow, capRate, coc, mortgage, noi, down };
};

const PropertiesPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportMenuId, setExportMenuId] = useState(null);

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

  // Close export menu on outside click
  useEffect(() => {
    if (!exportMenuId) return;
    const handleClick = () => setExportMenuId(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [exportMenuId]);

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

  const handleShare = async (id) => {
    try {
      const res = await shareProperty(id);
      const url = `${window.location.origin}/shared/${res.data.shareToken}`;
      await navigator.clipboard.writeText(url);
      addToast('Share link copied to clipboard', 'success');
    } catch {
      addToast('Failed to generate share link', 'error');
    }
  };

  const handleExport = (property, format) => {
    setExportMenuId(null);
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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="properties-empty-icon">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <p>No saved properties yet</p>
          <span className="properties-empty-hint">Run an analysis and save it to see it here</span>
          <button onClick={() => navigate('/')}>Create your first analysis</button>
        </div>
      ) : (
        <div className="properties-grid">
          {properties.map(p => {
            const m = calcMetrics(p);
            const monthlyRent = p.monthlyRentPerUnit * p.numberOfUnits;
            return (
              <div
                key={p._id}
                className="property-card"
                onClick={() => navigate(`/?id=${p._id}`)}
              >
                {/* Header */}
                <div className="property-card-header">
                  <div className="property-card-title-row">
                    <div className="property-card-address">
                      {p.address || 'No address'}
                    </div>
                    <span className="property-card-price-badge">
                      {formatCurrency(p.purchasePrice)}
                    </span>
                  </div>
                  {p.name && <div className="property-card-name">{p.name}</div>}
                </div>

                {/* Key metrics */}
                <div className="property-card-metrics">
                  <div className={`property-metric-card ${m.cashFlow >= 0 ? 'positive' : 'negative'}`}>
                    <span className="metric-label">Cash Flow</span>
                    <span className="metric-value">
                      {formatCurrency(m.cashFlow)}
                      <span className="metric-period">/mo</span>
                    </span>
                  </div>
                  <div className={`property-metric-card ${m.coc >= 0 ? 'positive' : 'negative'}`}>
                    <span className="metric-label">CoC Return</span>
                    <span className="metric-value">
                      {(m.coc * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="property-metric-card neutral">
                    <span className="metric-label">Cap Rate</span>
                    <span className="metric-value">
                      {(m.capRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Property details row */}
                <div className="property-card-details">
                  <div className="property-detail-item">
                    <span className="detail-item-label">Rent</span>
                    <span className="detail-item-value">{formatCurrency(monthlyRent)}/mo</span>
                  </div>
                  <div className="property-detail-item">
                    <span className="detail-item-label">Down</span>
                    <span className="detail-item-value">{(p.downPaymentPercentage * 100).toFixed(0)}%</span>
                  </div>
                  <div className="property-detail-item">
                    <span className="detail-item-label">Units</span>
                    <span className="detail-item-value">{p.numberOfUnits}</span>
                  </div>
                  <div className="property-detail-item">
                    <span className="detail-item-label">Rate</span>
                    <span className="detail-item-value">{(p.mortgageRate * 100).toFixed(2)}%</span>
                  </div>
                </div>

                {/* Notes preview */}
                {p.notes && (
                  <div className="property-card-notes">
                    {p.notes}
                  </div>
                )}

                {/* Listing URL */}
                {p.listingUrl && (
                  <a
                    href={p.listingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="property-card-listing-link"
                    onClick={e => e.stopPropagation()}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 8.667v4A1.333 1.333 0 0110.667 14H3.333A1.333 1.333 0 012 12.667V5.333A1.333 1.333 0 013.333 4h4M10 2h4v4M6.667 9.333L14 2" />
                    </svg>
                    View Listing
                  </a>
                )}

                {/* Footer actions */}
                <div className="property-card-footer" onClick={e => e.stopPropagation()}>
                  <span className="property-card-date">
                    Updated {new Date(p.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="property-card-actions">
                    <button
                      className="card-action-btn"
                      onClick={() => navigate(`/?id=${p._id}`)}
                      title="Open analysis"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 14h6M11.5 2.5a1.414 1.414 0 112 2L5 13l-3 1 1-3 8.5-8.5z" />
                      </svg>
                    </button>
                    <button
                      className="card-action-btn"
                      onClick={() => handleShare(p._id)}
                      title="Copy share link"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="3" r="2" />
                        <circle cx="4" cy="8" r="2" />
                        <circle cx="12" cy="13" r="2" />
                        <path d="M5.7 9.1l4.6 2.8M10.3 4.1L5.7 6.9" />
                      </svg>
                    </button>
                    <div className="card-export-wrapper">
                      <button
                        className="card-action-btn"
                        onClick={(e) => { e.stopPropagation(); setExportMenuId(exportMenuId === p._id ? null : p._id); }}
                        title="Export"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M14 10v2.667A1.333 1.333 0 0112.667 14H3.333A1.333 1.333 0 012 12.667V10M4.667 6.667L8 10l3.333-3.333M8 10V2" />
                        </svg>
                      </button>
                      {exportMenuId === p._id && (
                        <div className="card-export-menu" onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleExport(p, 'xlsx')}>Export XLSX</button>
                          <button onClick={() => handleExport(p, 'csv')}>Export CSV</button>
                        </div>
                      )}
                    </div>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
