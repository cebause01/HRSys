const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Benefit, BenefitEnrollment } = require('../models/Benefit');

router.get('/', protect, async (req, res) => {
  try {
    const benefits = await Benefit.find({ status: 'active' });
    res.json({ success: true, data: benefits });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/enrollments', protect, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'employee') {
      query.employeeId = req.user.id;
    }
    const enrollments = await BenefitEnrollment.find(query)
      .populate('benefitId')
      .populate('employeeId', 'name email');
    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/enroll', protect, async (req, res) => {
  try {
    const enrollment = await BenefitEnrollment.create({
      ...req.body,
      employeeId: req.user.id
    });
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
