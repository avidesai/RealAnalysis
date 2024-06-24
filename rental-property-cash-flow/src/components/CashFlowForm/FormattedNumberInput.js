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
    const { name, value } = e.target;
    const numericValue = value.replace(/,/g, '');
    setInputValue(formatNumberWithCommas(numericValue));
    onChange({ target: { name, value: numericValue } });
  };

  const handleStep = (increment) => {
    const numericValue = parseFloat(value) + increment;
    setInputValue(formatNumberWithCommas(numericValue));
    onChange({ target: { name, value: numericValue.toString() } }); // Ensure the value is a string
  };

  return (
    <div className="formatted-number-input">
      <input
        type="text"
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={(e) => handleInputChange(e)} // Ensure value is updated without commas
        onFocus={(e) => e.target.select()} // Select input text on focus
      />
      <div className="step-buttons">
        <button type="button" onClick={() => handleStep(parseFloat(step))}>▲</button>
        <button type="button" onClick={() => handleStep(-parseFloat(step))}>▼</button>
      </div>
    </div>
  );
};

export default FormattedNumberInput;
