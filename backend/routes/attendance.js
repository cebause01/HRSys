const express = require('express');
const router = express.Router();
const { getAttendances, getAttendance, createAttendance, updateAttendance, checkIn, checkOut, getAttendanceStats } = require('../controllers/attendance');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAttendances);
router.get('/stats', protect, getAttendanceStats);
router.get('/:id', protect, getAttendance);
router.post('/', protect, createAttendance);
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.put('/:id', protect, updateAttendance);

module.exports = router;
