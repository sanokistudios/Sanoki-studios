import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    const existingItemIndex = cart.findIndex(
      (item) =>
        item._id === product._id &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Si le produit existe déjà, augmenter la quantité
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
      toast.success('Quantité mise à jour');
    } else {
      // Sinon, ajouter le nouveau produit
      const newItem = {
        ...product,
        quantity,
        size,
        color,
        cartId: `${product._id}-${size}-${color}-${Date.now()}`
      };
      setCart([...cart, newItem]);
      toast.success('Produit ajouté au panier');
    }
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
    toast.success('Produit retiré du panier');
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartId);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.cartId === cartId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Panier vidé');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const value = {
    cart,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    toggleCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

