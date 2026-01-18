const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  resumeUrl: {
    type: String
  },
  parsedData: {
    skills: [String],
    experience: Number,
    education: String,
    previousCompanies: [String]
  },
  stage: {
    type: String,
    enum: ['sourced', 'applied', 'screening', 'interview', 'offer', 'hired', 'rejected'],
    default: 'sourced'
  },
  score: {
    type: Number,
    default: 0
  },
  interviewScheduled: {
    type: Date
  },
  interviewerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  feedback: [{
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comments: String,
    submittedAt: Date
  }],
  offerLetter: {
    salary: Number,
    startDate: Date,
    status: {
      type: String,
      enum: ['pending', 'sent', 'accepted', 'rejected']
    }
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

module.exports = mongoose.model('Candidate', CandidateSchema);
