const mongoose = require('mongoose');

const PerformanceReviewSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewType: {
    type: String,
    enum: ['annual', 'semi_annual', 'quarterly', 'check_in', '360'],
    default: 'annual'
  },
  period: {
    startDate: Date,
    endDate: Date
  },
  ratings: {
    overall: Number,
    categories: [{
      name: String,
      rating: Number,
      comments: String
    }]
  },
  feedback: {
    strengths: [String],
    improvements: [String],
    goals: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed', 'acknowledged'],
    default: 'draft'
  },
  submittedAt: {
    type: Date
  },
  acknowledgedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PerformanceReview', PerformanceReviewSchema);
