import React, { useState, useEffect } from 'react';

const FormattedPercentInput = ({ name, value, onChange, step = 1, decimalPlaces = 2 }) => {
  // Initialize with the percentage value
  const [inputValue, setInputValue] = useState('');

  // Update input when prop value changes
  useEffect(() => {
    if (value !== '' && !isNaN(value)) {
      // Convert decimal to percentage for display
      setInputValue((value * 100).toFixed(decimalPlaces));
    } else {
      setInputValue('');
    }
  }, [value, decimalPlaces]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(newValue)) {
      setInputValue(newValue);
      // Convert percentage to decimal for the onChange handler
      const decimalValue = parseFloat(newValue) / 100;
      if (!isNaN(decimalValue)) {
        onChange({ target: { name, value: decimalValue } });
      }
    }
  };

  const handleBlur = () => {
    let numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      // Format to fixed decimal places on blur
      setInputValue(numericValue.toFixed(decimalPlaces));
      // Ensure the decimal value is stored
      onChange({ target: { name, value: numericValue / 100 } });
    } else {
      setInputValue('');
      onChange({ target: { name, value: '' } });
    }
  };

  const handleStep = (increment) => {
    let currentValue = parseFloat(inputValue) || 0;
    const newValue = (currentValue + increment).toFixed(decimalPlaces);
    setInputValue(newValue);
    onChange({ target: { name, value: parseFloat(newValue) / 100 } });
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