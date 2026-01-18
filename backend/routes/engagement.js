const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Survey, SurveyResponse } = require('../models/Survey');
const Recognition = require('../models/Recognition');
const Announcement = require('../models/Announcement');

router.get('/surveys', protect, async (req, res) => {
  try {
    const surveys = await Survey.find({ status: 'active' }).populate('createdBy', 'name');
    res.json({ success: true, data: surveys });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/surveys/:id/respond', protect, async (req, res) => {
  try {
    const response = await SurveyResponse.create({
      surveyId: req.params.id,
      employeeId: req.user.id,
      responses: req.body.responses
    });
    res.status(201).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recognition', protect, async (req, res) => {
  try {
    const recognition = await Recognition.find()
      .populate('fromEmployeeId', 'name email')
      .populate('toEmployeeId', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: recognition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/recognition', protect, async (req, res) => {
  try {
    const recognition = await Recognition.create({
      ...req.body,
      fromEmployeeId: req.user.id
    });
    res.status(201).json({ success: true, data: recognition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/announcements', protect, async (req, res) => {
  try {
    const announcements = await Announcement.find({
      $or: [
        { targetAudience: 'all' },
        { targetIds: req.user.id }
      ]
    })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/announcements', protect, authorize('admin', 'hr_manager', 'super_admin'), async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
