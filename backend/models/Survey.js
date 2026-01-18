const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pulse', 'engagement', 'exit', 'custom'],
    default: 'pulse'
  },
  questions: [{
    question: String,
    type: {
      type: String,
      enum: ['text', 'rating', 'multiple_choice', 'yes_no']
    },
    options: [String]
  }],
  targetAudience: {
    type: String,
    enum: ['all', 'department', 'role', 'custom'],
    default: 'all'
  },
  targetIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'draft'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
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

const SurveyResponseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [{
    questionId: Number,
    answer: mongoose.Schema.Types.Mixed
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports.Survey = mongoose.model('Survey', SurveySchema);
module.exports.SurveyResponse = mongoose.model('SurveyResponse', SurveyResponseSchema);
