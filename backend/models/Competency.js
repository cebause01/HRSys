const mongoose = require('mongoose');

const CompetencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'leadership', 'compliance'],
    required: true
  },
  description: {
    type: String
  }
});

const EmployeeCompetencySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  competencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competency',
    required: true
  },
  level: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports.Competency = mongoose.model('Competency', CompetencySchema);
module.exports.EmployeeCompetency = mongoose.model('EmployeeCompetency', EmployeeCompetencySchema);
