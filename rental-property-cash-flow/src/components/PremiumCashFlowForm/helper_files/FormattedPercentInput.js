import React, { useState, useEffect } from 'react';

const FormattedPercentInput = ({ name, value, onChange, step = 1, decimalPlaces = 2 }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value !== '' && !isNaN(value)) {
      setInputValue((value * 100).toFixed(decimalPlaces));
    } else {
      setInputValue('');
    }
  }, [value, decimalPlaces]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      setInputValue(newValue);
    }
  };

  const handleBlur = () => {
    let numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      const adjustedValue = parseFloat((numericValue / 100).toFixed(decimalPlaces));
      setInputValue((adjustedValue * 100).toFixed(decimalPlaces));
      onChange({ target: { name, value: adjustedValue } });
    } else {
      setInputValue('');
      onChange({ target: { name, value: '' } });
    }
  };

  const handleStep = (increment) => {
    let numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) numericValue = 0;
    const newValue = (numericValue + increment).toFixed(decimalPlaces);
    setInputValue(newValue);
    const adjustedValue = parseFloat(newValue) / 100;
    onChange({ target: { name, value: adjustedValue } });
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
