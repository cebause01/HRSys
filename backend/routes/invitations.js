const express = require('express');
const router = express.Router();
const { createInvitation, acceptInvitation, getInvitationByToken } = require('../controllers/invitations');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'hr_manager', 'super_admin'), createInvitation);
router.get('/:token', getInvitationByToken);
router.post('/accept/:token', acceptInvitation);

module.exports = router;
