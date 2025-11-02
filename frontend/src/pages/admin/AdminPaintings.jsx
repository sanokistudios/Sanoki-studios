import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { paintingsAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';

const AdminPaintings = () => {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPainting, setEditingPainting] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
    stock: '',
    featured: false
  });

  useEffect(() => {
    loadPaintings();
  }, []);

  const loadPaintings = async () => {
    try {
      const response = await paintingsAPI.getAll();
      setPaintings(response.data.paintings || []);
    } catch (error) {
      console.error('Erreur lors du chargement des peintures:', error);
      toast.error('Erreur lors du chargement des peintures');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (painting = null) => {
    if (painting) {
      setEditingPainting(painting);
      setFormData({
        name: painting.name,
        description: painting.description,
        price: painting.price,
        images: painting.images || [],
        stock: painting.stock || '',
        featured: painting.featured || false
      });
    } else {
      setEditingPainting(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        images: [],
        stock: '',
        featured: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPainting(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData };
      // Ne pas envoyer stock si vide
      if (payload.stock === '') {
        payload.stock = null;
      } else {
        payload.stock = parseInt(payload.stock);
      }
      payload.price = parseFloat(payload.price);

      if (editingPainting) {
        await paintingsAPI.update(editingPainting._id, payload);
        toast.success('Peinture mise à jour');
      } else {
        await paintingsAPI.create(payload);
        toast.success('Peinture créée');
      }
      handleCloseModal();
      loadPaintings();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette peinture ?')) {
      try {
        await paintingsAPI.delete(id);
        toast.success('Peinture supprimée');
        loadPaintings();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
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
        <h2 className="text-3xl font-bold">Gestion des Peintures</h2>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter une peinture
        </button>
      </div>

      {/* Liste des peintures */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Prix</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paintings.map((painting) => (
                <tr key={painting._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={painting.images?.[0] || 'https://via.placeholder.com/60'}
                      alt={painting.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{painting.name}</td>
                  <td className="px-6 py-4">{painting.price} TND</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        painting.stock === null || painting.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {painting.stock === null ? 'Illimité' : painting.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(painting)}
                        className="p-2 text-primary hover:bg-primary/10 rounded"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(painting._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-bold mb-6">
              {editingPainting ? 'Modifier la peinture' : 'Nouvelle peinture'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
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
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prix (TND) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock (optionnel)</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    placeholder="Laissez vide pour stock illimité"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Affichage page d'accueil</label>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      formData.featured ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        formData.featured ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-medium ${formData.featured ? 'text-primary' : 'text-gray-600'}`}>
                    {formData.featured ? 'Affiché sur la page d\'accueil' : 'Masqué de la page d\'accueil'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Activez cette option pour afficher cette peinture sur la page d'accueil
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Images de la peinture
                </label>
                <ImageUpload
                  multiple={true}
                  onUploadSuccess={(urls) => {
                    setFormData({
                      ...formData,
                      images: Array.isArray(urls) ? urls : [urls]
                    });
                  }}
                />
                {formData.images.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Images actuelles :</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Painting ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== idx);
                              setFormData({ ...formData, images: newImages });
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Ou saisissez une URL d'image :
                </p>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="input-field mt-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      e.preventDefault();
                      setFormData({
                        ...formData,
                        images: [...formData.images, e.target.value]
                      });
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  {editingPainting ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 btn-outline"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaintings;

