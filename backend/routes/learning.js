const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Course, CourseEnrollment } = require('../models/Course');

router.get('/courses', protect, async (req, res) => {
  try {
    const courses = await Course.find().populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
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
    const enrollments = await CourseEnrollment.find(query)
      .populate('courseId')
      .populate('employeeId', 'name email');
    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/enroll', protect, async (req, res) => {
  try {
    const enrollment = await CourseEnrollment.create({
      ...req.body,
      employeeId: req.user.id
    });
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
