const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getLookbookImages,
  createLookbookImage,
  updateLookbookImage,
  deleteLookbookImage,
  updateOrder
} = require('../controllers/lookbookController');

// Route publique - obtenir toutes les images lookbook
router.get('/', getLookbookImages);

// Routes admin
router.post('/', protect, admin, createLookbookImage);
router.put('/order', protect, admin, updateOrder);
router.put('/:id', protect, admin, updateLookbookImage);
router.delete('/:id', protect, admin, deleteLookbookImage);

module.exports = router;

