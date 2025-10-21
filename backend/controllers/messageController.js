const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// @desc    Récupérer tous les messages d'une conversation
// @route   GET /api/messages/:conversationId
// @access  Public
exports.getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const messages = Message.find({ conversationId }).sort({ timestamp: 1 });
    const result = await messages;
    
    res.json({ success: true, count: result.length, messages: result });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer toutes les conversations (Admin)
// @route   GET /api/messages/conversations
// @access  Private/Admin
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ lastMessageAt: -1 });
    res.json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Créer ou mettre à jour une conversation
// @route   POST /api/messages/conversation
// @access  Public
exports.createOrUpdateConversation = async (req, res) => {
  try {
    const { conversationId, clientName, clientEmail } = req.body;
    
    if (!conversationId || !clientName) {
      return res.status(400).json({ message: 'Données de conversation incomplètes' });
    }

    let conversation = await Conversation.findOne({ conversationId });
    
    if (!conversation) {
      conversation = await Conversation.create({
        conversationId,
        clientName,
        clientEmail
      });
    } else {
      conversation.clientName = clientName;
      if (clientEmail) conversation.clientEmail = clientEmail;
      await conversation.save();
    }
    
    res.json({ success: true, conversation });
  } catch (error) {
    console.error('Erreur lors de la création/maj de la conversation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Créer un message
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res) => {
  try {
    const { conversationId, sender, clientName, content } = req.body;
    
    if (!conversationId || !sender || !content) {
      return res.status(400).json({ message: 'Données de message incomplètes' });
    }
    
    const message = await Message.create({
      conversationId,
      sender,
      clientName,
      content
    });

    // Mettre à jour la conversation
    await Conversation.findOneAndUpdate(
      { conversationId },
      {
        lastMessage: content,
        lastMessageAt: new Date(),
        $inc: { unreadCount: sender === 'client' ? 1 : 0 }
      }
    );
    
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Marquer les messages d'une conversation comme lus
// @route   PUT /api/messages/:conversationId/read
// @access  Private/Admin
exports.markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    await Message.updateMany(
      { conversationId, read: false },
      { read: true }
    );

    await Conversation.findOneAndUpdate(
      { conversationId },
      { unreadCount: 0 }
    );
    
    res.json({ success: true, message: 'Messages marqués comme lus' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer une conversation complète
// @route   DELETE /api/messages/conversation/:conversationId
// @access  Private/Admin
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    await Message.deleteMany({ conversationId });
    await Conversation.findOneAndDelete({ conversationId });
    
    res.json({ success: true, message: 'Conversation supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la conversation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
