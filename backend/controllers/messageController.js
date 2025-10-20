const Message = require('../models/Message');

// @desc    Récupérer tous les messages
// @route   GET /api/messages
// @access  Public
exports.getMessages = async (req, res) => {
  try {
    const { limit } = req.query;
    
    let messages = Message.find().sort({ timestamp: 1 });
    
    if (limit) {
      messages = messages.limit(parseInt(limit));
    }
    
    const result = await messages;
    
    res.json({ success: true, count: result.length, messages: result });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Créer un message
// @route   POST /api/messages
// @access  Public
exports.createMessage = async (req, res) => {
  try {
    const { sender, clientName, content } = req.body;
    
    if (!sender || !content) {
      return res.status(400).json({ message: 'Données de message incomplètes' });
    }
    
    const message = await Message.create({
      sender,
      clientName,
      content
    });
    
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Marquer un message comme lu
// @route   PUT /api/messages/:id/read
// @access  Private/Admin
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json({ success: true, message });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer un message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json({ success: true, message: 'Message supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

