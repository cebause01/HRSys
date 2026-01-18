const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half_day', 'sick_leave', 'vacation', 'day_off'],
    required: true
  },
  hoursWorked: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
