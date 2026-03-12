import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

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
  ws['!cols'] = [{ wch: 28 }, { wch: 20 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Analysis');
  XLSX.writeFile(wb, buildFilename(propertyMeta, 'xlsx'));
};

export const exportToPDF = (formData, results, formatCurrency, propertyMeta) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = margin;

  const addText = (text, x, size, weight, color) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', weight || 'normal');
    doc.setTextColor(...(color || [17, 24, 39]));
    doc.text(text, x, y);
  };

  const addRow = (label, value, indent) => {
    const x = margin + (indent || 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(label, x, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(String(value), pageW - margin, y, { align: 'right' });
    y += 5;
  };

  const addSectionHeader = (text) => {
    y += 3;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text(text.toUpperCase(), margin, y);
    y += 1.5;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageW - margin, y);
    y += 5;
  };

  // Header
  addText('Property Analysis Report', margin, 18, 'bold');
  y += 5;
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 40, y);
  y += 6;

  // Property info
  addText(propertyMeta?.address || 'N/A', margin, 11, 'bold');
  y += 5;
  if (propertyMeta?.name) {
    addText(propertyMeta.name, margin, 9, 'normal', [107, 114, 128]);
    y += 4;
  }
  const isSTR = formData.calculatorMode === 'str';
  const modeLabel = isSTR ? 'Short Term Rental' : formData.calculatorMode === 'brrrr' ? 'BRRRR' : 'Long Term Rental';
  addText(`${modeLabel}  |  ${new Date().toLocaleDateString()}`, margin, 8, 'normal', [156, 163, 175]);
  y += 8;

  if (!results) {
    addText('No results to display. Enter property details to generate analysis.', margin, 10, 'normal', [107, 114, 128]);
    doc.save(buildFilename(propertyMeta, 'pdf'));
    return;
  }

  // KPI Cards
  const cocPct = (results.cashOnCashReturn * 100).toFixed(2);
  const capPct = (results.capRate * 100).toFixed(2);
  const kpis = [
    { label: 'Cash on Cash', value: `${cocPct}%`, good: results.cashOnCashReturn >= 0.10 },
    { label: 'Cap Rate', value: `${capPct}%`, good: results.capRate >= 0.06 },
    { label: 'Monthly Cash Flow', value: formatCurrency(results.monthlyCashFlow), good: results.monthlyCashFlow >= 200 },
    { label: 'Annual Cash Flow', value: formatCurrency(results.annualCashFlow), good: results.annualCashFlow >= 0 },
  ];

  const kpiW = (contentW - 6) / 4;
  kpis.forEach((kpi, i) => {
    const x = margin + i * (kpiW + 2);
    const color = kpi.good ? [16, 185, 129] : [107, 114, 128];
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(x, y, kpiW, 18, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text(kpi.label, x + 3, y + 5);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(kpi.value, x + 3, y + 13);
  });
  y += 24;

  // Financing
  addSectionHeader('Financing');
  addRow('Purchase Price', formatCurrency(formData.purchasePrice));
  addRow('Down Payment', `${formatCurrency(results.downPayment)} (${(formData.downPaymentPercentage * 100).toFixed(0)}%)`);
  addRow('Loan Amount', formatCurrency(results.loanAmount));
  addRow('Mortgage Payment', `${formatCurrency(results.monthlyMortgagePayment)}/mo`);
  addRow('Gross Rent Multiplier', results.grossRentMultiplier.toFixed(2));

  // Income
  addSectionHeader('Income');
  if (isSTR && results.str) {
    addRow('Nightly Rate', formatCurrency(results.str.nightlyRate));
    addRow('Occupancy', `${(results.str.occupancyRate * 100).toFixed(0)}%`);
    addRow('Gross Revenue', `${formatCurrency(results.str.monthlyGrossRevenue)}/mo`);
    addRow('Platform Fees', `-${formatCurrency(results.str.monthlyPlatformFees)}/mo`);
    addRow('Cleaning Costs', `-${formatCurrency(results.str.monthlyCleaningCosts)}/mo`);
    addRow('Net Income', `${formatCurrency(results.monthlyGrossIncome)}/mo`);
    addRow('RevPAR', formatCurrency(results.str.revPAR));
  } else {
    addRow('Monthly Rent', `${formatCurrency(results.monthlyRentalIncome)}/mo`);
    addRow('Vacancy Loss', `-${formatCurrency(results.vacancyLoss)}/mo`);
    addRow('Gross Income', `${formatCurrency(results.monthlyGrossIncome)}/mo`);
  }

  // Expenses
  addSectionHeader('Expenses');
  addRow('Property Management', `${formatCurrency(results.propertyManagementFees)}/mo`);
  addRow('Property Tax', `${formatCurrency(results.propertyTax)}/mo`);
  addRow('Insurance', `${formatCurrency(formData.landlordInsurance || 0)}/mo`);
  addRow('Maintenance', `${formatCurrency(formData.maintenanceReserve || 0)}/mo`);
  addRow('Operating Expenses', `${formatCurrency(results.monthlyOperatingExpenses)}/mo`);
  addRow('Monthly NOI', `${formatCurrency(results.monthlyNOI)}/mo`);
  addRow('Annual NOI', formatCurrency(results.annualNOI));

  // BRRRR section
  if (formData.calculatorMode === 'brrrr' && results.brrrr) {
    addSectionHeader('BRRRR Analysis');
    addRow('Total Investment', formatCurrency(results.brrrr.totalInvestment));
    addRow('New Loan (Refinance)', formatCurrency(results.brrrr.newLoanAmount));
    addRow('Cash Left in Deal', formatCurrency(results.brrrr.cashLeftInDeal));
    addRow('New Mortgage', `${formatCurrency(results.brrrr.newMonthlyMortgage)}/mo`);
    addRow('New Cash Flow', `${formatCurrency(results.brrrr.newMonthlyCashFlow)}/mo`);
    addRow('BRRRR CoC Return', results.brrrr.brrrrCashOnCash === Infinity ? 'Infinite' : `${(results.brrrr.brrrrCashOnCash * 100).toFixed(2)}%`);
  }

  // Footer
  y += 4;
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, y, pageW - margin, y);
  y += 5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text(`Generated by CapRate.io on ${new Date().toLocaleDateString()}`, margin, y);

  doc.save(buildFilename(propertyMeta, 'pdf'));
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
