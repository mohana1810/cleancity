const express  = require('express');
const router   = express.Router();
const Report   = require('../models/Report');
const User     = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

// GET /api/reports — role filtered
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'citizen') query = { citizen: req.user._id };
    if (req.user.role === 'driver')  query = { assignedDriver: req.user._id };
    const reports = await Report.find(query)
      .populate('citizen', 'name email')
      .populate('assignedDriver', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/reports — with optional photo upload
router.post('/', protect, upload.single('photo'), async (req, res) => {
  const { title, description, address, wasteType } = req.body;
  try {
    const reportData = {
      citizen:   req.user._id,
      title,
      description,
      location:  { address },
      wasteType: wasteType || 'general',
      photo: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : { url: null, publicId: null }
    };
    const report = await Report.create(reportData);
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 10 } });
    res.status(201).json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PATCH /api/reports/:id/status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, assignedDriver: req.body.assignedDriver },
      { new: true }
    ).populate('citizen', 'name email')
     .populate('assignedDriver', 'name email');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/reports/:id — also deletes photo from cloudinary
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Not found' });
    // Delete photo from Cloudinary if exists
    if (report.photo?.publicId) {
      await cloudinary.uploader.destroy(report.photo.publicId);
    }
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;