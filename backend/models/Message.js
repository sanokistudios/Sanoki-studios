const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: String,
    required: true,
    enum: ['client', 'admin']
  },
  clientName: {
    type: String,
    required: function() {
      return this.sender === 'client';
    }
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index pour optimiser les requêtes
messageSchema.index({ conversationId: 1, timestamp: 1 });

module.exports = mongoose.model('Message', messageSchema);

