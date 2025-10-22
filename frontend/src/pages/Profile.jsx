import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Package, LogOut, Calendar, CreditCard } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/orders/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En cours',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status] || badges.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Mon Profil</h1>

        <div className="grid gap-6">
          {/* Informations personnelles */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-medium" />
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-medium" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-medium" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Historique des commandes */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Mes commandes ({orders.length})
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-medium">Vous n'avez pas encore passé de commande.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-primary">
                          Commande #{order.orderNumber}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-medium mt-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-dark">
                            {item.name} {item.size && `(${item.size})`} x {item.quantity}
                          </span>
                          <span className="font-medium">{item.price * item.quantity} TND</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t mt-3 pt-3 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-medium">
                        <CreditCard className="h-4 w-4" />
                        <span>Paiement à la livraison</span>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {order.totalAmount} TND
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <button
            onClick={logout}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
