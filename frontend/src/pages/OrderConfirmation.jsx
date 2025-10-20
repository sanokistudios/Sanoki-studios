import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, Phone } from 'lucide-react';
import { ordersAPI } from '../utils/api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await ordersAPI.getById(orderId);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Commande introuvable</h2>
        <Link to="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Commande confirmée !</h1>
        <p className="text-xl text-gray-600">
          Merci pour votre commande. Nous allons la traiter rapidement.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Numéro de commande: {order.orderNumber}
          </h2>
          <p className="text-gray-600">
            Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Informations client */}
          <div>
            <h3 className="font-semibold mb-3">Informations de contact</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {order.customer.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {order.customer.phone}
              </p>
            </div>
          </div>

          {/* Adresse de livraison */}
          <div>
            <h3 className="font-semibold mb-3">Adresse de livraison</h3>
            <div className="text-sm text-gray-600">
              <p>{order.customer.name}</p>
              <p>{order.customer.address.street}</p>
              <p>
                {order.customer.address.city}{' '}
                {order.customer.address.postalCode}
              </p>
              <p>{order.customer.address.country}</p>
            </div>
          </div>
        </div>

        {/* Produits */}
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Produits commandés</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantité: {item.quantity}
                    {item.size && ` | Taille: ${item.size}`}
                    {item.color && ` | Couleur: ${item.color}`}
                  </p>
                </div>
                <p className="font-semibold">
                  {(item.price * item.quantity).toFixed(2)} TND
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-accent">{order.totalAmount.toFixed(2)} TND</span>
            </div>
          </div>
        </div>

        {/* Méthode de paiement */}
        <div className="border-t mt-6 pt-6">
          <div className="bg-gray-light p-4 rounded-lg">
            <p className="font-semibold mb-2">Méthode de paiement</p>
            <p className="text-sm text-gray-600">
              Paiement à la livraison (Cash on Delivery)
            </p>
          </div>
        </div>

        {order.notes && (
          <div className="border-t mt-6 pt-6">
            <p className="font-semibold mb-2">Notes</p>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-accent bg-opacity-10 p-6 rounded-lg mb-8">
        <div className="flex items-start gap-4">
          <Package className="w-8 h-8 text-accent flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Prochaines étapes</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ Vous recevrez un email de confirmation</li>
              <li>✓ Votre commande sera préparée sous 24h</li>
              <li>✓ Livraison estimée: 2-5 jours ouvrables</li>
              <li>✓ Paiement en espèces à la réception</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center space-x-4">
        <Link to="/" className="btn-outline">
          Retour à l'accueil
        </Link>
        <Link to="/boutique" className="btn-primary">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;

