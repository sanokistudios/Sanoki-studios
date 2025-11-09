import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { productsAPI, collectionsAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';
import FilePreview from '../../components/FilePreview';
import { productDefaults } from '../../config/productDefaults';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);
  const [collectionForm, setCollectionForm] = useState({ id: '', name: '', description: '' });
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 't-shirt',
    collection: '',
    sizes: [],
    colors: [],
    images: [],
    stockBySize: {},
    featured: false,
    composition: '',
    sizeGuide: {
      referenceModel: { name: '', height: '', weight: '', size: '' },
      sizeRange: {}
    },
    washingInstructions: {
      handWash: '',
      machineWash: { temperature: '', cycle: '', spin: '' }
    }
  });

  useEffect(() => {
    loadProducts();
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const response = await collectionsAPI.getAll();
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        collection: product.collection?._id || product.collection || '',
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: product.images || [],
        stockBySize: product.stockBySize || {},
        featured: product.featured || false,
        composition: product.composition || '',
        sizeGuide: product.sizeGuide || {
          referenceModel: { name: '', height: '', weight: '', size: '' },
          sizeRange: {}
        },
        washingInstructions: product.washingInstructions || {
          handWash: '',
          machineWash: { temperature: '', cycle: '', spin: '' }
        },
      });
    } else {
      setEditingProduct(null);
      // Utiliser les valeurs par défaut pour les nouveaux produits
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 't-shirt',
        collection: '',
        sizes: [],
        colors: [],
        images: [],
        stockBySize: {},
        featured: false,
        composition: productDefaults.composition,
        sizeGuide: {
          referenceModel: { ...productDefaults.sizeGuide.referenceModel },
          sizeRange: { ...productDefaults.sizeGuide.sizeRange }
        },
        washingInstructions: {
          handWash: productDefaults.washingInstructions.handWash,
          machineWash: { ...productDefaults.washingInstructions.machineWash }
        },
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const openCreateCollection = () => {
    setEditingCollection(null);
    setCollectionForm({ id: '', name: '', description: '' });
    setShowCollectionsModal(true);
  };

  const openEditCollection = (col) => {
    setEditingCollection(col);
    setCollectionForm({ id: col._id, name: col.name, description: col.description || '' });
    setShowCollectionsModal(true);
  };

  const saveCollection = async (e) => {
    e.preventDefault();
    try {
      if (editingCollection) {
        await collectionsAPI.update(collectionForm.id, { name: collectionForm.name, description: collectionForm.description });
        toast.success('Collection mise à jour');
      } else {
        await collectionsAPI.create({ name: collectionForm.name, description: collectionForm.description });
        toast.success('Collection créée');
      }
      setShowCollectionsModal(false);
      await loadCollections();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la collection:', error);
      toast.error('Erreur lors de l\'enregistrement de la collection');
    }
  };

  const removeCollection = async (id) => {
    if (!window.confirm('Supprimer cette collection ?')) return;
    try {
      await collectionsAPI.delete(id);
      toast.success('Collection supprimée');
      await loadCollections();
      // Si la collection sélectionnée a été supprimée, vider le champ
      if (formData.collection === id) {
        setFormData({ ...formData, collection: '' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la collection:', error);
      toast.error('Erreur lors de la suppression de la collection');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map((item) => item.trim()).filter(Boolean);
    setFormData({
      ...formData,
      [field]: items
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sanitize payload to avoid sending empty collection value
      const payload = { ...formData };
      if (!payload.collection) {
        delete payload.collection;
      }
      // Ne pas envoyer le champ stock s'il existe (on utilise uniquement stockBySize)
      if (payload.stock !== undefined) {
        delete payload.stock;
      }

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, payload);
        toast.success('Produit mis à jour');
      } else {
        await productsAPI.create(payload);
        toast.success('Produit créé');
      }
      handleCloseModal();
      loadProducts();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit:', error);
      toast.error('Erreur lors de la sauvegarde du produit');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Produit supprimé');
        loadProducts();
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        toast.error('Erreur lors de la suppression du produit');
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
        <h2 className="text-3xl font-bold">Gestion des Produits</h2>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter un produit
        </button>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Prix</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Catégorie</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <FilePreview
                      src={product.images?.[0] || 'https://via.placeholder.com/60'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.price} TND</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-primary hover:bg-primary/10 rounded"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="t-shirt">T-shirt</option>
                    <option value="sweat">Sweat</option>
                    <option value="accessoire">Accessoire</option>
                    <option value="autre">Autre</option>
                  </select>
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
                    Activez cette option pour afficher ce produit sur la page d'accueil
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Collection</label>
                  <button type="button" onClick={openCreateCollection} className="text-sm text-blue-600 hover:underline">
                    Gérer les collections
                  </button>
                </div>
                <select
                  name="collection"
                  value={formData.collection}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Aucune</option>
                  {collections.map((col) => (
                    <option key={col._id} value={col._id}>{col.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tailles disponibles
                </label>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const newSizes = formData.sizes.includes(size)
                          ? formData.sizes.filter(s => s !== size)
                          : [...formData.sizes, size];
                        setFormData({ ...formData, sizes: newSizes });
                      }}
                      className={`px-4 py-2 rounded-none border-2 transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Cliquez sur les tailles pour les sélectionner/désélectionner
                </p>
              </div>

              {/* Stock par taille */}
              {formData.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock par taille *
                  </label>
                  <div className="space-y-2">
                    {formData.sizes.map((size) => (
                      <div key={size} className="flex items-center gap-2">
                        <label className="w-12 text-sm">{size}:</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.stockBySize[size] || ''}
                          onChange={(e) => {
                            const newStockBySize = { ...formData.stockBySize };
                            if (e.target.value === '') {
                              delete newStockBySize[size];
                            } else {
                              newStockBySize[size] = parseInt(e.target.value) || 0;
                            }
                            setFormData({ ...formData, stockBySize: newStockBySize });
                          }}
                          placeholder="Quantité disponible"
                          className="input-field flex-1"
                        />
                        {formData.stockBySize[size] === 0 && (
                          <span className="text-xs text-red-600">ÉPUISÉ</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Indiquez la quantité disponible pour chaque taille. Mettez 0 pour marquer une taille comme épuisée. Le produit sera marqué "SOLD OUT" si toutes les tailles sont épuisées.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Couleurs disponibles
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Noir', color: '#000000' },
                    { name: 'Blanc', color: '#FFFFFF' },
                    { name: 'Gris', color: '#808080' },
                    { name: 'Rouge', color: '#FF0000' },
                    { name: 'Bleu', color: '#0000FF' },
                    { name: 'Vert', color: '#00FF00' },
                    { name: 'Jaune', color: '#FFFF00' },
                    { name: 'Rose', color: '#FFC0CB' },
                    { name: 'Beige', color: '#F5F5DC' }
                  ].map((colorObj) => (
                    <button
                      key={colorObj.name}
                      type="button"
                      onClick={() => {
                        const newColors = formData.colors.includes(colorObj.name)
                          ? formData.colors.filter(c => c !== colorObj.name)
                          : [...formData.colors, colorObj.name];
                        setFormData({ ...formData, colors: newColors });
                      }}
                      className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        formData.colors.includes(colorObj.name)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-gray-400" 
                        style={{ backgroundColor: colorObj.color }}
                      ></span>
                      {colorObj.name}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Cliquez sur les couleurs pour les sélectionner/désélectionner
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Images du produit
                </label>
              <p className="text-xs text-gray-500 mb-2">
                Taille maximale par image : <strong>10 MB</strong> (plan gratuit Cloudinary)
              </p>
                <ImageUpload
                  multiple={true}
                  currentImages={formData.images}
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
                          <FilePreview
                            src={img}
                            alt={`Product ${idx + 1}`}
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

              {/* Composition - Appliquée automatiquement par le backend */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Information :</strong> Les informations de <strong>composition</strong>, <strong>guide des tailles</strong> et <strong>instructions de lavage</strong> sont automatiquement appliquées à tous les produits. Vous n'avez pas besoin de les remplir manuellement.
                </p>
              </div>

              {/* Composition */}
              <div>
                <label className="block text-sm font-medium mb-2">Composition</label>
                <textarea
                  name="composition"
                  value={formData.composition}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Ex: 100% COTTON TWILL. FRONT PLEATS. TONE-ON-TONE EMBROIDERY..."
                  className="input-field resize-none"
                />
              </div>

              {/* Guide des tailles */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-3">Guide des tailles</h4>
                {/* Modèle de référence */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Modèle de référence</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nom du modèle"
                      value={formData.sizeGuide.referenceModel.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        sizeGuide: {
                          ...formData.sizeGuide,
                          referenceModel: {
                            ...formData.sizeGuide.referenceModel,
                            name: e.target.value
                          }
                        }
                      })}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Taille portée"
                      value={formData.sizeGuide.referenceModel.size}
                      onChange={(e) => setFormData({
                        ...formData,
                        sizeGuide: {
                          ...formData.sizeGuide,
                          referenceModel: {
                            ...formData.sizeGuide.referenceModel,
                            size: e.target.value
                          }
                        }
                      })}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Taille (ex: 1M82)"
                      value={formData.sizeGuide.referenceModel.height}
                      onChange={(e) => setFormData({
                        ...formData,
                        sizeGuide: {
                          ...formData.sizeGuide,
                          referenceModel: {
                            ...formData.sizeGuide.referenceModel,
                            height: e.target.value
                          }
                        }
                      })}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Poids (ex: 70KG)"
                      value={formData.sizeGuide.referenceModel.weight}
                      onChange={(e) => setFormData({
                        ...formData,
                        sizeGuide: {
                          ...formData.sizeGuide,
                          referenceModel: {
                            ...formData.sizeGuide.referenceModel,
                            weight: e.target.value
                          }
                        }
                      })}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Plage de tailles */}
                <div>
                  <label className="block text-sm font-medium mb-2">Plage de tailles</label>
                  <div className="space-y-2">
                    {[
                      { key: '160-170CM', label: '160-170CM' },
                      { key: '165-180CM', label: '165-180CM' },
                      { key: '175-185CM', label: '175-185CM' },
                      { key: '185-195CM', label: '185-195CM' },
                      { key: '190CM-200CM', label: '190CM-200CM' }
                    ].map((range) => (
                      <div key={range.key} className="flex items-center gap-2">
                        <label className="w-32 text-sm">{range.label} -</label>
                        <input
                          type="text"
                          placeholder="Ex: SMALL"
                          value={formData.sizeGuide.sizeRange[range.key] || ''}
                          onChange={(e) => {
                            const newSizeRange = { ...formData.sizeGuide.sizeRange };
                            if (e.target.value === '') {
                              delete newSizeRange[range.key];
                            } else {
                              newSizeRange[range.key] = e.target.value;
                            }
                            setFormData({
                              ...formData,
                              sizeGuide: {
                                ...formData.sizeGuide,
                                sizeRange: newSizeRange
                              }
                            });
                          }}
                          className="input-field flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instructions de lavage */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-3">Instructions de lavage</h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Lavage à la main</label>
                  <textarea
                    placeholder="Ex: TO PRESERVE EMBROIDERY, ESPECIALLY IF IT IS FINE OR INTRICATE."
                    value={formData.washingInstructions.handWash}
                    onChange={(e) => setFormData({
                      ...formData,
                      washingInstructions: {
                        ...formData.washingInstructions,
                        handWash: e.target.value
                      }
                    })}
                    rows="2"
                    className="input-field resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Lavage en machine</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Température (ex: MAX 30°C)"
                      value={formData.washingInstructions.machineWash.temperature}
                      onChange={(e) => setFormData({
                        ...formData,
                        washingInstructions: {
                          ...formData.washingInstructions,
                          machineWash: {
                            ...formData.washingInstructions.machineWash,
                            temperature: e.target.value
                          }
                        }
                      })}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Cycle (ex: DELICATE / FRAGILE LAUNDRY)"
                      value={formData.washingInstructions.machineWash.cycle}
                      onChange={(e) => setFormData({
                        ...formData,
                        washingInstructions: {
                          ...formData.washingInstructions,
                          machineWash: {
                            ...formData.washingInstructions.machineWash,
                            cycle: e.target.value
                          }
                        }
                      })}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Essorage (ex: LOW (MAX 800 RPM))"
                      value={formData.washingInstructions.machineWash.spin}
                      onChange={(e) => setFormData({
                        ...formData,
                        washingInstructions: {
                          ...formData.washingInstructions,
                          machineWash: {
                            ...formData.washingInstructions.machineWash,
                            spin: e.target.value
                          }
                        }
                      })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>


              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  {editingProduct ? 'Mettre à jour' : 'Créer'}
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

      {showCollectionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Gérer les collections</h3>
              <button type="button" onClick={() => setShowCollectionsModal(false)} className="text-gray-500 hover:text-black">✕</button>
            </div>

            <form onSubmit={saveCollection} className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={collectionForm.name}
                  onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                  className="input-field"
                  placeholder="Nom de la collection"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (optionnel)</label>
                <textarea
                  value={collectionForm.description}
                  onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                  className="input-field resize-none"
                  rows="3"
                  placeholder="Description de la collection"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">{editingCollection ? 'Mettre à jour' : 'Créer'}</button>
                <button type="button" onClick={() => setShowCollectionsModal(false)} className="btn-outline flex-1">Annuler</button>
              </div>
            </form>

            <div>
              <h4 className="text-lg font-semibold mb-2">Collections existantes</h4>
              <div className="divide-y border rounded">
                {collections.length === 0 && (
                  <div className="p-3 text-sm text-gray-500">Aucune collection</div>
                )}
                {collections.map((col) => (
                  <div key={col._id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{col.name}</div>
                      {col.description && <div className="text-sm text-gray-500">{col.description}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openEditCollection(col)} className="btn-outline px-3 py-1 text-sm">Modifier</button>
                      <button type="button" onClick={() => removeCollection(col._id)} className="btn-danger px-3 py-1 text-sm">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

