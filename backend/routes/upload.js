const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/auth');

// @desc    Upload une image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, (req, res, next) => {
  console.log('📤 Upload demandé - Content-Type:', req.headers['content-type']);
  console.log('📤 Content-Length:', req.headers['content-length']);
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Erreur Multer:', err.message);
      console.error('Type:', err.name);
      console.error('Code:', err.code);
      console.error('Stack:', err.stack);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ 
          message: 'Fichier trop volumineux (max 100 MB)',
          code: 'LIMIT_FILE_SIZE'
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
          message: 'Nom de champ incorrect. Utilisez "image"',
          code: 'LIMIT_UNEXPECTED_FILE'
        });
      }
      return res.status(500).json({ 
        message: 'Erreur lors de l\'upload',
        error: err.message,
        code: err.code || 'UNKNOWN'
      });
    }
    
    if (req.file) {
      console.log('✅ Fichier reçu:', req.file.originalname);
      console.log('📊 Taille:', req.file.size, 'bytes (', (req.file.size / 1024 / 1024).toFixed(2), 'MB)');
      console.log('📦 Type:', req.file.mimetype);
    }
    
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      console.error('❌ Aucun fichier reçu');
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    console.log('📤 Upload vers Cloudinary en cours...');
    
    // Upload vers Cloudinary depuis le buffer
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'ecommerce-vetements'
    });

    console.log('✅ Upload Cloudinary réussi:', result.secure_url);
    console.log('🔗 URL:', result.secure_url);
    console.log('🆔 Public ID:', result.public_id);
    
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error.message);
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
router.post('/multiple', protect, admin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    console.log('📤 Upload de', req.files.length, 'images vers Cloudinary...');

    // Upload chaque fichier vers Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, {
        folder: 'ecommerce-vetements'
      })
    );

    const results = await Promise.all(uploadPromises);

    const urls = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id
    }));

    console.log('✅', results.length, 'images uploadées avec succès');

    res.json({
      success: true,
      images: urls
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload des images' });
  }
});

module.exports = router;

