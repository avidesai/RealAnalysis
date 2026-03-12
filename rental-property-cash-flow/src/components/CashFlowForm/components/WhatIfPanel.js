import React, { useState, useRef, useCallback } from 'react';

const sliderConfigs = (formData) => {
  const isSTR = formData.calculatorMode === 'str';
  return [
    {
      key: 'purchasePrice',
      label: 'Purchase Price',
      min: Math.round((formData.purchasePrice || 100000) * 0.5),
      max: Math.round((formData.purchasePrice || 100000) * 1.5),
      step: 5000,
      format: (v) => `$${Number(v).toLocaleString()}`,
    },
    ...(isSTR
      ? [{
          key: 'nightlyRate',
          label: 'Nightly Rate',
          min: Math.round((formData.nightlyRate || 100) * 0.5),
          max: Math.round((formData.nightlyRate || 100) * 2),
          step: 5,
          format: (v) => `$${Number(v).toLocaleString()}`,
        }]
      : [{
          key: 'monthlyRentPerUnit',
          label: 'Monthly Rent',
          min: Math.round((formData.monthlyRentPerUnit || 1000) * 0.5),
          max: Math.round((formData.monthlyRentPerUnit || 1000) * 2),
          step: 25,
          format: (v) => `$${Number(v).toLocaleString()}`,
        }]
    ),
    {
      key: 'mortgageRate',
      label: 'Interest Rate',
      min: 0.02,
      max: 0.12,
      step: 0.0025,
      format: (v) => `${(Number(v) * 100).toFixed(2)}%`,
    },
    ...(isSTR
      ? [{
          key: 'occupancyRate',
          label: 'Occupancy Rate',
          min: 0.3,
          max: 1.0,
          step: 0.01,
          format: (v) => `${(Number(v) * 100).toFixed(0)}%`,
        }]
      : [{
          key: 'vacancyRate',
          label: 'Vacancy Rate',
          min: 0,
          max: 0.25,
          step: 0.01,
          format: (v) => `${(Number(v) * 100).toFixed(0)}%`,
        }]
    ),
    {
      key: 'downPaymentPercentage',
      label: 'Down Payment',
      min: 0,
      max: 1,
      step: 0.01,
      format: (v) => `${(Number(v) * 100).toFixed(0)}%`,
    },
  ];
};

const WhatIfPanel = ({ formData, batchUpdate, onClose }) => {
  const baselineRef = useRef(null);
  const [applied, setApplied] = useState(false);

  // Capture baseline on first render
  if (!baselineRef.current) {
    const configs = sliderConfigs(formData);
    const snap = {};
    configs.forEach(c => { snap[c.key] = formData[c.key]; });
    baselineRef.current = snap;
  }

  const configs = sliderConfigs(formData);

  const handleSliderChange = useCallback((key, value) => {
    batchUpdate({ [key]: Number(value) });
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
            <path d="M8 2v12M2 8h12M4 4l8 8M12 4l-8 8" />
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
      <div className="whatif-sliders">
        {configs.map(cfg => {
          const value = formData[cfg.key] ?? 0;
          const baseline = baselineRef.current?.[cfg.key] ?? value;
          const delta = value - baseline;
          const deltaPct = baseline > 0 ? ((delta / baseline) * 100) : 0;
          const hasChanged = Math.abs(delta) > 0.0001;

          return (
            <div className="whatif-slider-group" key={cfg.key}>
              <div className="whatif-slider-header">
                <span className="whatif-slider-label">{cfg.label}</span>
                <span className="whatif-slider-value">
                  {cfg.format(value)}
                  {hasChanged && (
                    <span className={`whatif-delta ${delta >= 0 ? 'positive' : 'negative'}`}>
                      {delta >= 0 ? '+' : ''}{deltaPct.toFixed(1)}%
                    </span>
                  )}
                </span>
              </div>
              <input
                type="range"
                className="whatif-range"
                min={cfg.min}
                max={cfg.max}
                step={cfg.step}
                value={value}
                onChange={(e) => handleSliderChange(cfg.key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhatIfPanel;
