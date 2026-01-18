const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.getAttendances = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (employeeId) {
      query.employeeId = employeeId;
    } else if (req.user.role === 'employee' || req.user.role === 'manager') {
      query.employeeId = req.user.id;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (status) query.status = status;

    const attendances = await Attendance.find(query)
      .populate('employeeId', 'name email employeeId department')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: attendances,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('employeeId', 'name email employeeId department');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance record already exists for this employee and date' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('employeeId', 'name email employeeId department');

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let attendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: today
    });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    if (!attendance) {
      attendance = await Attendance.create({
        employeeId: req.user.id,
        date: today,
        checkIn: new Date(),
        status: 'present'
      });
    } else {
      attendance.checkIn = new Date();
      attendance.status = 'present';
      await attendance.save();
    }

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOut = new Date();
    
    if (attendance.checkIn) {
      const hoursWorked = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
      attendance.hoursWorked = Math.round(hoursWorked * 100) / 100;
    }
    
    await attendance.save();

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    
    const query = {};
    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendances = await Attendance.find(query);
    
    const totalDays = attendances.length;
    const presentDays = attendances.filter(a => a.status === 'present' || a.status === 'on_time').length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    const statusBreakdown = {
      present: attendances.filter(a => a.status === 'present' || a.status === 'on_time').length,
      absent: attendances.filter(a => a.status === 'absent').length,
      sick_leave: attendances.filter(a => a.status === 'sick_leave').length,
      vacation: attendances.filter(a => a.status === 'vacation').length,
      day_off: attendances.filter(a => a.status === 'day_off').length,
      late: attendances.filter(a => a.status === 'late').length
    };

    res.status(200).json({
      success: true,
      data: {
        totalDays,
        presentDays,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        statusBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
