const express = require('express');
const router = express.Router();
const { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getEmployeeStats } = require('../controllers/employees');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getEmployees);
router.get('/stats', protect, getEmployeeStats);
router.get('/:id', protect, getEmployee);
router.post('/', protect, authorize('admin', 'hr_manager', 'super_admin'), createEmployee);
router.put('/:id', protect, authorize('admin', 'hr_manager', 'super_admin'), updateEmployee);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteEmployee);

module.exports = router;
