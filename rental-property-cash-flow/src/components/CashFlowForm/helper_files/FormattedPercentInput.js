import React, { useState, useEffect } from 'react';

const FormattedPercentInput = ({
  name,
  value,
  onChange,
  step = 1,
  decimalPlaces = 2,
  min = 0,
  max = 100,
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value !== '' && !isNaN(value)) {
      setInputValue((value * 100).toFixed(decimalPlaces));
    } else {
      setInputValue('');
    }
  }, [value, decimalPlaces]);

  const clampPercent = (pct) => {
    if (min !== undefined && pct < min) return min;
    if (max !== undefined && pct > max) return max;
    return pct;
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*\.?\d*$/.test(newValue)) {
      setInputValue(newValue);
      const decimalValue = parseFloat(newValue) / 100;
      if (!isNaN(decimalValue)) {
        onChange({ target: { name, value: decimalValue } });
      }
    }
  };

  const handleBlur = () => {
    let numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      numericValue = clampPercent(numericValue);
      setInputValue(numericValue.toFixed(decimalPlaces));
      onChange({ target: { name, value: numericValue / 100 } });
    } else {
      const fallback = min !== undefined ? min : 0;
      setInputValue(fallback.toFixed(decimalPlaces));
      onChange({ target: { name, value: fallback / 100 } });
    }
  };

  const handleStep = (increment) => {
    let currentValue = parseFloat(inputValue) || 0;
    const newValue = clampPercent(
      parseFloat((currentValue + increment).toFixed(decimalPlaces))
    );
    setInputValue(newValue.toFixed(decimalPlaces));
    onChange({ target: { name, value: newValue / 100 } });
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
