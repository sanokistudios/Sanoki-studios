const Contact = require('../models/Contact');
const { sendEmail, sendContactNotification } = require('../utils/email');

// @desc    Créer un message de contact (invités)
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
  try {
    const { name, surname, email, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Nom, email et message sont requis' });
    }
    
    // Créer le message de contact
    const contact = await Contact.create({
      name,
      surname: surname || '',
      email,
      message
    });
    
    // Envoyer l'email à l'admin
    try {
      await sendContactNotification(contact);
    } catch (emailError) {
      console.error('Erreur envoi email admin:', emailError);
      // Ne pas bloquer si l'email échoue
    }
    
    // Envoyer un email de confirmation au client
    try {
      await sendEmail({
        to: email,
        subject: 'Nous avons bien reçu votre message',
        text: `Bonjour ${name},\n\nNous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.\n\nVotre message :\n${message}\n\nMerci de nous avoir contactés !`,
        html: `<p>Bonjour <strong>${name}</strong>,</p>
               <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
               <blockquote style="background: #f3f4f6; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                 ${message.replace(/\n/g, '<br>')}
               </blockquote>
               <p>Merci de nous avoir contactés ! 🙏</p>`
      });
    } catch (emailError) {
      console.error('Erreur envoi email confirmation client:', emailError);
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Message envoyé avec succès. Nous vous répondrons par email.',
      contact: {
        id: contact._id,
        name: contact.name,
        surname: contact.surname,
        email: contact.email
      }
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

// @desc    Supprimer un message de contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    
    res.json({ success: true, message: 'Message supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
