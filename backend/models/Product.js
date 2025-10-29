const mongoose = require('mongoose');

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

// Mise à jour automatique du champ updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
