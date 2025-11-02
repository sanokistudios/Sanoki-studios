const HeroImage = require('../models/HeroImage');

// Obtenir toutes les images hero triées par ordre
exports.getHeroImages = async (req, res) => {
  try {
    const images = await HeroImage.find().sort({ order: 1 });
    res.json({ images });
  } catch (error) {
    console.error('Erreur lors du chargement des images hero:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une nouvelle image hero (admin uniquement)
exports.createHeroImage = async (req, res) => {
  try {
    const { imageUrl, order } = req.body;
    
    console.log('📥 Création hero image - imageUrl:', imageUrl ? 'présent' : 'manquant', 'order:', order);
    
    if (!imageUrl || imageUrl.trim() === '') {
      console.error('❌ imageUrl manquant ou vide');
      return res.status(400).json({ message: 'L\'URL de l\'image est requise' });
    }

    // Si order n'est pas fourni, utiliser le dernier ordre + 1
    let imageOrder = order;
    if (imageOrder === undefined || imageOrder === null) {
      const lastImage = await HeroImage.findOne().sort({ order: -1 });
      imageOrder = lastImage ? lastImage.order + 1 : 0;
    }

    console.log('💾 Création avec order:', imageOrder);
    const heroImage = await HeroImage.create({ imageUrl: imageUrl.trim(), order: imageOrder });
    console.log('✅ Hero image créée:', heroImage._id);
    res.status(201).json({ heroImage });
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'image hero:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Mettre à jour une image hero (admin uniquement)
exports.updateHeroImage = async (req, res) => {
  try {
    const { imageUrl, order } = req.body;
    const heroImage = await HeroImage.findByIdAndUpdate(
      req.params.id,
      { imageUrl, order, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!heroImage) {
      return res.status(404).json({ message: 'Image hero non trouvée' });
    }

    res.json({ heroImage });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'image hero:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une image hero (admin uniquement)
exports.deleteHeroImage = async (req, res) => {
  try {
    const heroImage = await HeroImage.findByIdAndDelete(req.params.id);
    
    if (!heroImage) {
      return res.status(404).json({ message: 'Image hero non trouvée' });
    }

    res.json({ message: 'Image hero supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image hero:', error);
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
      HeroImage.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);
    
    // Retourner toutes les images triées par ordre
    const updatedImages = await HeroImage.find().sort({ order: 1 });
    res.json({ images: updatedImages });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'ordre:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

