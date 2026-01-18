const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'employee') {
      query.employeeId = req.user.id;
    } else if (req.user.role === 'manager') {
      // Get requests from employees in manager's team
      const teamMembers = await User.find({ managerId: req.user.id });
      query.employeeId = { $in: teamMembers.map(u => u._id) };
    }
    
    const requests = await LeaveRequest.find(query)
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const request = await LeaveRequest.create({
      ...req.body,
      employeeId: req.user.id
    });
    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/approve', protect, async (req, res) => {
  try {
    const request = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    );
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
