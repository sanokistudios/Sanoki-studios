const Product = require('../models/Product');

// @desc    Récupérer tous les produits
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search, sort, limit } = req.query;
    
    let query = {};
    
    // Filtrer par catégorie
    if (category) {
      query.category = category;
    }
    
    // Filtrer les produits en vedette
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Recherche par nom
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    let products = Product.find(query);
    
    // Tri
    if (sort === 'price-asc') {
      products = products.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      products = products.sort({ price: -1 });
    } else if (sort === 'newest') {
      products = products.sort({ createdAt: -1 });
    }
    
    // Limite
    if (limit) {
      products = products.limit(parseInt(limit));
    }
    
    const result = await products;
    
    res.json({ success: true, count: result.length, products: result });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer un produit par ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Créer un produit
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour un produit
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer un produit
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.json({ success: true, message: 'Produit supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

