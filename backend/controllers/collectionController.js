const Collection = require('../models/Collection');

// Obtenir toutes les collections
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ name: 1 });
    res.json({ collections });
  } catch (error) {
    console.error('Erreur lors du chargement des collections:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir une collection par ID
exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection non trouvée' });
    }
    res.json({ collection });
  } catch (error) {
    console.error('Erreur lors du chargement de la collection:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une collection (admin uniquement)
exports.createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }

    const collection = await Collection.create({ name, description });
    res.status(201).json({ collection });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Une collection avec ce nom existe déjà' });
    }
    console.error('Erreur lors de la création de la collection:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une collection (admin uniquement)
exports.updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection non trouvée' });
    }
    
    res.json({ collection });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la collection:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une collection (admin uniquement)
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    
    if (!collection) {
      return res.status(404).json({ message: 'Collection non trouvée' });
    }
    
    res.json({ message: 'Collection supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la collection:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

