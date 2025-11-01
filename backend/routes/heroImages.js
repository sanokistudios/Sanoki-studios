const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getHeroImages,
  createHeroImage,
  updateHeroImage,
  deleteHeroImage,
  updateOrder
} = require('../controllers/heroImageController');

// Route publique - obtenir toutes les images hero
router.get('/', getHeroImages);

// Routes admin
router.post('/', protect, admin, createHeroImage);
router.put('/order', protect, admin, updateOrder);
router.put('/:id', protect, admin, updateHeroImage);
router.delete('/:id', protect, admin, deleteHeroImage);

module.exports = router;

