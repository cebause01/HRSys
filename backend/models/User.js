const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'hr_manager', 'manager', 'employee'],
    default: 'employee'
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  department: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on_leave'],
    default: 'active'
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    trim: true
  },
  hireDate: {
    type: Date
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  leaveBalance: {
    pto: { type: Number, default: 0 },
    sick: { type: Number, default: 0 },
    personal: { type: Number, default: 0 }
  },
  compensation: {
    baseSalary: Number,
    currency: { type: String, default: 'USD' },
    payFrequency: { type: String, enum: ['monthly', 'biweekly', 'weekly'], default: 'monthly' }
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  skills: [String],
  competencies: [{
    competencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Competency' },
    level: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password with hashed password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = mongoose.model('User', UserSchema);
