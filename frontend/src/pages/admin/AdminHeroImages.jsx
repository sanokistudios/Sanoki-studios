import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { heroImagesAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';
import FilePreview from '../../components/FilePreview';

const AdminHeroImages = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    order: 0
  });

  useEffect(() => {
    loadHeroImages();
  }, []);

  const loadHeroImages = async () => {
    try {
      const response = await heroImagesAPI.getAll();
      setHeroImages(response.data.images || []);
    } catch (error) {
      console.error('Erreur lors du chargement des images hero:', error);
      toast.error('Erreur lors du chargement des images hero');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (image = null) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        imageUrl: image.imageUrl,
        order: image.order
      });
    } else {
      setEditingImage(null);
      // Nouveau: utiliser le dernier ordre + 1
      const maxOrder = heroImages.length > 0 
        ? Math.max(...heroImages.map(img => img.order)) 
        : -1;
      setFormData({
        imageUrl: '',
        order: maxOrder + 1
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingImage(null);
    setFormData({ imageUrl: '', order: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingImage) {
        await heroImagesAPI.update(editingImage._id, formData);
        toast.success('Image hero mise à jour');
      } else {
        await heroImagesAPI.create(formData);
        toast.success('Image hero créée');
      }
      handleCloseModal();
      await loadHeroImages();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette image ?')) return;
    try {
      await heroImagesAPI.delete(id);
      toast.success('Image supprimée');
      await loadHeroImages();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const moveImage = async (id, direction) => {
    const imageIndex = heroImages.findIndex(img => img._id === id);
    if (imageIndex === -1) return;

    const newIndex = direction === 'up' ? imageIndex - 1 : imageIndex + 1;
    if (newIndex < 0 || newIndex >= heroImages.length) return;

    // Échanger les ordres
    const updatedImages = [...heroImages];
    const tempOrder = updatedImages[imageIndex].order;
    updatedImages[imageIndex].order = updatedImages[newIndex].order;
    updatedImages[newIndex].order = tempOrder;

    // Mettre à jour l'ordre via l'API
    try {
      const imagesToUpdate = updatedImages.map((img, idx) => ({
        id: img._id,
        order: idx
      }));
      await heroImagesAPI.updateOrder(imagesToUpdate);
      toast.success('Ordre mis à jour');
      await loadHeroImages();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'ordre:', error);
      toast.error('Erreur lors de la mise à jour de l\'ordre');
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
        <h2 className="text-3xl font-bold">Gestion des Photos d'Accueil</h2>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter une photo
        </button>
      </div>

      {/* Liste des images */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {heroImages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Aucune photo d'accueil. Cliquez sur "Ajouter une photo" pour commencer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Ordre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">URL</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {heroImages.map((image, index) => (
                  <tr key={image._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{image.order + 1}</span>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveImage(image._id, 'up')}
                            disabled={index === 0}
                            className={`p-1 rounded ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            title="Déplacer vers le haut"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveImage(image._id, 'down')}
                            disabled={index === heroImages.length - 1}
                            className={`p-1 rounded ${index === heroImages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                            title="Déplacer vers le bas"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <FilePreview
                        src={image.imageUrl}
                        alt={`Hero ${image.order + 1}`}
                        className="w-24 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-md truncate text-sm text-gray-600">
                        {image.imageUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(image)}
                          className="p-2 text-primary hover:bg-primary/10 rounded"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(image._id)}
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
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-bold mb-6">
              {editingImage ? 'Modifier l\'image' : 'Nouvelle image'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Image *</label>
              <p className="text-xs text-gray-500 mb-2">
                Taille maximale : <strong>10 MB</strong> (plan gratuit Cloudinary)
              </p>
                <ImageUpload
                  onUploadSuccess={(url) => {
                    setFormData({ ...formData, imageUrl: url });
                  }}
                />
                {formData.imageUrl && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Fichier actuel :</p>
                    <FilePreview
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded border"
                    />
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="input-field mt-2"
                      placeholder="Ou saisissez une URL de fichier"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ordre *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'ordre détermine l'ordre d'affichage dans le carrousel (0 = première image)
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  {editingImage ? 'Mettre à jour' : 'Créer'}
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

export default AdminHeroImages;

