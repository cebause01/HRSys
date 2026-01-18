const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  roomId: {
    type: String
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['direct', 'group', 'announcement'],
    default: 'direct'
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);
