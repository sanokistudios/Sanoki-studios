const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

// Configuration Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Variables Cloudinary manquantes !');
  console.error('Vérifiez CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('✅ Cloudinary configuré:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✓' : '✗',
  api_key: process.env.CLOUDINARY_API_KEY ? '✓' : '✗',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✓' : '✗'
});

// Définir la limite à 100 MB
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 104857600 bytes
console.log('✅ Limite de taille fichier configurée: 100 MB (104857600 bytes)');

// Utiliser memoryStorage au lieu de CloudinaryStorage pour contourner la limite de 10 MB
// Les fichiers seront stockés en mémoire puis uploadés directement vers Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // Limite de 100MB (104857600 bytes)
    files: 1,
    fieldSize: MAX_FILE_SIZE,
    fieldNameSize: 255,
    fields: 10
  },
  fileFilter: (req, file, cb) => {
    console.log('📋 Fichier à uploader:', file.originalname, 'Type:', file.mimetype);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Formats acceptés: JPG, PNG, WEBP'));
    }
  }
});

// Fonction utilitaire pour uploader vers Cloudinary depuis un buffer
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'ecommerce-vetements',
        resource_type: 'image',
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };

