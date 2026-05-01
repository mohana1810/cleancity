const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  citizen:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true },
  description: { type: String },
  location: {
    address: { type: String, required: true },
    coordinates: { lat: Number, lng: Number }
  },
  wasteType: {
    type: String,
    enum: ['general', 'recyclable', 'hazardous', 'organic'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'collected', 'resolved'],
    default: 'pending'
  },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  photo: {
    url:       { type: String, default: null },
    publicId:  { type: String, default: null }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);