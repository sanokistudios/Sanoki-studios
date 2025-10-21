const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Middleware optionnel pour associer userId si token présent
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
    } catch (error) {
      // Token invalide, continuer sans user
    }
  }
  next();
};

// Routes publiques (avec auth optionnel)
router.post('/', optionalAuth, createOrder);

// Routes protégées (utilisateur)
router.get('/me', protect, getMyOrders);

// Routes ID spécifiques (après /me pour éviter conflit)
router.get('/:id', getOrderById);

// Routes protégées (admin)
router.get('/', protect, admin, getOrders);
router.put('/:id', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;

