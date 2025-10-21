const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// @desc    Créer ou récupérer une conversation
// @route   POST /api/conversations
// @access  Private (utilisateur connecté uniquement)
exports.getOrCreateConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Chercher une conversation existante
    let conversation = await Conversation.findOne({ userId });
    
    // Si elle n'existe pas, la créer
    if (!conversation) {
      conversation = await Conversation.create({ userId });
    }
    
    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('Erreur getOrCreateConversation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir les messages d'une conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Vérifier que la conversation appartient à l'utilisateur (ou que c'est un admin)
    const conversation = await Conversation.findById(id);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }
    
    if (conversation.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    // Récupérer les messages
    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .populate('userId', 'name email');
    
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Erreur getMessages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Envoyer un message
// @route   POST /api/conversations/:id/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Le message ne peut pas être vide' });
    }
    
    // Vérifier que la conversation existe
    const conversation = await Conversation.findById(id).populate('userId', 'name email');
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }
    
    // Vérifier les permissions
    const isAdmin = req.user.role === 'admin';
    const isOwner = conversation.userId._id.toString() === userId;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    // Créer le message
    const message = await Message.create({
      conversationId: id,
      userId,
      sender: isAdmin ? 'admin' : 'user',
      text: text.trim()
    });
    
    // Mettre à jour la conversation
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = Date.now();
    
    if (!isAdmin) {
      conversation.unreadCount += 1;
    }
    
    await conversation.save();
    
    // Populer l'utilisateur pour la réponse
    await message.populate('userId', 'name email');
    
    // Émettre via Socket.io pour mise à jour en temps réel
    const io = req.app.get('io');
    if (io) {
      // Envoyer au destinataire
      if (isAdmin) {
        // Admin répond → envoyer à l'utilisateur
        io.to(`user:${conversation.userId._id}`).emit('new-message', {
          message,
          conversation: {
            _id: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt
          }
        });
      } else {
        // Utilisateur envoie → notifier l'admin
        io.to('admin').emit('new-user-message', {
          message,
          conversation: {
            _id: conversation._id,
            userId: conversation.userId,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt,
            unreadCount: conversation.unreadCount
          }
        });
      }
    }
    
    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Erreur sendMessage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir toutes les conversations (Admin)
// @route   GET /api/conversations/all
// @access  Private (Admin)
exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('userId', 'name email phone')
      .sort({ lastMessageAt: -1 });
    
    res.json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('Erreur getAllConversations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Marquer les messages comme lus par l'admin
// @route   PUT /api/conversations/:id/read
// @access  Private (Admin)
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversation = await Conversation.findById(id);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }
    
    // Réinitialiser le compteur
    conversation.unreadCount = 0;
    await conversation.save();
    
    // Marquer tous les messages comme lus
    await Message.updateMany(
      { conversationId: id, sender: 'user' },
      { readByAdmin: true }
    );
    
    res.json({
      success: true,
      message: 'Messages marqués comme lus'
    });
  } catch (error) {
    console.error('Erreur markAsRead:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Marquer une conversation comme résolue
// @route   PUT /api/conversations/:id/resolve
// @access  Private (Admin)
exports.resolveConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { isResolved } = req.body;
    
    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { isResolved: isResolved !== undefined ? isResolved : true },
      { new: true }
    ).populate('userId', 'name email');
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation non trouvée' });
    }
    
    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('Erreur resolveConversation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir la conversation de l'utilisateur connecté
// @route   GET /api/conversations/me
// @access  Private
exports.getMyConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let conversation = await Conversation.findOne({ userId });
    
    // Si elle n'existe pas, la créer
    if (!conversation) {
      conversation = await Conversation.create({ userId });
    }
    
    // Récupérer les messages
    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .populate('userId', 'name');
    
    res.json({
      success: true,
      conversation,
      messages
    });
  } catch (error) {
    console.error('Erreur getMyConversation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
