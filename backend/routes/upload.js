const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/auth');

// @desc    Upload une image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, (req, res, next) => {
  // Middleware pour logger la taille du fichier avant upload
  req.on('data', (chunk) => {
    if (!req.contentLength) req.contentLength = 0;
    req.contentLength += chunk.length;
  });
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Erreur Multer:', err.message);
      console.error('Type:', err.name);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ 
          message: 'Fichier trop volumineux (max 100 MB)',
          code: 'LIMIT_FILE_SIZE'
        });
      }
      return res.status(500).json({ 
        message: 'Erreur lors de l\'upload',
        error: err.message
      });
    }
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    console.log('✅ Upload réussi:', req.file.path);
    console.log('📊 Taille fichier:', req.file.size, 'bytes');
    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Erreur lors de l\'upload de l\'image',
      error: error.message
    });
  }
});

// @desc    Upload plusieurs images
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    const urls = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    res.json({
      success: true,
      images: urls
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload des images' });
  }
});

module.exports = router;

