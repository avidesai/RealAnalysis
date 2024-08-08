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
    const { value } = e.target;
    const numericValue = value.replace(/,/g, '');
    setInputValue(value); // Set the raw input value without formatting
    onChange({ target: { name, value: numericValue } });
  };

  const handleBlur = (e) => {
    const { value } = e.target;
    setInputValue(formatNumberWithCommas(value)); // Format the value with commas on blur
  };

  const handleStep = (increment) => {
    const numericValue = parseFloat(value) + increment;
    setInputValue(formatNumberWithCommas(numericValue));
    onChange({ target: { name, value: numericValue.toString() } });
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
