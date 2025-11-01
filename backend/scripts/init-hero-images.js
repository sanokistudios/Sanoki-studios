const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HeroImage = require('../models/HeroImage');
const connectDB = require('../config/database');

dotenv.config();

const initHeroImages = async () => {
  try {
    await connectDB();
    
    // Vérifier s'il y a déjà des images
    const existingImages = await HeroImage.find();
    if (existingImages.length > 0) {
      console.log('✅ Des images hero existent déjà. Rien à initialiser.');
      process.exit(0);
    }

    // Créer la première image avec l'image par défaut
    await HeroImage.create({
      imageUrl: '/images/hero-1.jpg',
      order: 0
    });

    console.log('✅ Image hero initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

initHeroImages();

