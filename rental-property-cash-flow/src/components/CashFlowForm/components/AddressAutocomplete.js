import React, { useState, useRef, useEffect, useCallback } from 'react';
import { autocompleteAddress } from '../../../services/api';
import './AddressAutocomplete.css';

const AddressAutocomplete = ({ value, onChange, onAddressSelect }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (text) => {
    if (text.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await autocompleteAddress(text);
      const results = res.data.results || [];
      setSuggestions(results.slice(0, 6));
      setShowDropdown(results.length > 0);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    onChange(e);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 300);
  };

  const selectSuggestion = (suggestion) => {
    const formatted = suggestion.formatted || '';
    const city = suggestion.city || '';
    const state = suggestion.state || '';
    const zip = suggestion.postcode || '';
    onChange({ target: { name: 'address', value: formatted } });
    setShowDropdown(false);
    setSuggestions([]);
    if (onAddressSelect) {
      onAddressSelect({ formatted, city, state, zip });
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="address-autocomplete" ref={wrapperRef}>
      <input
        type="text"
        name="address"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Property address (e.g. 123 Main St, Chicago, IL)"
        className="address-input"
        autoComplete="off"
      />
      {loading && <div className="address-loading-indicator" />}
      {showDropdown && suggestions.length > 0 && (
        <div className="address-dropdown">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className={`address-dropdown-item ${i === activeIndex ? 'active' : ''}`}
              onClick={() => selectSuggestion(s)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="address-pin-icon">
                <path d="M8 1.5a4.5 4.5 0 014.5 4.5c0 3.5-4.5 8.5-4.5 8.5S3.5 9.5 3.5 6A4.5 4.5 0 018 1.5z" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="6" r="1.5"/>
              </svg>
              <span>{s.formatted}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
