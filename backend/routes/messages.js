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

// Routes admin (placer en premier pour éviter les conflits avec :id)
router.get('/conversations/all', protect, admin, getAllConversations);
router.get('/conversations/:id/messages', protect, getMessages);
router.post('/conversations/:id/messages', protect, sendMessage);
router.put('/conversations/:id/read', protect, admin, markAsRead);
router.put('/conversations/:id/resolve', protect, admin, resolveConversation);

// Routes utilisateur authentifié
router.get('/me', protect, getMyConversation);
router.post('/', protect, getOrCreateConversation);

module.exports = router;
