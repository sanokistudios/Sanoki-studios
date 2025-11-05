import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  // Pré-remplir les données si l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        // Pré-remplir avec l'adresse par défaut si elle existe
        ...(user.addresses?.find(addr => addr.isDefault) && {
          street: user.addresses.find(addr => addr.isDefault).line1 || '',
          city: user.addresses.find(addr => addr.isDefault).city || '',
          postalCode: user.addresses.find(addr => addr.isDefault).postalCode || ''
        })
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const SHIPPING_FEE = 8; // Frais de livraison en TND
  
  const getTotalWithShipping = () => {
    return getCartTotal() + SHIPPING_FEE;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: formData.street || formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            governorate: formData.governorate || formData.city, // Fallback sur city si pas de governorate
            country: 'Tunisie'
          }
        },
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        totalAmount: getTotalWithShipping(),
        notes: formData.notes
      };

      const response = await ordersAPI.create(orderData);
      toast.success('Commande créée avec succès !');
      clearCart();
      navigate(`/confirmation/${response.data.order._id}`);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/panier');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+216 XX XXX XXX"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Adresse de livraison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Adresse de livraison</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Rue, numéro"
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Notes (optionnel)</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Instructions de livraison, commentaires..."
              rows="4"
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Résumé */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-6">
            <h2 className="text-2xl font-semibold">Résumé de commande</h2>

            {/* Produits */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.cartId} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">
                      Qté: {item.quantity} {item.size && `| ${item.size}`}
                    </p>
                  </div>
                  <p className="font-semibold">{item.price * item.quantity} TND</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-semibold">{getCartTotal().toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-accent">
                <span>Frais de livraison</span>
                <span className="font-semibold">{SHIPPING_FEE.toFixed(2)} TND</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-accent">{getTotalWithShipping().toFixed(2)} TND</span>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="bg-gray-light p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-5 h-5 text-accent" />
                <span className="font-semibold">Paiement à la livraison</span>
              </div>
              <p className="text-sm text-gray-600">
                Vous paierez en espèces lors de la réception de votre commande.
              </p>
            </div>

            <div className="bg-accent bg-opacity-10 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-accent" />
                <span className="font-semibold">Livraison rapide</span>
              </div>
              <p className="text-sm text-gray-600">
                Livraison dans toute la Tunisie en 2-5 jours ouvrables.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Confirmer la commande'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

