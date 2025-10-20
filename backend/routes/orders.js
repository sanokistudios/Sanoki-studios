const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Routes publiques
router.post('/', createOrder);
router.get('/:id', getOrderById);

// Routes protégées (admin)
router.get('/', protect, admin, getOrders);
router.put('/:id', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;

