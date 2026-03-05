const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/external/autocomplete?text=...
// @desc    Proxy to Geoapify geocode autocomplete (US addresses only)
// @access  Private
router.get('/autocomplete', async (req, res) => {
  const { text } = req.query;
  if (!text || text.length < 3) {
    return res.json({ results: [] });
  }
  try {
    const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
      params: {
        text,
        type: 'street',
        filter: 'countrycode:us',
        format: 'json',
        apiKey: process.env.GEOAPIFY_KEY,
      },
    });
    res.json({ results: response.data.results || [] });
  } catch (err) {
    res.status(502).json({ message: 'Autocomplete service unavailable' });
  }
});

// @route   GET /api/external/property-tax?zip=...
// @desc    Proxy to API Ninjas for median property tax rate by zip
// @access  Private
router.get('/property-tax', async (req, res) => {
  const { zip } = req.query;
  if (!zip) {
    return res.status(400).json({ message: 'zip is required' });
  }
  try {
    const response = await axios.get('https://api.api-ninjas.com/v1/propertytax', {
      params: { zip },
      headers: { 'X-Api-Key': process.env.NINJAS_KEY },
    });
    res.json(response.data);
  } catch (err) {
    res.status(502).json({ message: 'Property tax service unavailable' });
  }
});

// @route   GET /api/external/rent-estimate?zip=...
// @desc    Proxy to HUD Fair Market Rents API
// @access  Private
router.get('/rent-estimate', async (req, res) => {
  const { zip } = req.query;
  if (!zip) {
    return res.status(400).json({ message: 'zip is required' });
  }
  try {
    const response = await axios.get(`https://www.huduser.gov/hudapi/public/fmr/data/${zip}`, {
      headers: { Authorization: `Bearer ${process.env.HUD_TOKEN}` },
    });
    res.json(response.data);
  } catch (err) {
    res.status(502).json({ message: 'Rent estimate service unavailable' });
  }
});

// @route   GET /api/external/property-details?address=...
// @desc    Proxy to RentCast for property details
// @access  Private
router.get('/property-details', async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ message: 'address is required' });
  }
  try {
    const response = await axios.get('https://api.rentcast.io/v1/properties', {
      params: { address },
      headers: { 'X-Api-Key': process.env.RENTCAST_KEY },
    });
    res.json(response.data);
  } catch (err) {
    res.status(502).json({ message: 'Property details service unavailable' });
  }
});

module.exports = router;
