// src/components/CashFlowForm/helper_files/FormattedNumberInput.js
import React, { useState, useEffect } from 'react';

const formatNumberWithCommas = (value) => {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  required = false
}) => {
  const [inputValue, setInputValue] = useState(formatNumberWithCommas(value));
  const inputId = `${name}-input`;
  const errorId = `${name}-error`;

  useEffect(() => {
    setInputValue(formatNumberWithCommas(value));
  }, [value]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const numericValue = parseFloat(inputValue.replace(/,/g, ''));
    if (!isNaN(numericValue)) {
      setInputValue(formatNumberWithCommas(numericValue));
      onChange({ target: { name, value: numericValue.toString() } });
    } else {
      setInputValue('');
      onChange({ target: { name, value: '' } });
    }
  };

  const handleStep = (increment) => {
    const numericValue = parseFloat(inputValue.replace(/,/g, '')) || 0;
    const newValue = numericValue + increment;
    
    if ((min === undefined || newValue >= min) && (max === undefined || newValue <= max)) {
      setInputValue(formatNumberWithCommas(newValue));
      onChange({ target: { name, value: newValue.toString() } });
    }
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
          aria-label={`Increase ${label} by ${step}`}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => handleStep(-parseFloat(step))}
          aria-label={`Decrease ${label} by ${step}`}
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