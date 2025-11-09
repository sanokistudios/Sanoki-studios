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
    console.log('📦 Resource Type:', result.resource_type);
    console.log('🔐 Access Mode:', result.access_mode);
    console.log('📋 Type:', result.type);
    
    // Pour les PDFs, s'assurer que l'URL utilise le bon format
    let finalUrl = result.secure_url;
    
    // Si c'est un PDF et que l'URL contient 'authenticated', la convertir en URL publique
    if (result.resource_type === 'raw' || result.format === 'pdf') {
      console.log('📄 PDF détecté - Vérification de l\'URL...');
      if (finalUrl.includes('/authenticated/')) {
        // Remplacer 'authenticated' par 'upload' dans l'URL
        finalUrl = finalUrl.replace('/authenticated/', '/upload/');
        console.log('🔄 URL convertie en mode public:', finalUrl);
      }
    }
    
    res.json({
      success: true,
      url: finalUrl,
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
router.post('/multiple', protect, admin, (req, res, next) => {
  console.log('📤 Upload multiple demandé - Content-Type:', req.headers['content-type']);
  console.log('📤 Content-Length:', req.headers['content-length']);
  
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error('❌ Erreur Multer (multiple):', err.message);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ 
          message: 'Un ou plusieurs fichiers sont trop volumineux (max 10 MB par fichier)',
          code: 'LIMIT_FILE_SIZE'
        });
      }
      return res.status(500).json({ 
        message: 'Erreur lors de l\'upload',
        error: err.message,
        code: err.code || 'UNKNOWN'
      });
    }
    
    // Vérifier la taille totale (limite à 30 MB pour 5 fichiers max)
    if (req.files && req.files.length > 0) {
      const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
      const totalSizeMB = totalSize / 1024 / 1024;
      
      console.log('📊 Nombre de fichiers:', req.files.length);
      console.log('📊 Taille totale:', totalSizeMB.toFixed(2), 'MB');
      
      // Limite totale: 30 MB (pour éviter les timeouts et problèmes de mémoire)
      if (totalSize > 30 * 1024 * 1024) {
        return res.status(413).json({ 
          message: `Taille totale trop importante (${totalSizeMB.toFixed(2)} MB). Maximum: 30 MB pour tous les fichiers combinés.`,
          code: 'LIMIT_TOTAL_SIZE'
        });
      }
      
      req.files.forEach((file, idx) => {
        console.log(`  ${idx + 1}. ${file.originalname} - ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      });
    }
    
    next();
  });
}, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    console.log('📤 Upload de', req.files.length, 'fichiers vers Cloudinary...');

    // Upload chaque fichier vers Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, {
        folder: 'ecommerce-vetements'
      })
    );

    const results = await Promise.all(uploadPromises);

    const urls = results.map(result => {
      let finalUrl = result.secure_url;
      
      // Si c'est un PDF et que l'URL contient 'authenticated', la convertir en URL publique
      if ((result.resource_type === 'raw' || result.format === 'pdf') && finalUrl.includes('/authenticated/')) {
        finalUrl = finalUrl.replace('/authenticated/', '/upload/');
        console.log('🔄 URL PDF convertie en mode public:', finalUrl);
      }
      
      return {
        url: finalUrl,
        publicId: result.public_id
      };
    });

    console.log('✅', results.length, 'fichiers uploadés avec succès');

    res.json({
      success: true,
      images: urls
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload des fichiers' });
  }
});

module.exports = router;

