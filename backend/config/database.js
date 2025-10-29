const mongoose = require('mongoose');
const Collection = require('../models/Collection');

const collections = [
  { name: 'firebloom', description: 'Collection Firebloom' },
  { name: 'souvenirs d\'été Chic Chic', description: 'Collection Souvenirs d\'été Chic Chic' },
  { name: 'tunis', description: 'Collection Tunis' },
  { name: 'origami', description: 'Collection Origami' }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    
    // Initialiser les collections automatiquement
    await initCollections();
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

module.exports = connectDB;

