const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Charger les variables d'environnement
dotenv.config();

const sampleProducts = [
  {
    name: 'T-shirt Classic Noir',
    description: 'T-shirt en coton premium, coupe classique et confortable. Parfait pour un look décontracté et élégant.',
    price: 45,
    category: 't-shirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Noir'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    stock: 50,
    featured: true
  },
  {
    name: 'T-shirt Classic Blanc',
    description: 'T-shirt blanc essentiel, fabriqué en coton de qualité supérieure. Un incontournable de votre garde-robe.',
    price: 45,
    category: 't-shirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc'],
    images: ['https://images.unsplash.com/photo-1622445275576-721325763afe?w=800'],
    stock: 50,
    featured: true
  },
  {
    name: 'T-shirt Graphique Urban',
    description: 'Design moderne et urbain, impression de haute qualité. Pour ceux qui aiment se démarquer.',
    price: 55,
    category: 't-shirt',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Gris'],
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'],
    stock: 30,
    featured: true
  },
  {
    name: 'T-shirt Oversize',
    description: 'Coupe oversize tendance, confort maximal. Style streetwear contemporain.',
    price: 50,
    category: 't-shirt',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Beige', 'Noir', 'Gris'],
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
    stock: 40,
    featured: true
  },
  {
    name: 'Sweat à Capuche Premium',
    description: 'Sweat confortable en molleton épais, parfait pour les journées fraîches.',
    price: 89,
    category: 'sweat',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Gris', 'Bleu marine'],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
    stock: 25,
    featured: false
  },
  {
    name: 'T-shirt Col Rond Essentiel',
    description: 'Le t-shirt basique par excellence, disponible dans plusieurs couleurs.',
    price: 39,
    category: 't-shirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Noir', 'Blanc', 'Gris', 'Bleu marine'],
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800'],
    stock: 100,
    featured: false
  },
  {
    name: 'T-shirt Rayé Marin',
    description: 'Style intemporel avec rayures horizontales, inspiration nautique.',
    price: 52,
    category: 't-shirt',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanc/Bleu'],
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'],
    stock: 35,
    featured: false
  },
  {
    name: 'T-shirt Vintage Logo',
    description: 'Design rétro avec logo vintage, effet vieilli authentique.',
    price: 58,
    category: 't-shirt',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Bordeaux', 'Vert kaki'],
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800'],
    stock: 20,
    featured: false
  }
];

const seedProducts = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');

    // Supprimer les produits existants
    await Product.deleteMany({});
    console.log('🗑️  Produits existants supprimés');

    // Insérer les nouveaux produits
    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} produits ajoutés avec succès !`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des produits:', error);
    process.exit(1);
  }
};

seedProducts();

