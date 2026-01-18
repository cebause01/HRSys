const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const PerformanceReview = require('../models/PerformanceReview');
const Goal = require('../models/Goal');

router.get('/reviews', protect, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'employee') {
      query.employeeId = req.user.id;
    } else if (req.user.role === 'manager') {
      query.reviewerId = req.user.id;
    }
    const reviews = await PerformanceReview.find(query)
      .populate('employeeId', 'name email')
      .populate('reviewerId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reviews', protect, async (req, res) => {
  try {
    const review = await PerformanceReview.create({
      ...req.body,
      reviewerId: req.user.id
    });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/goals', protect, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'employee') {
      query.employeeId = req.user.id;
    }
    const goals = await Goal.find(query)
      .populate('employeeId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/goals', protect, async (req, res) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      employeeId: req.body.employeeId || req.user.id
    });
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
