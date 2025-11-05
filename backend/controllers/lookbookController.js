const Lookbook = require('../models/Lookbook');

// Obtenir toutes les images lookbook triées par ordre
exports.getLookbookImages = async (req, res) => {
  try {
    const images = await Lookbook.find().sort({ order: 1 });
    res.json({ images });
  } catch (error) {
    console.error('Erreur lors du chargement des images lookbook:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une nouvelle image lookbook (admin uniquement)
exports.createLookbookImage = async (req, res) => {
  try {
    const { imageUrl, title, description, order } = req.body;
    
    console.log('📥 Création lookbook image - imageUrl:', imageUrl ? 'présent' : 'manquant', 'order:', order);
    
    if (!imageUrl || imageUrl.trim() === '') {
      console.error('❌ imageUrl manquant ou vide');
      return res.status(400).json({ message: 'L\'URL de l\'image est requise' });
    }

    // Si order n'est pas fourni, utiliser le dernier ordre + 1
    let imageOrder = order;
    if (imageOrder === undefined || imageOrder === null) {
      const lastImage = await Lookbook.findOne().sort({ order: -1 });
      imageOrder = lastImage ? lastImage.order + 1 : 0;
    }

    console.log('💾 Création lookbook avec order:', imageOrder);
    const lookbookImage = await Lookbook.create({ 
      imageUrl: imageUrl.trim(), 
      title: title || '',
      description: description || '',
      order: imageOrder 
    });
    console.log('✅ Lookbook image créée:', lookbookImage._id);
    res.status(201).json({ lookbookImage });
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'image lookbook:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Mettre à jour une image lookbook (admin uniquement)
exports.updateLookbookImage = async (req, res) => {
  try {
    const { imageUrl, title, description, order } = req.body;
    const lookbookImage = await Lookbook.findByIdAndUpdate(
      req.params.id,
      { imageUrl, title, description, order },
      { new: true, runValidators: true }
    );

    if (!lookbookImage) {
      return res.status(404).json({ message: 'Image lookbook non trouvée' });
    }

    res.json({ lookbookImage });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'image lookbook:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une image lookbook (admin uniquement)
exports.deleteLookbookImage = async (req, res) => {
  try {
    const lookbookImage = await Lookbook.findByIdAndDelete(req.params.id);
    
    if (!lookbookImage) {
      return res.status(404).json({ message: 'Image lookbook non trouvée' });
    }

    res.json({ message: 'Image lookbook supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image lookbook:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour l'ordre de toutes les images (admin uniquement)
exports.updateOrder = async (req, res) => {
  try {
    const { images } = req.body; // Array of { id, order }
    
    if (!Array.isArray(images)) {
      return res.status(400).json({ message: 'Le format des images est invalide' });
    }

    // Mettre à jour l'ordre de chaque image
    const updatePromises = images.map(({ id, order }) =>
      Lookbook.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    
    // Retourner toutes les images triées par ordre
    const updatedImages = await Lookbook.find().sort({ order: 1 });
    res.json({ images: updatedImages });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'ordre:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

