const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  assignedEmployees: [{
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['lead', 'developer', 'designer', 'tester', 'manager'],
      default: 'developer'
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['planning', 'in_progress', 'on_hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  budget: {
    type: Number,
    default: 0
  },
  department: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

module.exports = mongoose.model('Project', ProjectSchema);
