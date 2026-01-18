const mongoose = require('mongoose');

const OnboardingSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  tasks: [{
    task: String,
    department: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    completedAt: Date,
    notes: String
  }],
  assets: [{
    type: {
      type: String,
      enum: ['laptop', 'phone', 'monitor', 'keyboard', 'mouse', 'other']
    },
    name: String,
    serialNumber: String,
    assignedAt: Date,
    returnedAt: Date
  }],
  startDate: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Onboarding', OnboardingSchema);
