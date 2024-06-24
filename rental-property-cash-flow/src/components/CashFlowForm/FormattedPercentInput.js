import React, { useState, useEffect } from 'react';

const FormattedPercentInput = ({ name, value, onChange, step, decimalPlaces = 2 }) => {
  const [inputValue, setInputValue] = useState((value * 100).toFixed(decimalPlaces)); // Convert initial value to percentage

  useEffect(() => {
    setInputValue((value * 100).toFixed(decimalPlaces)); // Update inputValue whenever the value prop changes
  }, [value, decimalPlaces]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/,/g, '');
    if (!isNaN(numericValue)) {
      setInputValue(numericValue);
      onChange({ target: { name, value: (parseFloat(numericValue) / 100).toFixed(4) } });
    } else {
      setInputValue('');
      onChange({ target: { name, value: '' } });
    }
  };

  const handleStep = (increment) => {
    const numericValue = (parseFloat(inputValue.replace(/,/g, '')) + increment).toFixed(decimalPlaces); // Step the value
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
        onBlur={(e) => setInputValue(parseFloat(e.target.value).toFixed(decimalPlaces))} // Ensure value is formatted correctly on blur
        onFocus={(e) => e.target.select()} // Select input text on focus
      />
      <div className="step-buttons">
        <button type="button" onClick={() => handleStep(parseFloat(step))}>▲</button>
        <button type="button" onClick={() => handleStep(-parseFloat(step))}>▼</button>
      </div>
    </div>
  );
};

export default FormattedPercentInput;
