// routes/calculationRoutes.js
const express = require('express');
const IpCalculation = require('../models/IpCalculation');
const getUserIp = require('../middleware/getUserIp');
const router = express.Router();

router.use(getUserIp);

// Endpoint to check if the user can calculate and update the calculation count
router.post('/check', async (req, res) => {
  try {
    const userIp = req.userIp;
    let ipCalculation = await IpCalculation.findOne({ ip: userIp });

    if (!ipCalculation) {
      ipCalculation = new IpCalculation({ ip: userIp });
      await ipCalculation.save();
    } else {
      // Reset calculation count if 5 minutes have passed since the last calculation
      const now = new Date();
      const timeDiff = now - ipCalculation.lastCalculationDate;
      const cooldownPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeDiff >= cooldownPeriod) {
        ipCalculation.calculationCount = 0;
        ipCalculation.lastCalculationDate = now;
        await ipCalculation.save();
      }
    }

    if (ipCalculation.calculationCount >= 5) {
      return res.status(403).json({ message: 'Calculation limit reached. Try again later or upgrade to premium.' });
    }

    res.status(200).json({ canCalculate: true, calculationCount: ipCalculation.calculationCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to increment calculation count
router.post('/increment', async (req, res) => {
  try {
    const userIp = req.userIp;
    let ipCalculation = await IpCalculation.findOne({ ip: userIp });

    if (!ipCalculation) {
      return res.status(404).json({ message: 'IP record not found' });
    }

    ipCalculation.calculationCount += 1;
    ipCalculation.lastCalculationDate = new Date();
    await ipCalculation.save();

    res.status(200).json({ calculationCount: ipCalculation.calculationCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
