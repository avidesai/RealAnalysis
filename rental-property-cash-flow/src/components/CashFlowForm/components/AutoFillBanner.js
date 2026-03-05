import React from 'react';

const AutoFillBanner = ({ data, onDismiss }) => {
  if (!data) return null;

  const parts = [];
  if (data.bedrooms != null && data.bathrooms != null) parts.push(`${data.bedrooms}bd/${data.bathrooms}ba`);
  if (data.squareFootage) parts.push(`${data.squareFootage.toLocaleString()} sqft`);

  if (parts.length === 0) return null;

  return (
    <div className="autofill-banner">
      <div className="autofill-banner-content">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="autofill-icon">
          <circle cx="8" cy="8" r="7" />
          <path d="M8 5v3M8 10.5v.5" strokeLinecap="round" />
        </svg>
        <span className="autofill-text">Property: {parts.join(' | ')}</span>
      </div>
      <div className="autofill-banner-actions">
        <button type="button" className="autofill-dismiss" onClick={onDismiss}>&times;</button>
      </div>
    </div>
  );
};

export default AutoFillBanner;
