const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    default: '',
    trim: true,
  },
  address: {
    type: String,
    default: '',
    trim: true,
  },
  notes: {
    type: String,
    default: '',
    trim: true,
  },
  listingUrl: {
    type: String,
    default: '',
    trim: true,
  },
  purchasePrice: { type: Number, required: true, min: 0 },
  monthlyRentPerUnit: { type: Number, required: true, min: 0 },
  numberOfUnits: { type: Number, required: true, min: 1, max: 1000 },
  propertyTaxRate: { type: Number, required: true, min: 0, max: 1 },
  vacancyRate: { type: Number, required: true, min: 0, max: 1 },
  propertyManagementRate: { type: Number, required: true, min: 0, max: 1 },
  landlordInsurance: { type: Number, default: 0, min: 0 },
  maintenanceReserve: { type: Number, default: 0, min: 0 },
  hoaFees: { type: Number, default: 0, min: 0 },
  waterAndSewer: { type: Number, default: 0, min: 0 },
  gasAndElectricity: { type: Number, default: 0, min: 0 },
  garbage: { type: Number, default: 0, min: 0 },
  snowRemoval: { type: Number, default: 0, min: 0 },
  downPaymentPercentage: { type: Number, required: true, min: 0.01, max: 1 },
  lengthOfMortgage: { type: Number, required: true, min: 1, max: 50 },
  mortgageRate: { type: Number, required: true, min: 0, max: 1 },
  // BRRRR fields
  calculatorMode: { type: String, enum: ['standard', 'brrrr', 'str'], default: 'standard' },
  estimatedRepairCost: { type: Number, default: 0, min: 0 },
  afterRepairValue: { type: Number, default: 0, min: 0 },
  holdingPeriodMonths: { type: Number, default: 0, min: 0 },
  holdingCostsPerMonth: { type: Number, default: 0, min: 0 },
  refinanceLTV: { type: Number, default: 0.75, min: 0, max: 1 },
  refinanceInterestRate: { type: Number, default: 0.065, min: 0, max: 1 },
  refinanceTermYears: { type: Number, default: 30, min: 1, max: 50 },
  // STR fields
  nightlyRate: { type: Number, default: 0, min: 0 },
  occupancyRate: { type: Number, default: 0.70, min: 0, max: 1 },
  averageStayLength: { type: Number, default: 3, min: 1 },
  cleaningCostPerTurnover: { type: Number, default: 0, min: 0 },
  platformFeeRate: { type: Number, default: 0.03, min: 0, max: 1 },
  // Sharing
  shareToken: { type: String, unique: true, sparse: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Property', propertySchema);
