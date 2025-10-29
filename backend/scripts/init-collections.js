const mongoose = require('mongoose');
const Collection = require('../models/Collection');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const collections = [
  { name: 'firebloom', description: 'Collection Firebloom' },
  { name: 'souvenirs d\'été Chic Chic', description: 'Collection Souvenirs d\'été Chic Chic' },
  { name: 'tunis', description: 'Collection Tunis' },
  { name: 'origami', description: 'Collection Origami' }
];

async function initCollections() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connexion à MongoDB réussie');

    for (const collectionData of collections) {
      const existingCollection = await Collection.findOne({ name: collectionData.name });
      if (!existingCollection) {
        const collection = await Collection.create(collectionData);
        console.log(`Collection créée: ${collection.name}`);
      } else {
        console.log(`Collection existe déjà: ${collectionData.name}`);
      }
    }

    console.log('Initialisation des collections terminée');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initCollections();

