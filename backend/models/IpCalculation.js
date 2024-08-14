// models/IpCalculation.js
const mongoose = require('mongoose');

const IpCalculationSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
  },
  calculationCount: {
    type: Number,
    default: 0,
  },
  lastCalculationDate: {
    type: Date,
    default: Date.now,
  },
});

IpCalculationSchema.methods.resetIfCooldownPassed = function () {
  const now = new Date();
  const timePassed = now - this.lastCalculationDate;
  const cooldownPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (timePassed >= cooldownPeriod) {
    this.calculationCount = 0;
    this.lastCalculationDate = now;
  }
};

module.exports = mongoose.model('IpCalculation', IpCalculationSchema);
