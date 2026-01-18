const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Candidate = require('../models/Candidate');

router.get('/', protect, async (req, res) => {
  try {
    const candidates = await Candidate.find(req.query)
      .populate('jobId', 'title department')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const candidate = await Candidate.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/stage', protect, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { stage: req.body.stage },
      { new: true }
    );
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    candidate.feedback.push({
      interviewerId: req.user.id,
      rating: req.body.rating,
      comments: req.body.comments,
      submittedAt: new Date()
    });
    await candidate.save();
    res.json({ success: true, data: candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
