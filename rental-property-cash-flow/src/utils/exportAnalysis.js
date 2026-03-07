import * as XLSX from 'xlsx';

const buildExportData = (formData, results, formatCurrency, propertyMeta) => {
  const isSTR = formData.calculatorMode === 'str';
  const inputs = [
    ['Property Analysis Report'],
    [],
    ['Property', propertyMeta?.address || 'N/A'],
    ['Name', propertyMeta?.name || 'Untitled'],
    ['Mode', isSTR ? 'Short Term Rental' : formData.calculatorMode === 'brrrr' ? 'BRRRR' : 'Long Term Rental'],
    ['Date', new Date().toLocaleDateString()],
    [],
    ['--- INPUTS ---'],
    ['Purchase Price', formatCurrency(formData.purchasePrice)],
    ...(isSTR
      ? [
          ['Nightly Rate', formatCurrency(formData.nightlyRate)],
          ['Occupancy Rate', `${((formData.occupancyRate || 0.70) * 100).toFixed(1)}%`],
          ['Average Stay Length', `${formData.averageStayLength || 3} nights`],
          ['Cleaning Cost per Turnover', formatCurrency(formData.cleaningCostPerTurnover || 0)],
          ['Platform Fee Rate', `${((formData.platformFeeRate || 0.03) * 100).toFixed(1)}%`],
        ]
      : [['Monthly Rent per Unit', formatCurrency(formData.monthlyRentPerUnit)]]),
    ['Number of Units', formData.numberOfUnits],
    ...(isSTR ? [] : [['Vacancy Rate', `${(formData.vacancyRate * 100).toFixed(1)}%`]]),
    ['Property Management Rate', `${(formData.propertyManagementRate * 100).toFixed(0)}%`],
    ['Property Tax Rate', `${(formData.propertyTaxRate * 100).toFixed(2)}%`],
    ['Insurance', formatCurrency(formData.landlordInsurance)],
    ['Maintenance Reserve', formatCurrency(formData.maintenanceReserve)],
    ['HOA Dues', formatCurrency(formData.hoaFees)],
    ['Water & Sewer', formatCurrency(formData.waterAndSewer)],
    ['Gas & Electricity', formatCurrency(formData.gasAndElectricity)],
    ['Garbage', formatCurrency(formData.garbage)],
    ['Other Expenses', formatCurrency(formData.snowRemoval)],
    ['Down Payment', `${(formData.downPaymentPercentage * 100).toFixed(0)}%`],
    ['Mortgage Length', `${formData.lengthOfMortgage} years`],
    ['Mortgage Rate', `${(formData.mortgageRate * 100).toFixed(2)}%`],
  ];

  if (!results) return inputs;

  const outputRows = [
    [],
    ['--- KEY METRICS ---'],
    ['Cash on Cash Return', `${(results.cashOnCashReturn * 100).toFixed(2)}%`],
    ['Monthly Cash Flow', formatCurrency(results.monthlyCashFlow)],
    ['Annual Cash Flow', formatCurrency(results.annualCashFlow)],
    ['Cap Rate', `${(results.capRate * 100).toFixed(2)}%`],
    ['Gross Rent Multiplier', results.grossRentMultiplier.toFixed(2)],
    [],
    ['--- FINANCING ---'],
    ['Down Payment', formatCurrency(results.downPayment)],
    ['Loan Amount', formatCurrency(results.loanAmount)],
    ['Monthly Mortgage Payment', formatCurrency(results.monthlyMortgagePayment)],
    [],
    ['--- INCOME ---'],
    ...(isSTR && results.str
      ? [
          ['Monthly Gross Revenue', formatCurrency(results.str.monthlyGrossRevenue)],
          ['Platform Fees', formatCurrency(results.str.monthlyPlatformFees)],
          ['Cleaning Costs', formatCurrency(results.str.monthlyCleaningCosts)],
          ['Occupied Nights / mo', results.str.monthlyOccupiedNights.toFixed(1)],
          ['Turnovers / mo', results.str.monthlyTurnovers.toFixed(1)],
          ['RevPAR', formatCurrency(results.str.revPAR)],
          ['Net Income', formatCurrency(results.monthlyGrossIncome)],
        ]
      : [
          ['Monthly Rental Income', formatCurrency(results.monthlyRentalIncome)],
          ['Vacancy Loss', formatCurrency(results.vacancyLoss)],
          ['Monthly Gross Income', formatCurrency(results.monthlyGrossIncome)],
        ]),
    [],
    ['--- EXPENSES ---'],
    ['Property Management Fees', formatCurrency(results.propertyManagementFees)],
    ['Property Tax (monthly)', formatCurrency(results.propertyTax)],
    ['Monthly Operating Expenses', formatCurrency(results.monthlyOperatingExpenses)],
    ['Monthly NOI', formatCurrency(results.monthlyNOI)],
    ['Annual NOI', formatCurrency(results.annualNOI)],
  ];

  return [...inputs, ...outputRows];
};

export const exportToCSV = (formData, results, formatCurrency, propertyMeta) => {
  const rows = buildExportData(formData, results, formatCurrency, propertyMeta);
  const csv = rows.map(row => row.map(cell => {
    const str = String(cell ?? '');
    return str.includes(',') ? `"${str}"` : str;
  }).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, buildFilename(propertyMeta, 'csv'));
};

export const exportToXLSX = (formData, results, formatCurrency, propertyMeta) => {
  const rows = buildExportData(formData, results, formatCurrency, propertyMeta);
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws['!cols'] = [{ wch: 28 }, { wch: 20 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Analysis');
  XLSX.writeFile(wb, buildFilename(propertyMeta, 'xlsx'));
};

const buildFilename = (meta, ext) => {
  const base = meta?.address
    ? meta.address.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40)
    : 'property_analysis';
  return `${base}_${new Date().toISOString().slice(0, 10)}.${ext}`;
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
