const express = require('express');
const router = express.Router();
const { getPayrolls, getPayroll, createPayroll, updatePayroll, deletePayroll, getPayrollStats } = require('../controllers/payroll');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getPayrolls);
router.get('/stats', protect, getPayrollStats);
router.get('/:id', protect, getPayroll);
router.post('/', protect, authorize('admin', 'hr_manager', 'super_admin'), createPayroll);
router.put('/:id', protect, authorize('admin', 'hr_manager', 'super_admin'), updatePayroll);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deletePayroll);

module.exports = router;
