// FormattedPercentInput.js

import React, { useState, useEffect } from 'react';

const FormattedPercentInput = ({ name, value, onChange, step, decimalPlaces = 2 }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value !== '' && !isNaN(value)) {
      setInputValue((value * 100).toFixed(decimalPlaces));
    } else {
      setInputValue('');
    }
  }, [value, decimalPlaces]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      const formattedValue = numericValue.toFixed(decimalPlaces);
      setInputValue(formattedValue);
      onChange({ target: { name, value: (numericValue / 100).toFixed(decimalPlaces) } });
    } else {
      setInputValue('');
      onChange({ target: { name, value: '' } });
    }
  };

  const handleStep = (increment) => {
    const numericValue = parseFloat(inputValue) || 0;
    const newValue = numericValue + increment;
    setInputValue(newValue.toFixed(decimalPlaces));
    onChange({ target: { name, value: (newValue / 100).toFixed(decimalPlaces) } });
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
