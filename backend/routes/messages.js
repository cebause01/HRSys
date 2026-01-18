const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, getConversations, markAsRead } = require('../controllers/messages');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/:roomId', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/:messageId/read', protect, markAsRead);

module.exports = router;
