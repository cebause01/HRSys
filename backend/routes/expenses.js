const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Expense = require('../models/Expense');

router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'employee') {
      query.employeeId = req.user.id;
    }
    const expenses = await Expense.find(query)
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      employeeId: req.user.id
    });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/approve', protect, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: new Date()
      },
      { new: true }
    );
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
