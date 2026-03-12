import React from 'react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const calcMetrics = (p) => {
  const monthlyRent = p.monthlyRentPerUnit * p.numberOfUnits;
  const vacancy = monthlyRent * p.vacancyRate;
  const grossIncome = monthlyRent - vacancy;
  const mgmt = monthlyRent * p.propertyManagementRate;
  const tax = (p.propertyTaxRate * p.purchasePrice) / 12;
  const opex = mgmt + tax + (p.landlordInsurance || 0) + (p.maintenanceReserve || 0) + (p.hoaFees || 0) +
    (p.waterAndSewer || 0) + (p.gasAndElectricity || 0) + (p.garbage || 0) + (p.snowRemoval || 0);
  const noi = grossIncome - opex;
  const down = p.purchasePrice * p.downPaymentPercentage;
  const loan = p.purchasePrice - down;
  const mr = p.mortgageRate / 12;
  const np = p.lengthOfMortgage * 12;
  const mortgage = loan > 0 && mr > 0
    ? (loan * mr * Math.pow(1 + mr, np)) / (Math.pow(1 + mr, np) - 1) : 0;
  const cashFlow = noi - mortgage;
  const annualNOI = noi * 12;
  const capRate = p.purchasePrice > 0 ? annualNOI / p.purchasePrice : 0;
  const coc = down > 0 ? (cashFlow * 12) / down : 0;
  const grm = (monthlyRent * 12) > 0 ? p.purchasePrice / (monthlyRent * 12) : 0;
  return { cashFlow, capRate, coc, mortgage, noi, down, annualNOI, loan, grm };
};

const getTier = (type, value) => {
  switch (type) {
    case 'cashFlow': return value >= 200 ? 'positive' : value >= 0 ? 'warning' : 'negative';
    case 'coc': return value >= 0.10 ? 'positive' : value >= 0.05 ? 'warning' : 'negative';
    case 'capRate': return value >= 0.06 ? 'positive' : value >= 0.03 ? 'warning' : 'negative';
    default: return 'neutral';
  }
};

const metricRows = [
  { label: 'Purchase Price', getValue: (p, m) => formatCurrency(p.purchasePrice) },
  { label: 'Monthly Rent', getValue: (p, m) => formatCurrency(p.monthlyRentPerUnit * p.numberOfUnits) },
  { label: 'Units', getValue: (p, m) => p.numberOfUnits },
  { label: 'Down Payment', getValue: (p, m) => `${formatCurrency(m.down)} (${(p.downPaymentPercentage * 100).toFixed(0)}%)` },
  { label: 'Loan Amount', getValue: (p, m) => formatCurrency(m.loan) },
  { label: 'Mortgage Rate', getValue: (p, m) => `${(p.mortgageRate * 100).toFixed(2)}%` },
  { label: 'Mortgage Payment', getValue: (p, m) => `${formatCurrency(m.mortgage)}/mo` },
  { divider: true, label: 'Key Metrics' },
  { label: 'Monthly Cash Flow', getValue: (p, m) => formatCurrency(m.cashFlow), best: 'max', tier: 'cashFlow', raw: (p, m) => m.cashFlow },
  { label: 'CoC Return', getValue: (p, m) => `${(m.coc * 100).toFixed(2)}%`, best: 'max', tier: 'coc', raw: (p, m) => m.coc },
  { label: 'Cap Rate', getValue: (p, m) => `${(m.capRate * 100).toFixed(2)}%`, best: 'max', tier: 'capRate', raw: (p, m) => m.capRate },
  { label: 'Monthly NOI', getValue: (p, m) => formatCurrency(m.noi), best: 'max', raw: (p, m) => m.noi },
  { label: 'Annual NOI', getValue: (p, m) => formatCurrency(m.annualNOI), best: 'max', raw: (p, m) => m.annualNOI },
  { label: 'GRM', getValue: (p, m) => m.grm.toFixed(2), best: 'min', raw: (p, m) => m.grm },
  { divider: true, label: 'Expenses' },
  { label: 'Vacancy Rate', getValue: (p, m) => `${(p.vacancyRate * 100).toFixed(1)}%` },
  { label: 'Property Mgmt', getValue: (p, m) => `${(p.propertyManagementRate * 100).toFixed(0)}%` },
  { label: 'Property Tax', getValue: (p, m) => `${(p.propertyTaxRate * 100).toFixed(2)}%` },
  { label: 'Insurance', getValue: (p, m) => formatCurrency(p.landlordInsurance || 0) },
  { label: 'Maintenance', getValue: (p, m) => formatCurrency(p.maintenanceReserve || 0) },
];

const CompareView = ({ properties, onClose }) => {
  const data = properties.map(p => ({ property: p, metrics: calcMetrics(p) }));

  // Find best values for highlighted rows
  const bestMap = {};
  metricRows.forEach(row => {
    if (row.best && row.raw) {
      const values = data.map(d => row.raw(d.property, d.metrics));
      const bestVal = row.best === 'max' ? Math.max(...values) : Math.min(...values);
      bestMap[row.label] = bestVal;
    }
  });

  return (
    <div className="compare-backdrop" onClick={onClose}>
      <div className="compare-modal" onClick={e => e.stopPropagation()}>
        <div className="compare-header">
          <h2>Compare Properties</h2>
          <button className="compare-close" onClick={onClose}>&times;</button>
        </div>
        <div className="compare-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="compare-label-col"></th>
                {data.map(d => (
                  <th key={d.property._id} className="compare-prop-col">
                    <div className="compare-prop-name">{d.property.address || d.property.name || 'Untitled'}</div>
                    {d.property.name && d.property.address && (
                      <div className="compare-prop-subname">{d.property.name}</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metricRows.map((row, i) => {
                if (row.divider) {
                  return (
                    <tr key={i} className="compare-divider-row">
                      <td colSpan={data.length + 1} className="compare-divider-cell">{row.label}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={i} className="compare-row">
                    <td className="compare-label">{row.label}</td>
                    {data.map(d => {
                      const val = row.getValue(d.property, d.metrics);
                      const rawVal = row.raw ? row.raw(d.property, d.metrics) : null;
                      const isBest = row.best && rawVal !== null && rawVal === bestMap[row.label] && data.length > 1;
                      const tier = row.tier ? getTier(row.tier, rawVal) : null;
                      return (
                        <td
                          key={d.property._id}
                          className={`compare-value ${isBest ? 'compare-best' : ''} ${tier ? `compare-${tier}` : ''}`}
                        >
                          {val}
                          {isBest && <span className="compare-best-badge">Best</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareView;
