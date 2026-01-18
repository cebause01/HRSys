const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['okr', 'kpi', 'personal', 'team'],
    default: 'personal'
  },
  targetValue: Number,
  currentValue: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: '%'
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'cancelled'],
    default: 'not_started'
  },
  parentGoalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Goal', GoalSchema);
