const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,
    enum: ['compliance', 'technical', 'leadership', 'soft_skills', 'certification'],
    required: true
  },
  duration: {
    type: Number, // in hours
    default: 0
  },
  contentUrl: {
    type: String
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  isCertified: {
    type: Boolean,
    default: false
  },
  validFor: {
    type: Number, // months
    default: 0
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

const CourseEnrollmentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'expired'],
    default: 'not_started'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  certificateUrl: {
    type: String
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

module.exports.Course = mongoose.model('Course', CourseSchema);
module.exports.CourseEnrollment = mongoose.model('CourseEnrollment', CourseEnrollmentSchema);
