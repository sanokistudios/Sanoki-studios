const express = require('express');
const router = express.Router();
const {
  getMessages,
  createMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/auth');

// Routes publiques
router.get('/', getMessages);
router.post('/', createMessage);

// Routes protégées (admin)
router.put('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;

