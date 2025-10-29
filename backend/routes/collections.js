const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController');

// Routes publiques
router.get('/', getCollections);
router.get('/:id', getCollectionById);

// Routes admin
router.post('/', protect, admin, createCollection);
router.put('/:id', protect, admin, updateCollection);
router.delete('/:id', protect, admin, deleteCollection);

module.exports = router;

