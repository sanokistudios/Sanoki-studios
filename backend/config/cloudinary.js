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

// Définir la limite à 10 MB (limitation plan gratuit Cloudinary)
// Pour augmenter : upgrader le compte Cloudinary vers un plan payant
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10485760 bytes
console.log('✅ Limite de taille fichier configurée: 10 MB (limitation plan gratuit Cloudinary)');

// Utiliser memoryStorage au lieu de CloudinaryStorage pour contourner la limite de 10 MB
// Les fichiers seront stockés en mémoire puis uploadés directement vers Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // Limite de 10MB (plan gratuit Cloudinary)
    files: 1,
    fieldSize: MAX_FILE_SIZE,
    fieldNameSize: 255,
    fields: 10
  },
  fileFilter: (req, file, cb) => {
    console.log('📋 Fichier à uploader:', file.originalname, 'Type:', file.mimetype);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Formats acceptés: JPG, PNG, WEBP, PDF'));
    }
  }
});

// Fonction utilitaire pour uploader vers Cloudinary depuis un buffer
// Utilise upload_large pour les fichiers > 20 MB (chunked upload)
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const sizeInMB = buffer.length / (1024 * 1024);
    console.log(`📊 Taille fichier: ${sizeInMB.toFixed(2)} MB`);
    
    // Détecter le type de ressource (auto pour supporter images et PDFs)
    const defaultResourceType = options.resource_type || 'auto';
    
    // Pour les fichiers > 20 MB, utiliser chunked upload
    if (buffer.length > 20 * 1024 * 1024) {
      console.log('📦 Utilisation de upload_large (chunked) pour fichier volumineux');
      
      const uploadStream = cloudinary.uploader.upload_large_stream(
        {
          folder: options.folder || 'ecommerce-vetements',
          resource_type: defaultResourceType,
          chunk_size: 6000000, // 6 MB par chunk
          ...options
        },
        (error, result) => {
          if (error) {
            console.error('❌ Erreur upload_large:', error);
            reject(error);
          } else {
            console.log('✅ Upload chunked réussi');
            resolve(result);
          }
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    } else {
      // Upload normal pour les fichiers < 20 MB
      console.log('📦 Utilisation de upload_stream standard');
      
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'ecommerce-vetements',
          resource_type: defaultResourceType,
          ...options
        },
        (error, result) => {
          if (error) {
            console.error('❌ Erreur upload_stream:', error);
            console.error('Message:', error.message);
            console.error('Code HTTP:', error.http_code);
            reject(error);
          } else {
            console.log('✅ Upload standard réussi');
            resolve(result);
          }
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    }
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };

