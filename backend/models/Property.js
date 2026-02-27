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
  purchasePrice: { type: Number, required: true, min: 0 },
  monthlyRentPerUnit: { type: Number, required: true, min: 0 },
  numberOfUnits: { type: Number, required: true, min: 1, max: 1000 },
  propertyTaxRate: { type: Number, required: true, min: 0, max: 1 },
  vacancyRate: { type: Number, required: true, min: 0, max: 1 },
  propertyManagementRate: { type: Number, required: true, min: 0, max: 1 },
  landlordInsurance: { type: Number, default: 0, min: 0 },
  hoaFees: { type: Number, default: 0, min: 0 },
  waterAndSewer: { type: Number, default: 0, min: 0 },
  gasAndElectricity: { type: Number, default: 0, min: 0 },
  garbage: { type: Number, default: 0, min: 0 },
  snowRemoval: { type: Number, default: 0, min: 0 },
  downPaymentPercentage: { type: Number, required: true, min: 0.01, max: 1 },
  lengthOfMortgage: { type: Number, required: true, min: 1, max: 50 },
  mortgageRate: { type: Number, required: true, min: 0, max: 1 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Property', propertySchema);
