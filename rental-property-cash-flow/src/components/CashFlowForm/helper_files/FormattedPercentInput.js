import React, { useState, useEffect } from 'react';

const formatPercent = (value) => {
  if (!value) return '';
  return value.toString().replace(/\.?0+$/, ''); // Remove trailing zeros
};

const FormattedPercentInput = ({ name, value, onChange, step, decimalPlaces = 2 }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value !== '') {
      setInputValue(formatPercent((value * 100).toFixed(decimalPlaces))); // Convert initial value to percentage without trailing zeros
    } else {
      setInputValue('');
    }
  }, [value, decimalPlaces]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/,/g, '').replace(/%/g, '');
    if (numericValue === '' || (!isNaN(numericValue) && numericValue !== '-')) {
      setInputValue(value); // Set the raw input value without formatting
      if (numericValue !== '') {
        onChange({ target: { name, value: (parseFloat(numericValue) / 100).toFixed(decimalPlaces) } });
      } else {
        onChange({ target: { name, value: '' } });
      }
    }
  };

  const handleBlur = (e) => {
    const { value } = e.target;
    const numericValue = parseFloat(value.replace(/,/g, '').replace(/%/g, ''));
    if (!isNaN(numericValue)) {
      setInputValue(formatPercent(numericValue.toFixed(decimalPlaces))); // Format the value with fixed decimal places on blur
    } else {
      setInputValue('');
    }
  };

  const handleStep = (increment) => {
    let numericValue = parseFloat(inputValue.replace(/,/g, '').replace(/%/g, '')) || 0;
    numericValue = (numericValue + increment).toFixed(decimalPlaces);
    setInputValue(formatPercent(numericValue)); // Remove trailing zeros
    onChange({ target: { name, value: (numericValue / 100).toFixed(decimalPlaces) } });
  };

  return (
    <div className="formatted-number-input">
      <input
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
      />
      <div className="step-buttons">
        <button type="button" onClick={() => handleStep(parseFloat(step))}>▲</button>
        <button type="button" onClick={() => handleStep(-parseFloat(step))}>▼</button>
      </div>
    </div>
  );
};

export default FormattedPercentInput;
