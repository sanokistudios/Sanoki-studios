const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Charger les variables d'environnement
dotenv.config();

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Un compte admin existe déjà avec cet email');
      process.exit(0);
    }

    // Créer l'admin
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });

    console.log('✅ Compte administrateur créé avec succès !');
    console.log('\n📧 Email:', admin.email);
    console.log('🔑 Mot de passe:', process.env.ADMIN_PASSWORD || 'admin123');
    console.log('\n⚠️  N\'oubliez pas de changer ces identifiants en production !');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
};

createAdmin();

