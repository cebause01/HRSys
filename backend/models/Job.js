const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  type: {
    type: String,
    enum: ['full_time', 'part_time', 'contract', 'internship'],
    default: 'full_time'
  },
  description: {
    type: String,
    required: true
  },
  requirements: [String],
  responsibilities: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'closed', 'filled'],
    default: 'draft'
  },
  postedTo: [{
    platform: String,
    postedAt: Date,
    url: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);
