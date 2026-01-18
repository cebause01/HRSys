const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['contract', 'id', 'nda', 'certificate', 'license', 'other'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'signed', 'expired'],
    default: 'pending'
  },
  signedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  signedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', DocumentSchema);
