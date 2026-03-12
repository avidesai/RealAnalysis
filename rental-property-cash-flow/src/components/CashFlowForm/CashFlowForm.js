import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import useCashFlowCalculations from './hooks/useCashFlowCalculations';
import InputsPanel from './components/InputsPanel';
import ResultsPanel from './components/ResultsPanel';
import WhatIfPanel from './components/WhatIfPanel';
import SaveModal from './components/SaveModal';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchProperties, fetchProperty, createProperty, updateProperty, deleteProperty, shareProperty, lookupPropertyTax, estimateRent, lookupPropertyDetails } from '../../services/api';
import { exportToCSV, exportToXLSX, exportToPDF } from '../../utils/exportAnalysis';
import './CashFlowForm.css';

// Pick HUD FMR rent matching bedroom count, falling back down then up
const pickRentByBedrooms = (rentData, bedrooms) => {
  if (!rentData || bedrooms == null) return null;
  const keyMap = { 0: 'rent_br0', 1: 'rent_br1', 2: 'rent_br2', 3: 'rent_br3', 4: 'rent_br4' };
  // Exact match
  if (keyMap[bedrooms] && rentData[keyMap[bedrooms]]) return rentData[keyMap[bedrooms]];
  // Fall back down
  for (let b = bedrooms - 1; b >= 0; b--) {
    if (keyMap[b] && rentData[keyMap[b]]) return rentData[keyMap[b]];
  }
  // Fall back up
  for (let b = bedrooms + 1; b <= 4; b++) {
    if (keyMap[b] && rentData[keyMap[b]]) return rentData[keyMap[b]];
  }
  return null;
};

