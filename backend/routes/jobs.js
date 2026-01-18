const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

router.get('/', protect, async (req, res) => {
  try {
    const jobs = await Job.find(req.query).populate('createdBy', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'hr_manager', 'super_admin'), async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/candidates', protect, async (req, res) => {
  try {
    const candidates = await Candidate.find({ jobId: req.params.id })
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: candidates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
