const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Document = require('../models/Document');

router.get('/', protect, async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'employee') {
      query.employeeId = req.user.id;
    } else if (req.query.employeeId) {
      query.employeeId = req.query.employeeId;
    }

    const documents = await Document.find(query)
      .populate('employeeId', 'name email')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const document = await Document.create({
      ...req.body,
      uploadedBy: req.user.id
    });
    res.status(201).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/sign', protect, async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      {
        status: 'signed',
        signedBy: req.user.id,
        signedAt: new Date()
      },
      { new: true }
    );
    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
