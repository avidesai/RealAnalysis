// models/IpCalculation.js
const mongoose = require('mongoose');

const IpCalculationSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true
  },
  calculationCount: {
    type: Number,
    default: 0
  },
  lastCalculationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('IpCalculation', IpCalculationSchema);
