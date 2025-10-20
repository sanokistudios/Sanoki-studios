const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Routes publiques
router.post('/login', login);
router.post('/register', register);

// Routes protégées
router.get('/me', protect, getMe);

module.exports = router;

