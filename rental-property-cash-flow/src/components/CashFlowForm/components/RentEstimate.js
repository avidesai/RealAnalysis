import React from 'react';

const RentEstimate = ({ rentData, onApply }) => {
  if (!rentData) return null;

  const labels = ['0BR', '1BR', '2BR', '3BR', '4BR'];
  const values = [
    rentData.Efficiency,
    rentData.One_Bedroom,
    rentData.Two_Bedroom,
    rentData.Three_Bedroom,
    rentData.Four_Bedroom,
  ].filter(v => v != null);

  if (values.length === 0) return null;

  const formatRent = (v) => `$${Math.round(v).toLocaleString()}`;

  return (
    <div className="rent-estimate">
      <span className="rent-estimate-label">FMR Estimates:</span>
      <div className="rent-estimate-chips">
        {values.map((val, i) => (
          <button
            key={labels[i]}
            type="button"
            className="rent-chip"
            onClick={() => onApply(val)}
            title={`Apply ${formatRent(val)}/mo`}
          >
            {labels[i]}: {formatRent(val)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RentEstimate;
