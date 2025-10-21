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

// Routes publiques
router.get('/:conversationId', getMessagesByConversation);
router.post('/', createMessage);
router.post('/conversation', createOrUpdateConversation);

// Routes protégées (admin)
router.get('/admin/conversations', protect, admin, getConversations);
router.put('/:conversationId/read', protect, admin, markConversationAsRead);
router.delete('/conversation/:conversationId', protect, admin, deleteConversation);

module.exports = router;

