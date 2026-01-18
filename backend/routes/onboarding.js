const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Onboarding = require('../models/Onboarding');

router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'employee') {
      query.employeeId = req.user.id;
    }
    const onboardings = await Onboarding.find(query).populate('employeeId', 'name email');
    res.json({ success: true, data: onboardings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'hr_manager', 'super_admin'), async (req, res) => {
  try {
    const onboarding = await Onboarding.create(req.body);
    res.status(201).json({ success: true, data: onboarding });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/task/:taskId', protect, async (req, res) => {
  try {
    const onboarding = await Onboarding.findById(req.params.id);
    const task = onboarding.tasks.id(req.params.taskId);
    task.status = req.body.status;
    task.completedAt = req.body.status === 'completed' ? new Date() : null;
    await onboarding.save();
    res.json({ success: true, data: onboarding });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
