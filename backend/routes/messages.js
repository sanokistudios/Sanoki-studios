const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  getMessages,
  sendMessage,
  getAllConversations,
  markAsRead,
  resolveConversation,
  getMyConversation
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/auth');

// Routes utilisateur authentifié
router.get('/me', protect, getMyConversation);
router.post('/', protect, getOrCreateConversation);
router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, sendMessage);

// Routes admin
router.get('/all', protect, admin, getAllConversations);
router.put('/:id/read', protect, admin, markAsRead);
router.put('/:id/resolve', protect, admin, resolveConversation);

module.exports = router;
