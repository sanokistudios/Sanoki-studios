const express = require('express');
const router = express.Router();
const {
  getMessagesByConversation,
  getConversations,
  createOrUpdateConversation,
  createMessage,
  markConversationAsRead,
  deleteConversation
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/auth');

// Routes protégées (admin) - TOUJOURS EN PREMIER
router.get('/conversations/all', protect, admin, getConversations);
router.put('/conversations/:conversationId/read', protect, admin, markConversationAsRead);
router.delete('/conversations/:conversationId', protect, admin, deleteConversation);

// Routes publiques
router.post('/', createMessage);
router.post('/conversation', createOrUpdateConversation);
router.get('/:conversationId', getMessagesByConversation);

module.exports = router;

