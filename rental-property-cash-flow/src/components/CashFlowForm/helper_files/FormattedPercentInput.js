import React, { useState, useEffect } from 'react';

const FormattedPercentInput = ({ name, value, onChange, step, decimalPlaces = 2 }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value !== '') {
      setInputValue((value * 100).toFixed(decimalPlaces)); // Convert initial value to percentage
    } else {
      setInputValue('');
    }
  }, [value, decimalPlaces]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/,/g, '').replace(/%/g, '');
    if (numericValue === '' || (!isNaN(numericValue) && numericValue !== '-')) {
      setInputValue(numericValue);
      if (numericValue !== '') {
        onChange({ target: { name, value: (parseFloat(numericValue) / 100).toFixed(4) } });
      } else {
        onChange({ target: { name, value: '' } });
      }
    }
  };

  const handleBlur = (e) => {
    const { value } = e.target;
    if (value === '') {
      setInputValue('');
    } else {
      const formattedValue = parseFloat(value.replace(/,/g, '').replace(/%/g, '')).toFixed(decimalPlaces);
      setInputValue(formattedValue);
    }
  };

  const handleStep = (increment) => {
    let numericValue = parseFloat(inputValue.replace(/,/g, '').replace(/%/g, '')) || 0;
    numericValue = (numericValue + increment).toFixed(decimalPlaces);
    setInputValue(numericValue);
    onChange({ target: { name, value: (numericValue / 100).toFixed(4) } });
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
