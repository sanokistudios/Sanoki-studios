const mongoose = require('mongoose');
const Collection = require('../models/Collection');
const User = require('../models/User');

const collections = [
  { name: 'firebloom', description: 'Collection Firebloom' },
  { name: 'souvenirs d\'été Chic Chic', description: 'Collection Souvenirs d\'été Chic Chic' },
  { name: 'tunis', description: 'Collection Tunis' },
  { name: 'origami', description: 'Collection Origami' }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    
    // Initialiser les collections automatiquement
    await initCollections();
    
    // Créer l'admin automatiquement s'il n'existe pas
    await initAdmin();
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const initCollections = async () => {
  try {
    console.log('🔄 Initialisation des collections...');
    let createdCount = 0;
    for (const collectionData of collections) {
      const existingCollection = await Collection.findOne({ name: collectionData.name });
      if (!existingCollection) {
        try {
          // Utiliser new Collection().save() pour que le hook pre('save') génère le slug
          const collection = new Collection(collectionData);
          await collection.save();
          console.log(`✅ Collection créée: ${collection.name} (slug: ${collection.slug})`);
          createdCount++;
        } catch (saveError) {
          console.error(`❌ Erreur lors de la création de la collection "${collectionData.name}":`, saveError.message);
        }
      } else {
        console.log(`ℹ️ Collection existe déjà: ${existingCollection.name}`);
      }
    }
    const totalCollections = await Collection.countDocuments();
    console.log(`📦 Total collections dans la base: ${totalCollections} (${createdCount} créées à ce démarrage)`);
  } catch (error) {
    console.error('⚠️ Erreur lors de l\'initialisation des collections:', error.message);
    console.error('Stack:', error.stack);
    // Ne pas bloquer le démarrage du serveur si l'initialisation échoue
  }
};

const initAdmin = async () => {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL || 'admin@sanokistudios.com',
      role: 'admin'
    });
    
    if (existingAdmin) {
      console.log(`ℹ️  Admin existe déjà: ${existingAdmin.email}`);
      return;
    }

    // Créer l'admin si les variables sont définies
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const admin = await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });

      console.log(`✅ Admin créé automatiquement: ${admin.email}`);
    } else {
      console.log(`⚠️  ADMIN_EMAIL ou ADMIN_PASSWORD non définis - admin non créé`);
    }
  } catch (error) {
    console.error('⚠️ Erreur lors de la création de l\'admin:', error.message);
    // Ne pas bloquer le démarrage si la création de l'admin échoue
  }
};

module.exports = connectDB;

