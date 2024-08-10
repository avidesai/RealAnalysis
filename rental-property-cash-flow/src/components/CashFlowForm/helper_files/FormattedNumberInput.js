// FormattedNumberInput.js

import React, { useState, useEffect } from 'react';

const formatNumberWithCommas = (value) => {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const FormattedNumberInput = ({ name, value, onChange, step }) => {
  const [inputValue, setInputValue] = useState(formatNumberWithCommas(value));

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
    setInputValue(formatNumberWithCommas(newValue));
    onChange({ target: { name, value: newValue.toString() } });
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

export default FormattedNumberInput;
