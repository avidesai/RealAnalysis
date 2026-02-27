import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useCashFlowCalculations from './hooks/useCashFlowCalculations';
import InputsPanel from './components/InputsPanel';
import ResultsPanel from './components/ResultsPanel';
import SaveModal from './components/SaveModal';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchProperties, fetchProperty, createProperty, updateProperty, deleteProperty } from '../../services/api';
import { exportToCSV, exportToXLSX } from '../../utils/exportAnalysis';
import './CashFlowForm.css';

const CashFlowForm = () => {
  const { isAuthenticated, openAuthModal } = useContext(AuthContext);
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    formData,
    handleChange,
    propertyMeta,
    handleMetaChange,
    setPropertyMeta,
    resetForm,
    loadProperty,
    getPropertyPayload,
    results,
    formatCurrency,
  } = useCashFlowCalculations();

  const [savedProperties, setSavedProperties] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [saving, setSaving] = useState(false);

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
  }, [isAuthenticated, propertyMeta.id, getPropertyPayload, setPropertyMeta, loadProperty, refreshProperties, addToast, setSearchParams]);

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

  // Export
  const handleExport = useCallback((format) => {
    setShowExportMenu(false);
    if (format === 'csv') {
      exportToCSV(formData, results, formatCurrency, propertyMeta);
      addToast('CSV exported', 'success');
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
          <div className="toolbar-property-info">
            <span className="toolbar-property-name">
              {propertyMeta.address || propertyMeta.name || 'New Analysis'}
            </span>
            {propertyMeta.id && (
              <span className="toolbar-saved-badge">Saved</span>
            )}
          </div>
        </div>
        <div className="toolbar-actions">
          <button className="toolbar-btn" onClick={handleNew} title="New analysis">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 3v10M3 8h10" />
            </svg>
            New
          </button>

          <button
            className="toolbar-btn toolbar-btn-primary"
            onClick={() => {
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
            }}
            disabled={saving}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12.667 14H3.333A1.333 1.333 0 012 12.667V3.333A1.333 1.333 0 013.333 2h7.334L14 5.333v7.334A1.333 1.333 0 0112.667 14z" />
              <path d="M11.333 14V9.333H4.667V14M4.667 2v3.333h5.333" />
            </svg>
            {saving ? 'Saving...' : 'Save'}
          </button>

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
                <button onClick={() => handleExport('xlsx')}>Export XLSX</button>
                <button onClick={() => handleExport('csv')}>Export CSV</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved properties bar */}
      {isAuthenticated && savedProperties.length > 0 && (
        <div className="saved-properties-bar">
          {savedProperties.map(p => (
            <button
              key={p._id}
              className={`saved-property-chip ${propertyMeta.id === p._id ? 'active' : ''}`}
              onClick={() => handleLoadProperty(p)}
              title={p.address || p.name || 'Untitled'}
            >
              <span className="chip-text">{p.address || p.name || 'Untitled'}</span>
              <span
                className="chip-delete"
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

      <div className="calculator-layout">
        <div className="inputs-column">
          <InputsPanel
            formData={formData}
            handleChange={handleChange}
            propertyMeta={propertyMeta}
            handleMetaChange={handleMetaChange}
            resetForm={handleNew}
            formatCurrency={formatCurrency}
          />
        </div>

        <div className="results-column">
          <ResultsPanel
            results={results}
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
