import React, { useState, useRef, useCallback } from 'react';
import FormattedNumberInput from '../helper_files/FormattedNumberInput';
import FormattedPercentInput from '../helper_files/FormattedPercentInput';

const getFieldConfigs = (formData) => {
  const isSTR = formData.calculatorMode === 'str';
  return [
    { key: 'purchasePrice', label: 'Purchase Price', type: 'currency', step: 5000 },
    ...(isSTR
      ? [{ key: 'nightlyRate', label: 'Nightly Rate', type: 'currency', step: 5 }]
      : [{ key: 'monthlyRentPerUnit', label: 'Monthly Rent', type: 'currency', step: 25 }]
    ),
    { key: 'mortgageRate', label: 'Interest Rate', type: 'percent', step: 0.25, decimal: 2 },
    ...(isSTR
      ? [{ key: 'occupancyRate', label: 'Occupancy Rate', type: 'percent', step: 1, decimal: 0 }]
      : [{ key: 'vacancyRate', label: 'Vacancy Rate', type: 'percent', step: 1, decimal: 0 }]
    ),
    { key: 'downPaymentPercentage', label: 'Down Payment', type: 'percent', step: 1, decimal: 0 },
  ];
};

const WhatIfPanel = ({ formData, batchUpdate, onClose }) => {
  const baselineRef = useRef(null);
  const [applied, setApplied] = useState(false);

  if (!baselineRef.current) {
    const configs = getFieldConfigs(formData);
    const snap = {};
    configs.forEach(c => { snap[c.key] = formData[c.key]; });
    baselineRef.current = snap;
  }

  const configs = getFieldConfigs(formData);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    batchUpdate({ [name]: Number(value) });
  }, [batchUpdate]);

  const handleReset = useCallback(() => {
    if (baselineRef.current) {
      batchUpdate(baselineRef.current);
    }
  }, [batchUpdate]);

  const handleClose = useCallback(() => {
    if (!applied && baselineRef.current) {
      batchUpdate(baselineRef.current);
    }
    onClose();
  }, [applied, batchUpdate, onClose]);

  const handleApply = useCallback(() => {
    setApplied(true);
    onClose();
  }, [onClose]);

  return (
    <div className="whatif-panel">
      <div className="whatif-header">
        <div className="whatif-title">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 8h2l2-4 4 8 2-4h2" />
          </svg>
          What If
        </div>
        <div className="whatif-actions">
          <button className="whatif-btn whatif-btn-reset" onClick={handleReset}>Reset</button>
          <button className="whatif-btn whatif-btn-apply" onClick={handleApply}>Apply</button>
          <button className="whatif-btn whatif-btn-close" onClick={handleClose} title="Close">
            &times;
          </button>
        </div>
      </div>
      <div className="whatif-fields">
        {configs.map(cfg => {
          const value = formData[cfg.key] ?? 0;
          const baseline = baselineRef.current?.[cfg.key] ?? value;
          const delta = value - baseline;
          const deltaPct = baseline > 0 ? ((delta / baseline) * 100) : 0;
          const hasChanged = Math.abs(delta) > 0.0001;

          return (
            <div className="form-group" key={cfg.key}>
              <label>
                {cfg.label}
                {hasChanged && (
                  <span className={`whatif-delta ${delta >= 0 ? 'positive' : 'negative'}`}>
                    {delta >= 0 ? '+' : ''}{deltaPct.toFixed(1)}%
                  </span>
                )}
              </label>
              {cfg.type === 'currency' ? (
                <FormattedNumberInput
                  name={cfg.key}
                  value={value}
                  onChange={handleChange}
                  step={cfg.step}
                  label={cfg.label}
                  min={0}
                />
              ) : (
                <FormattedPercentInput
                  name={cfg.key}
                  value={value}
                  onChange={handleChange}
                  step={cfg.step}
                  decimalPlaces={cfg.decimal}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhatIfPanel;
