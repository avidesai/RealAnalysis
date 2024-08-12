const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
  purchasePrice: { type: Number, required: true },
  squareFeet: { type: Number, required: true },
  monthlyRentPerUnit: { type: Number, required: true },
  numberOfUnits: { type: Number, required: true },
  propertyTaxRate: { type: Number, required: true },
  vacancyRate: { type: Number, required: true },
  propertyManagementRate: { type: Number, required: true },
  landlordInsurance: { type: Number, required: true },
  hoaFees: { type: Number, required: true },
  waterAndSewer: { type: Number, required: true },
  gasAndElectricity: { type: Number, required: true },
  garbage: { type: Number, required: true },
  snowRemoval: { type: Number, required: true },
  cablePhoneInternet: { type: Number, required: true },
  pestControl: { type: Number, required: true },
  accountingAdvertisingLegal: { type: Number, required: true },
  desiredCapRate: { type: Number, required: true },
  downPaymentPercentage: { type: Number, required: true },
  lengthOfMortgage: { type: Number, required: true },
  mortgageRate: { type: Number, required: true },
});

module.exports = mongoose.model('Property', PropertySchema);
