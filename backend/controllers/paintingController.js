const Painting = require('../models/Painting');

// Obtenir toutes les peintures
exports.getPaintings = async (req, res) => {
  try {
    const { featured, search, sort } = req.query;
    
    let query = {};
    
    // Filtrer les peintures en vedette
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Recherche par nom
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    let paintings = Painting.find(query);
    
    // Tri
    if (sort === 'price-asc') {
      paintings = paintings.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      paintings = paintings.sort({ price: -1 });
    } else if (sort === 'name-asc') {
      paintings = paintings.sort({ name: 1 });
    } else if (sort === 'name-desc') {
      paintings = paintings.sort({ name: -1 });
    } else if (sort === 'newest') {
      paintings = paintings.sort({ createdAt: -1 });
    } else {
      // Par défaut: featured en premier
      paintings = paintings.sort({ featured: -1, createdAt: -1 });
    }
    
    const results = await paintings;
    res.json({ paintings: results });
  } catch (error) {
    console.error('Erreur lors du chargement des peintures:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir une peinture par ID
exports.getPaintingById = async (req, res) => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) {
      return res.status(404).json({ message: 'Peinture non trouvée' });
    }
    res.json({ painting });
  } catch (error) {
    console.error('Erreur lors du chargement de la peinture:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une peinture (admin uniquement)
exports.createPainting = async (req, res) => {
  try {
    const painting = await Painting.create(req.body);
    res.status(201).json({ painting });
  } catch (error) {
    console.error('Erreur lors de la création de la peinture:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une peinture (admin uniquement)
exports.updatePainting = async (req, res) => {
  try {
    const painting = await Painting.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!painting) {
      return res.status(404).json({ message: 'Peinture non trouvée' });
    }
    
    res.json({ painting });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la peinture:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une peinture (admin uniquement)
exports.deletePainting = async (req, res) => {
  try {
    const painting = await Painting.findByIdAndDelete(req.params.id);
    
    if (!painting) {
      return res.status(404).json({ message: 'Peinture non trouvée' });
    }
    
    res.json({ message: 'Peinture supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la peinture:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

