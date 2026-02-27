import React, { useState, useEffect } from 'react';

const formatNumberWithCommas = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  return Number(value).toLocaleString('en-US');
};

const FormattedNumberInput = ({
  name,
  value,
  onChange,
  step,
  label,
  error,
  min = 0,
  max,
  required = false,
}) => {
  const [inputValue, setInputValue] = useState(formatNumberWithCommas(value));
  const inputId = `${name}-input`;
  const errorId = `${name}-error`;

  useEffect(() => {
    setInputValue(formatNumberWithCommas(value));
  }, [value]);

  const clamp = (val) => {
    if (min !== undefined && val < min) return min;
    if (max !== undefined && val > max) return max;
    return val;
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const numericValue = parseFloat(inputValue.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      const clamped = clamp(numericValue);
      setInputValue(formatNumberWithCommas(clamped));
      onChange({ target: { name, value: clamped.toString() } });
    } else {
      const fallback = min !== undefined ? min : 0;
      setInputValue(formatNumberWithCommas(fallback));
      onChange({ target: { name, value: fallback.toString() } });
    }
  };

  const handleStep = (increment) => {
    const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0;
    const newValue = clamp(numericValue + increment);
    setInputValue(formatNumberWithCommas(newValue));
    onChange({ target: { name, value: newValue.toString() } });
  };

  return (
    <div className="formatted-number-input">
      <label htmlFor={inputId} className="sr-only">{label}</label>
      <input
        id={inputId}
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        aria-required={required}
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={parseFloat(inputValue.replace(/,/g, '')) || 0}
      />
      <div className="step-buttons">
        <button
          type="button"
          onClick={() => handleStep(parseFloat(step))}
          aria-label={`Increase ${label || name} by ${step}`}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => handleStep(-parseFloat(step))}
          aria-label={`Decrease ${label || name} by ${step}`}
        >
          ▼
        </button>
      </div>
      {error && (
        <div id={errorId} className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default FormattedNumberInput;
