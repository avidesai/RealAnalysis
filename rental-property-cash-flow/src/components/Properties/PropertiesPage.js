import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchProperties, deleteProperty, shareProperty, duplicateProperty } from '../../services/api';
import { exportToCSV, exportToXLSX, exportToPDF } from '../../utils/exportAnalysis';
import CompareView from './CompareView';
import './Properties.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

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

const getTier = (type, value) => {
  switch (type) {
    case 'cashFlow': return value >= 200 ? 'positive' : value >= 0 ? 'warning' : 'negative';
    case 'coc': return value >= 0.10 ? 'positive' : value >= 0.05 ? 'warning' : 'negative';
    case 'capRate': return value >= 0.06 ? 'positive' : value >= 0.03 ? 'warning' : 'negative';
    default: return 'neutral';
  }
};

const SORT_OPTIONS = [
  { key: 'updatedAt', label: 'Recent' },
  { key: 'cashFlow', label: 'Cash Flow' },
  { key: 'coc', label: 'CoC' },
  { key: 'capRate', label: 'Cap Rate' },
  { key: 'purchasePrice', label: 'Price' },
];

const MODE_LABELS = { standard: 'LTR', str: 'STR', brrrr: 'BRRRR' };

const PropertiesPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportMenuId, setExportMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

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
    if (!isAuthenticated) { navigate('/login'); return; }
    load();
  }, [isAuthenticated, navigate, load]);

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
      setCompareIds(prev => prev.filter(x => x !== id));
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

  const handleDuplicate = async (id) => {
    try {
      const res = await duplicateProperty(id);
      setProperties(prev => [res.data, ...prev]);
      addToast('Property duplicated', 'success');
    } catch {
      addToast('Failed to duplicate', 'error');
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
      monthlyMortgagePayment: metrics.mortgage,
      downPayment: metrics.down,
      loanAmount: property.purchasePrice - metrics.down,
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
    else if (format === 'pdf') exportToPDF(property, results, formatCurrency, meta);
    else exportToXLSX(property, results, formatCurrency, meta);
    addToast(`${format.toUpperCase()} exported`, 'success');
  };

  // Sort toggle
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  // Compare toggle
  const toggleCompare = (id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) { addToast('Compare up to 3 properties', 'error'); return prev; }
      return [...prev, id];
    });
  };

  // Filtered + sorted
  const filteredProperties = useMemo(() => {
    let list = properties;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        (p.address || '').toLowerCase().includes(q) ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.notes || '').toLowerCase().includes(q) ||
        formatCurrency(p.purchasePrice).toLowerCase().includes(q)
      );
    }
    const withMetrics = list.map(p => ({ ...p, _m: calcMetrics(p) }));
    withMetrics.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'cashFlow': aVal = a._m.cashFlow; bVal = b._m.cashFlow; break;
        case 'coc': aVal = a._m.coc; bVal = b._m.coc; break;
        case 'capRate': aVal = a._m.capRate; bVal = b._m.capRate; break;
        case 'purchasePrice': aVal = a.purchasePrice; bVal = b.purchasePrice; break;
        default: aVal = new Date(a.updatedAt); bVal = new Date(b.updatedAt); break;
      }
      return sortDir === 'desc' ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
    });
    return withMetrics;
  }, [properties, searchQuery, sortBy, sortDir]);

  // Dashboard summary
  const summary = useMemo(() => {
    if (!properties.length) return null;
    const metrics = properties.map(p => calcMetrics(p));
    return {
      totalCashFlow: metrics.reduce((sum, m) => sum + m.cashFlow, 0),
      avgCapRate: metrics.reduce((sum, m) => sum + m.capRate, 0) / metrics.length,
      avgCoC: metrics.reduce((sum, m) => sum + m.coc, 0) / metrics.length,
      totalEquity: metrics.reduce((sum, m) => sum + m.down, 0),
    };
  }, [properties]);

  const compareProperties = useMemo(() =>
    properties.filter(p => compareIds.includes(p._id)),
    [properties, compareIds]
  );

  if (loading) {
    return (
      <div className="properties-page">
        <div className="properties-loading">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="properties-page">
      {/* Header */}
      <div className="properties-header">
        <div>
          <h1>My Properties</h1>
          <p>{properties.length} saved {properties.length === 1 ? 'analysis' : 'analyses'}</p>
        </div>
        <div className="properties-header-actions">
          {compareIds.length >= 2 && (
            <button className="compare-btn" onClick={() => setShowCompare(true)}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 3h4v10H3zM9 3h4v10H9z" />
              </svg>
              Compare ({compareIds.length})
            </button>
          )}
          <button className="new-analysis-btn" onClick={() => navigate('/')}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 3v10M3 8h10" />
            </svg>
            New Analysis
          </button>
        </div>
      </div>

      {/* Dashboard Summary */}
      {summary && (
        <div className="dashboard-summary">
          <div className="summary-card">
            <span className="summary-label">Properties</span>
            <span className="summary-value">{properties.length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Cash Flow</span>
            <span className={`summary-value ${getTier('cashFlow', summary.totalCashFlow)}`}>
              {formatCurrency(summary.totalCashFlow)}
              <span className="summary-period">/mo</span>
            </span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Avg Cap Rate</span>
            <span className={`summary-value ${getTier('capRate', summary.avgCapRate)}`}>
              {(summary.avgCapRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Avg CoC Return</span>
            <span className={`summary-value ${getTier('coc', summary.avgCoC)}`}>
              {(summary.avgCoC * 100).toFixed(1)}%
            </span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Total Equity</span>
            <span className="summary-value">{formatCurrency(summary.totalEquity)}</span>
          </div>
        </div>
      )}

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
        <>
          {/* Search + Sort Bar */}
          <div className="list-controls">
            <div className="search-wrapper">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="7" cy="7" r="4.5" />
                <path d="M14 14l-3.5-3.5" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>&times;</button>
              )}
            </div>
            <div className="sort-pills">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  className={`sort-pill ${sortBy === opt.key ? 'active' : ''}`}
                  onClick={() => handleSort(opt.key)}
                >
                  {opt.label}
                  {sortBy === opt.key && (
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d={sortDir === 'desc' ? 'M4 6l4 4 4-4' : 'M4 10l4-4 4 4'} />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* List Header */}
          <div className="list-header">
            <div className="list-col-check"></div>
            <div className="list-col-property">Property</div>
            <div className="list-col-metric">Cash Flow</div>
            <div className="list-col-metric">CoC</div>
            <div className="list-col-metric">Cap Rate</div>
            <div className="list-col-meta">Mode</div>
            <div className="list-col-meta">Updated</div>
            <div className="list-col-actions">Actions</div>
          </div>

          {/* Property Rows */}
          <div className="properties-list">
            {filteredProperties.length === 0 ? (
              <div className="list-empty">No properties match your search</div>
            ) : (
              filteredProperties.map(p => {
                const m = p._m;
                const isSelected = compareIds.includes(p._id);
                return (
                  <div
                    key={p._id}
                    className={`list-row ${isSelected ? 'list-row-selected' : ''}`}
                    onClick={() => navigate(`/?id=${p._id}`)}
                  >
                    {/* Compare checkbox */}
                    <div className="list-col-check" onClick={e => e.stopPropagation()}>
                      <label className="compare-checkbox" title="Select to compare">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCompare(p._id)}
                        />
                        <span className="compare-checkmark"></span>
                      </label>
                    </div>

                    {/* Property info */}
                    <div className="list-col-property">
                      <div className="list-property-address">{p.address || 'No address'}</div>
                      <div className="list-property-sub">
                        {p.name && <span>{p.name}</span>}
                        <span className="list-property-price">{formatCurrency(p.purchasePrice)}</span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className={`list-col-metric list-metric-${getTier('cashFlow', m.cashFlow)}`}>
                      <span className="list-metric-value">{formatCurrency(m.cashFlow)}</span>
                      <span className="list-metric-sub">/mo</span>
                    </div>
                    <div className={`list-col-metric list-metric-${getTier('coc', m.coc)}`}>
                      <span className="list-metric-value">{(m.coc * 100).toFixed(1)}%</span>
                    </div>
                    <div className={`list-col-metric list-metric-${getTier('capRate', m.capRate)}`}>
                      <span className="list-metric-value">{(m.capRate * 100).toFixed(1)}%</span>
                    </div>

                    {/* Meta */}
                    <div className="list-col-meta">
                      <span className={`mode-badge mode-${p.calculatorMode || 'standard'}`}>
                        {MODE_LABELS[p.calculatorMode || 'standard']}
                      </span>
                    </div>
                    <div className="list-col-meta list-date">
                      {new Date(p.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>

                    {/* Actions */}
                    <div className="list-col-actions" onClick={e => e.stopPropagation()}>
                      <button className="card-action-btn" onClick={() => navigate(`/?id=${p._id}`)} title="Edit">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 14h6M11.5 2.5a1.414 1.414 0 112 2L5 13l-3 1 1-3 8.5-8.5z" />
                        </svg>
                      </button>
                      <button className="card-action-btn" onClick={() => handleShare(p._id)} title="Share">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="3" r="2" />
                          <circle cx="4" cy="8" r="2" />
                          <circle cx="12" cy="13" r="2" />
                          <path d="M5.7 9.1l4.6 2.8M10.3 4.1L5.7 6.9" />
                        </svg>
                      </button>
                      <button className="card-action-btn" onClick={() => handleDuplicate(p._id)} title="Duplicate">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="5" width="9" height="9" rx="1.5" />
                          <path d="M3 11V3a1.5 1.5 0 011.5-1.5H11" />
                        </svg>
                      </button>
                      <div className="card-export-wrapper">
                        <button
                          className="card-action-btn"
                          onClick={(e) => { e.stopPropagation(); setExportMenuId(exportMenuId === p._id ? null : p._id); }}
                          title="Export"
                        >
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M14 10v2.667A1.333 1.333 0 0112.667 14H3.333A1.333 1.333 0 012 12.667V10M4.667 6.667L8 10l3.333-3.333M8 10V2" />
                          </svg>
                        </button>
                        {exportMenuId === p._id && (
                          <div className="card-export-menu" onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleExport(p, 'pdf')}>Export PDF</button>
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
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M2 4h12M5.333 4V2.667A1.333 1.333 0 016.667 1.333h2.666A1.333 1.333 0 0110.667 2.667V4M12.667 4v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Compare Modal */}
      {showCompare && compareProperties.length >= 2 && (
        <CompareView
          properties={compareProperties}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
};

export default PropertiesPage;
