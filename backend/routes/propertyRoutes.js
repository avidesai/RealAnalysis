const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Property = require('../models/Property');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/properties
// @desc    Get all properties for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const properties = await Property.find({ _id: { $in: req.user.properties } });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/properties
// @desc    Create a new property for the logged-in user
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const property = new Property(req.body);
    const savedProperty = await property.save();

    req.user.properties.push(savedProperty._id);
    await req.user.save();

    res.status(201).json(savedProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get a specific property by ID for the logged-in user
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property || !req.user.properties.includes(property._id)) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a specific property by ID for the logged-in user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property || !req.user.properties.includes(property._id)) {
      return res.status(404).json({ message: 'Property not found' });
    }

    Object.assign(property, req.body);
    const updatedProperty = await property.save();

    res.json(updatedProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a specific property by ID for the logged-in user
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property || !req.user.properties.includes(property._id)) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await property.remove();
    req.user.properties = req.user.properties.filter(
      (propId) => propId.toString() !== req.params.id
    );
    await req.user.save();

    res.json({ message: 'Property removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
