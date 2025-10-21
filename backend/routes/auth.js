const express = require('express');
const router = express.Router();
const { 
  login, 
  register, 
  logout,
  getMe, 
  updateProfile,
  forgotPassword,
  resetPassword,
  createAdmin
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Route pour créer un admin (À SÉCURISER en production!)
router.post('/create-admin', createAdmin);

// Routes protégées
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

module.exports = router;
