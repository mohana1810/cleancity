const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collectedAt: { type: Date, default: Date.now },
  notes: { type: String }
});

module.exports = mongoose.model('Collection', collectionSchema);