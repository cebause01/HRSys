const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject, assignEmployee, removeEmployee } = require('../controllers/projects');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getProjects);
router.get('/:id', protect, getProject);
router.post('/', protect, authorize('admin', 'hr_manager', 'manager', 'super_admin'), createProject);
router.put('/:id', protect, authorize('admin', 'hr_manager', 'manager', 'super_admin'), updateProject);
router.put('/:id/assign', protect, authorize('admin', 'hr_manager', 'manager', 'super_admin'), assignEmployee);
router.put('/:id/remove', protect, authorize('admin', 'hr_manager', 'manager', 'super_admin'), removeEmployee);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteProject);

module.exports = router;
