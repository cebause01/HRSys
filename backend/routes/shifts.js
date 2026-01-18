const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Shift = require('../models/Shift');

router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    if (req.query.employeeId) query.employeeId = req.query.employeeId;
    if (req.query.date) {
      const date = new Date(req.query.date);
      query.date = { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) };
    }
    
    const shifts = await Shift.find(query)
      .populate('employeeId', 'name email')
      .sort({ date: -1 });
    
    res.json({ success: true, data: shifts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const shift = await Shift.create(req.body);
    res.status(201).json({ success: true, data: shift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
