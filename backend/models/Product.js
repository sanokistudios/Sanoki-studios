const mongoose = require('mongoose');
const productDefaults = require('../config/productDefaults');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['t-shirt', 'sweat', 'accessoire', 'autre'],
    default: 't-shirt'
  },
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: false
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }],
  colors: [{
    type: String
  }],
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: false,
    min: 0,
    default: null
  },
  // Stock par taille
  stockBySize: {
    type: Map,
    of: Number,
    default: {}
  },
  // Informations supplémentaires
  composition: {
    type: String,
    default: ''
  },
  sizeGuide: {
    referenceModel: {
      name: String,
      height: String,
      weight: String,
      size: String
    },
    sizeRange: {
      type: Map,
      of: String,
      default: {}
    }
  },
  washingInstructions: {
    handWash: String,
    machineWash: {
      temperature: String,
      cycle: String,
      spin: String
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Appliquer les valeurs par défaut pour composition, sizeGuide et washingInstructions
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Appliquer composition par défaut si vide
  if (!this.composition || this.composition.trim() === '') {
    this.composition = productDefaults.composition;
  }
  
  // Appliquer sizeGuide par défaut si vide
  if (!this.sizeGuide || !this.sizeGuide.referenceModel || !this.sizeGuide.referenceModel.name) {
    this.sizeGuide = {
      referenceModel: { ...productDefaults.sizeGuide.referenceModel },
      sizeRange: new Map(Object.entries(productDefaults.sizeGuide.sizeRange))
    };
  } else if (this.sizeGuide.sizeRange && typeof this.sizeGuide.sizeRange === 'object' && !(this.sizeGuide.sizeRange instanceof Map)) {
    // S'assurer que sizeRange est une Map
    this.sizeGuide.sizeRange = new Map(Object.entries(this.sizeGuide.sizeRange));
  }
  
  // Appliquer washingInstructions par défaut si vide
  if (!this.washingInstructions || !this.washingInstructions.handWash) {
    this.washingInstructions = {
      handWash: productDefaults.washingInstructions.handWash,
      machineWash: { ...productDefaults.washingInstructions.machineWash }
    };
  }
  
  next();
});

module.exports = mongoose.model('Product', productSchema);
