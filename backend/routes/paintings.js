const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getPaintings,
  getPaintingById,
  createPainting,
  updatePainting,
  deletePainting
} = require('../controllers/paintingController');

// Routes publiques
router.get('/', getPaintings);
router.get('/:id', getPaintingById);

// Routes admin
router.post('/', protect, admin, createPainting);
router.put('/:id', protect, admin, updatePainting);
router.delete('/:id', protect, admin, deletePainting);

module.exports = router;

