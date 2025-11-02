require('dotenv').config();
const mongoose = require('mongoose');

// Import des modèles
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const HeroImage = require('../models/HeroImage');
const Painting = require('../models/Painting');
// Note: User, Order, Contact, etc. ne sont pas migrés pour des raisons de sécurité/conformité

// ==========================================
// CONFIGURATION - MODIFIEZ ICI
// ==========================================

// URI de votre base de données SOURCE (votre base actuelle)
const SOURCE_MONGODB_URI = process.env.SOURCE_MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// URI de la base de données DESTINATION (client - MongoDB Atlas)
const DEST_MONGODB_URI = process.env.DEST_MONGODB_URI || process.env.MONGODB_URI;

// ==========================================
// FONCTIONS DE MIGRATION
// ==========================================

async function migrateCollection(SourceModel, DestModel, collectionName) {
  try {
    console.log(`\n🔄 Migration de ${collectionName}...`);
    
    // Se connecter à la source
    const sourceConn = await mongoose.createConnection(SOURCE_MONGODB_URI);
    const SourceModelConnected = sourceConn.model(SourceModel.modelName, SourceModel.schema);
    
    // Se connecter à la destination
    const destConn = await mongoose.createConnection(DEST_MONGODB_URI);
    const DestModelConnected = destConn.model(DestModel.modelName, DestModel.schema);
    
    // Récupérer tous les documents de la source
    const documents = await SourceModelConnected.find({}).lean();
    console.log(`   📦 ${documents.length} ${collectionName} trouvés`);
    
    if (documents.length === 0) {
      console.log(`   ⏭️  Aucun ${collectionName} à migrer`);
      await sourceConn.close();
      await destConn.close();
      return;
    }
    
    // Insérer dans la destination (avec upsert pour éviter les doublons)
    let inserted = 0;
    let skipped = 0;
    
    for (const doc of documents) {
      // Supprimer l'_id pour permettre à MongoDB d'en créer un nouveau
      // ou garder l'_id original pour éviter les doublons
      const { _id, ...docWithoutId } = doc;
      
      try {
        // Vérifier si le document existe déjà
        const existing = await DestModelConnected.findById(_id);
        if (!existing) {
          // Insérer avec l'ID original pour garder la cohérence
          await DestModelConnected.create({ ...docWithoutId, _id });
          inserted++;
        } else {
          skipped++;
        }
      } catch (error) {
        // Si l'ID existe déjà ou autre erreur, essayer sans ID
        try {
          await DestModelConnected.create(docWithoutId);
          inserted++;
        } catch (err) {
          console.log(`   ⚠️  Erreur lors de l'insertion: ${err.message}`);
          skipped++;
        }
      }
    }
    
    console.log(`   ✅ ${inserted} ${collectionName} insérés, ${skipped} ignorés`);
    
    await sourceConn.close();
    await destConn.close();
  } catch (error) {
    console.error(`   ❌ Erreur lors de la migration de ${collectionName}:`, error.message);
  }
}

async function migrateAll() {
  try {
    console.log('🚀 Démarrage de la migration de base de données...\n');
    console.log(`📍 Source: ${SOURCE_MONGODB_URI}`);
    console.log(`📍 Destination: ${DEST_MONGODB_URI}\n`);
    
    // Vérifier les connexions
    console.log('🔌 Test de connexion à la source...');
    const sourceTest = await mongoose.createConnection(SOURCE_MONGODB_URI);
    await sourceTest.close();
    console.log('✅ Connexion source OK');
    
    console.log('🔌 Test de connexion à la destination...');
    const destTest = await mongoose.createConnection(DEST_MONGODB_URI);
    await destTest.close();
    console.log('✅ Connexion destination OK\n');
    
    // Migrer chaque collection
    await migrateCollection(Product, Product, 'Produits');
    await migrateCollection(Collection, Collection, 'Collections');
    await migrateCollection(HeroImage, HeroImage, 'Hero Images');
    await migrateCollection(Painting, Painting, 'Paintings');
    
    // Note: User, Order, Contact ne sont PAS migrés pour des raisons de sécurité
    // (Les utilisateurs doivent se recréer sur le nouveau site)
    
    console.log('\n✅ Migration terminée !\n');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

// Lancer la migration
if (require.main === module) {
  migrateAll().catch(console.error);
}

module.exports = { migrateAll };

