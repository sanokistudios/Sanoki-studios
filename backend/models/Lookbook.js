const mongoose = require('mongoose');

const lookbookSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour trier par ordre
lookbookSchema.index({ order: 1 });

module.exports = mongoose.model('Lookbook', lookbookSchema);

