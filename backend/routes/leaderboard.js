const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/leaderboard — top 10 citizens by points
router.get('/', protect, async (req, res) => {
  try {
    const leaders = await User.find({ role: 'citizen' })
      .select('name points createdAt')
      .sort({ points: -1 })
      .limit(10);
    res.json(leaders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;