const CashFlowForm = () => {
  const { isAuthenticated, openAuthModal } = useContext(AuthContext);
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    formData,
    handleChange,
    batchUpdate,
    propertyMeta,
    handleMetaChange,
    setPropertyMeta,
    resetForm,
    loadProperty,
    getPropertyPayload,
    results,
    formatCurrency,
    undo,
    redo,
  } = useCashFlowCalculations();

  const [savedProperties, setSavedProperties] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPropertyMenu, setShowPropertyMenu] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [saving, setSaving] = useState(false);
  const propertyMenuRef = useRef(null);

  // Address lookup state
  const [rentEstimate, setRentEstimate] = useState(null);
  const [autoFillData, setAutoFillData] = useState(null);

  // Close property dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (propertyMenuRef.current && !propertyMenuRef.current.contains(e.target)) {
        setShowPropertyMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Address selected — fire parallel API calls and auto-fill form fields
  const handleAddressSelect = useCallback(async ({ formatted, zip }) => {
    if (!isAuthenticated || !zip) return;

    // If currently viewing a saved property, detach into a new analysis
    if (propertyMeta.id) {
      setPropertyMeta(prev => ({ ...prev, id: null, name: '', notes: '', listingUrl: '' }));
      setSearchParams({});
    }

    setRentEstimate(null);
    setAutoFillData(null);

    // Fire all three in parallel
    const [taxRes, rentRes, detailsRes] = await Promise.allSettled([
      lookupPropertyTax(zip),
      estimateRent(zip),
      lookupPropertyDetails(formatted),
    ]);

    const updates = {};
    const filledFields = [];

    // Property details (RentCast)
    let bedrooms = null;
    if (detailsRes.status === 'fulfilled' && detailsRes.value.data) {
      const detail = Array.isArray(detailsRes.value.data) ? detailsRes.value.data[0] : detailsRes.value.data;
      if (detail) {
        bedrooms = detail.bedrooms;
        // Set informational banner data (beds/baths/sqft only)
        setAutoFillData({
          bedrooms: detail.bedrooms,
          bathrooms: detail.bathrooms,
          squareFootage: detail.squareFootage,
        });
        // Auto-fill purchase price
        if (detail.lastSalePrice) {
          updates.purchasePrice = detail.lastSalePrice;
          filledFields.push('purchase price');
        }
      }
    }

    // Tax rate (API Ninjas)
    if (taxRes.status === 'fulfilled' && taxRes.value.data) {
      const taxData = Array.isArray(taxRes.value.data) ? taxRes.value.data[0] : taxRes.value.data;
      if (taxData?.median_tax_rate != null) {
        updates.propertyTaxRate = taxData.median_tax_rate;
        filledFields.push('tax rate');
      }
    }

    // Rent estimate (HUD FMR)
    if (rentRes.status === 'fulfilled' && rentRes.value.data?.data?.basicdata) {
      const rentData = rentRes.value.data.data.basicdata;
      setRentEstimate(rentData);
      const matchedRent = pickRentByBedrooms(rentData, bedrooms);
      if (matchedRent) {
        updates.monthlyRentPerUnit = matchedRent;
        filledFields.push('rent estimate');
      }
    }

    // Insurance + maintenance estimates from purchase price
    const price = updates.purchasePrice || formData.purchasePrice;
    if (updates.purchasePrice) {
      const insuranceEstimate = Math.round(price * 0.005 / 12);
      updates.landlordInsurance = insuranceEstimate;
      filledFields.push('insurance estimate');

      const maintenanceEstimate = Math.round(price * 0.01 / 12);
      updates.maintenanceReserve = maintenanceEstimate;
      filledFields.push('maintenance reserve');
    }

    // Apply all updates in a single batch (one undo reverts all)
    if (Object.keys(updates).length > 0) {
      batchUpdate(updates);
      addToast(`Auto-filled: ${filledFields.join(', ')}`, 'success');
    }
  }, [isAuthenticated, batchUpdate, addToast, formData.purchasePrice, propertyMeta.id, setPropertyMeta, setSearchParams]);

  // Sharing
  const handleShare = useCallback(async () => {
    if (!propertyMeta.id) return;
    try {
      const res = await shareProperty(propertyMeta.id);
      const url = `${window.location.origin}/shared/${res.data.shareToken}`;
      await navigator.clipboard.writeText(url);
      addToast('Share link copied to clipboard', 'success');
    } catch {
      addToast('Failed to generate share link', 'error');
    }
  }, [propertyMeta.id, addToast]);

  // Load saved properties list
  const refreshProperties = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetchProperties();
      setSavedProperties(res.data);
    } catch {
      // silently fail - user might not be authenticated
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshProperties();
  }, [refreshProperties]);

  // Load a property from URL param on mount
  useEffect(() => {
    const pid = searchParams.get('id');
    if (pid && isAuthenticated) {
      fetchProperty(pid)
        .then(res => loadProperty(res.data))
        .catch(() => addToast('Could not load property', 'error'));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save / update property
  const handleSave = useCallback(async (meta) => {
    setSaving(true);
    try {
      const payload = getPropertyPayload();
      payload.name = meta.name;
      payload.address = meta.address;
      payload.notes = meta.notes;
      payload.listingUrl = meta.listingUrl;

      if (propertyMeta.id) {
        const res = await updateProperty(propertyMeta.id, payload);
        setPropertyMeta(prev => ({ ...prev, ...meta }));
        addToast('Property updated', 'success');
        loadProperty(res.data);
      } else {
        const res = await createProperty(payload);
        addToast('Property saved', 'success');
        loadProperty(res.data);
        setSearchParams({ id: res.data._id });
      }
      await refreshProperties();
      setShowSaveModal(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  }, [propertyMeta.id, getPropertyPayload, setPropertyMeta, loadProperty, refreshProperties, addToast, setSearchParams]);

  // Load a saved property
  const handleLoadProperty = useCallback((property) => {
    loadProperty(property);
    setSearchParams({ id: property._id });
    addToast('Property loaded', 'success');
  }, [loadProperty, setSearchParams, addToast]);

  // Delete a saved property
  const handleDeleteProperty = useCallback(async (id) => {
    try {
      await deleteProperty(id);
      if (propertyMeta.id === id) {
        resetForm();
        setSearchParams({});
      }
      await refreshProperties();
      addToast('Property deleted', 'success');
    } catch {
      addToast('Failed to delete property', 'error');
    }
  }, [propertyMeta.id, resetForm, refreshProperties, addToast, setSearchParams]);

  // New analysis
  const handleNew = useCallback(() => {
    resetForm();
    setSearchParams({});
  }, [resetForm, setSearchParams]);

  // Trigger save logic (used by both Save button and Cmd+S)
  const triggerSave = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal(() => {
        if (propertyMeta.id && propertyMeta.address) {
          handleSave(propertyMeta);
        } else {
          setShowSaveModal(true);
        }
      });
      return;
    }
    if (propertyMeta.id && propertyMeta.address) {
      handleSave(propertyMeta);
    } else {
      setShowSaveModal(true);
    }
  }, [isAuthenticated, openAuthModal, propertyMeta, handleSave]);

  // Keyboard shortcuts: Cmd+S (save), Cmd+Z (undo), Cmd+Shift+Z (redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        triggerSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerSave, undo, redo]);

  // Export
  const handleExport = useCallback((format) => {
    setShowExportMenu(false);
    if (format === 'csv') {
      exportToCSV(formData, results, formatCurrency, propertyMeta);
      addToast('CSV exported', 'success');
    } else if (format === 'pdf') {
      exportToPDF(formData, results, formatCurrency, propertyMeta);
      addToast('PDF exported', 'success');
    } else {
      exportToXLSX(formData, results, formatCurrency, propertyMeta);
      addToast('XLSX exported', 'success');
    }
  }, [formData, results, formatCurrency, propertyMeta, addToast]);

  return (
    <div className="container" role="main">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="property-selector" ref={propertyMenuRef}>
            <button
              className="property-selector-btn"
              onClick={() => setShowPropertyMenu(prev => !prev)}
            >
              <span className="property-selector-label">
                {propertyMeta.address || propertyMeta.name || 'New Analysis'}
              </span>
              {propertyMeta.id && (
                <span className="toolbar-saved-badge">Saved</span>
              )}
              <svg className="property-selector-chevron" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {showPropertyMenu && (
              <div className="property-selector-menu">
                <button
                  className={`property-selector-item ${!propertyMeta.id ? 'active' : ''}`}
                  onClick={() => { handleNew(); setShowPropertyMenu(false); }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                  New Analysis
                </button>
                {savedProperties.map(p => (
                  <button
                    key={p._id}
                    className={`property-selector-item ${propertyMeta.id === p._id ? 'active' : ''}`}
                    onClick={() => { handleLoadProperty(p); setShowPropertyMenu(false); }}
                    title={p.address || p.name || 'Untitled'}
                  >
                    <span className="property-selector-item-text">{p.address || p.name || 'Untitled'}</span>
                    <span
                      className="property-selector-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${p.address || p.name || 'Untitled'}"?`)) {
                          handleDeleteProperty(p._id);
                        }
                      }}
                    >
                      &times;
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="toolbar-actions">
          <button
            className="toolbar-btn toolbar-btn-primary"
            onClick={triggerSave}
            disabled={saving}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12.667 14H3.333A1.333 1.333 0 012 12.667V3.333A1.333 1.333 0 013.333 2h7.334L14 5.333v7.334A1.333 1.333 0 0112.667 14z" />
              <path d="M11.333 14V9.333H4.667V14M4.667 2v3.333h5.333" />
            </svg>
            {saving ? 'Saving...' : 'Save'}
          </button>

          {propertyMeta.id && (
            <button className="toolbar-btn" onClick={handleShare} title="Share analysis">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="3" r="2" />
                <circle cx="4" cy="8" r="2" />
                <circle cx="12" cy="13" r="2" />
                <path d="M5.7 9.1l4.6 2.8M10.3 4.1L5.7 6.9" />
              </svg>
              Share
            </button>
          )}

          <div className="toolbar-export-wrapper">
            <button
              className="toolbar-btn"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14 10v2.667A1.333 1.333 0 0112.667 14H3.333A1.333 1.333 0 012 12.667V10M4.667 6.667L8 10l3.333-3.333M8 10V2" />
              </svg>
              Export
            </button>
            {showExportMenu && (
              <div className="export-menu">
                <button onClick={() => handleExport('pdf')}>Export PDF</button>
                <button onClick={() => handleExport('xlsx')}>Export XLSX</button>
                <button onClick={() => handleExport('csv')}>Export CSV</button>
              </div>
            )}
          </div>
          <button
            className={`toolbar-btn ${showWhatIf ? 'toolbar-btn-active' : ''}`}
            onClick={() => setShowWhatIf(prev => !prev)}
            title="What If scenario analysis"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 8h2l2-4 4 8 2-4h2" />
            </svg>
            What If
          </button>
        </div>
      </div>

      {/* What If Panel */}
      {showWhatIf && (
        <WhatIfPanel
          formData={formData}
          batchUpdate={batchUpdate}
          onClose={() => setShowWhatIf(false)}
        />
      )}

      <div className="calculator-layout">
        <div className="inputs-column">
          <InputsPanel
            formData={formData}
            handleChange={handleChange}
            propertyMeta={propertyMeta}
            handleMetaChange={handleMetaChange}
            resetForm={handleNew}
            formatCurrency={formatCurrency}
            onAddressSelect={handleAddressSelect}
            rentEstimate={rentEstimate}
            autoFillData={autoFillData}
            onDismissAutoFill={() => setAutoFillData(null)}
          />
        </div>

        <div className="results-column">
          <ResultsPanel
            results={results}
            formData={formData}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <SaveModal
          propertyMeta={propertyMeta}
          onSave={handleSave}
          onClose={() => setShowSaveModal(false)}
          saving={saving}
        />
      )}
    </div>
  );
};

export default CashFlowForm;
