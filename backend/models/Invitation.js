const mongoose = require('mongoose');
const crypto = require('crypto');

const InvitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'hr_manager', 'manager', 'employee'],
    default: 'employee'
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

InvitationSchema.index({ token: 1 });
InvitationSchema.index({ email: 1, status: 1 });

module.exports = mongoose.model('Invitation', InvitationSchema);
