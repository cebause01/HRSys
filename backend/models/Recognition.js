const mongoose = require('mongoose');

const RecognitionSchema = new mongoose.Schema({
  fromEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['teamwork', 'innovation', 'leadership', 'customer_service', 'other']
  },
  points: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recognition', RecognitionSchema);
