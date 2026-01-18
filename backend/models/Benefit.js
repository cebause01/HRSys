const mongoose = require('mongoose');

const BenefitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['health', 'dental', 'vision', 'life', 'disability', 'retirement', 'other'],
    required: true
  },
  description: {
    type: String
  },
  cost: {
    employee: Number,
    company: Number
  },
  enrollmentPeriod: {
    startDate: Date,
    endDate: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

const BenefitEnrollmentSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  benefitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Benefit',
    required: true
  },
  status: {
    type: String,
    enum: ['enrolled', 'waived', 'pending'],
    default: 'pending'
  },
  effectiveDate: {
    type: Date
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  }
});

module.exports.Benefit = mongoose.model('Benefit', BenefitSchema);
module.exports.BenefitEnrollment = mongoose.model('BenefitEnrollment', BenefitEnrollmentSchema);
