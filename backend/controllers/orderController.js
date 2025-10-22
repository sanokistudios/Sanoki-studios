const Order = require('../models/Order');

// @desc    Créer une commande
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, totalAmount, notes } = req.body;

    // Validation
    if (!customer || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Données de commande incomplètes' });
    }

    // Ajouter le userId si l'utilisateur est connecté
    const orderData = {
      customer,
      items,
      totalAmount,
      notes,
      paymentMethod: 'cod'
    };
    
    // Si le token est présent, associer la commande à l'utilisateur
    if (req.user) {
      orderData.userId = req.user.id;
    }

    const order = await Order.create(orderData);

    // Peupler les détails des produits (optionnel, continue même si échec)
    try {
      await order.populate('items.product');
    } catch (populateError) {
      console.warn('Avertissement : Impossible de peupler les produits:', populateError.message);
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer les commandes de l'utilisateur connecté
// @route   GET /api/orders/me
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product');
    
    res.json({ 
      success: true, 
      count: orders.length,
      orders 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer toutes les commandes
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const { status, limit, sort } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    let orders = Order.find(query).populate('items.product');
    
    // Tri
    if (sort === 'newest') {
      orders = orders.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      orders = orders.sort({ createdAt: 1 });
    }
    
    // Limite
    if (limit) {
      orders = orders.limit(parseInt(limit));
    }
    
    const result = await orders;
    
    res.json({ success: true, count: result.length, orders: result });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer une commande par ID
// @route   GET /api/orders/:id
// @access  Public (avec numéro de commande)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour le statut d'une commande
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Statut requis' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer une commande
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json({ success: true, message: 'Commande supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

