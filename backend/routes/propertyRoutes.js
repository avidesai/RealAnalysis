const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Property = require('../models/Property');

const router = express.Router();

// @route   GET /api/properties
// @desc    Get all properties for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const properties = await Property.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/properties
// @desc    Create a new property
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      user: req.user._id,
    });
    const saved = await property.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get a specific property
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
