const Contact = require('../models/Contact');

// @desc    Créer un message de contact
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Message envoyé avec succès',
      contact 
    });
  } catch (error) {
    console.error('Erreur lors de la création du message de contact:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer tous les messages de contact
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    
    res.json({ success: true, count: contacts.length, contacts });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages de contact:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour le statut d'un message de contact
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json({ success: true, contact });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

