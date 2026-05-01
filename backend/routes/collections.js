const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');

// POST /api/collections — driver marks a report as collected
router.post('/', protect, async (req, res) => {
  const { reportId, notes } = req.body;
  try {
    const collection = await Collection.create({
      report: reportId,
      driver: req.user._id,
      notes
    });
    await Report.findByIdAndUpdate(reportId, { status: 'collected' });
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/collections — get all collections
router.get('/', protect, async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate('report')
      .populate('driver', 'name email');
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;