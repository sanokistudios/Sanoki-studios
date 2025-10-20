import { useEffect, useState } from 'react';
import { Eye, Package } from 'lucide-react';
import { ordersAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      params.sort = 'newest';

      const response = await ordersAPI.getAll(params);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success('Statut mis à jour');
      loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        const response = await ordersAPI.getById(orderId);
        setSelectedOrder(response.data.order);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Gestion des Commandes</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="processing">En préparation</option>
          <option value="shipped">Expédiée</option>
          <option value="delivered">Livrée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">N° Commande</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 font-semibold">{order.totalAmount} TND</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détails */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold">Commande {selectedOrder.orderNumber}</h3>
                <p className="text-gray-600">
                  {new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Statut */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Statut de la commande</label>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                className="input-field"
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="processing">En préparation</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>

            {/* Client */}
            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Informations client</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Nom:</strong> {selectedOrder.customer.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                  <p><strong>Téléphone:</strong> {selectedOrder.customer.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Adresse de livraison</h4>
                <div className="text-sm space-y-1">
                  <p>{selectedOrder.customer.address.street}</p>
                  <p>{selectedOrder.customer.address.city} {selectedOrder.customer.address.postalCode}</p>
                  <p>{selectedOrder.customer.address.country}</p>
                </div>
              </div>
            </div>

            {/* Produits */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Produits</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qté: {item.quantity}
                        {item.size && ` | Taille: ${item.size}`}
                        {item.color && ` | Couleur: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-600">{item.price} TND/unité</p>
                    </div>
                    <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} TND</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t">
                <span>Total</span>
                <span className="text-accent">{selectedOrder.totalAmount.toFixed(2)} TND</span>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedOrder.notes}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full btn-primary"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

