import { useEffect, useState } from 'react';
import { collectionsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: '', name: '', description: '' });
  const [editing, setEditing] = useState(null);

  const loadCollections = async () => {
    try {
      const res = await collectionsAPI.getAll();
      setCollections(res.data.collections || []);
    } catch (e) {
      console.error('Erreur chargement collections:', e);
      toast.error('Erreur chargement collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCollections(); }, []);

  const resetForm = () => {
    setForm({ id: '', name: '', description: '' });
    setEditing(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await collectionsAPI.update(form.id, { name: form.name, description: form.description });
        toast.success('Collection mise à jour');
      } else {
        await collectionsAPI.create({ name: form.name, description: form.description });
        toast.success('Collection créée');
      }
      resetForm();
      await loadCollections();
    } catch (e) {
      console.error('Erreur sauvegarde collection:', e);
      toast.error('Erreur sauvegarde collection');
    }
  };

  const onEdit = (col) => {
    setEditing(col);
    setForm({ id: col._id, name: col.name, description: col.description || '' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Supprimer cette collection ?')) return;
    try {
      await collectionsAPI.delete(id);
      toast.success('Collection supprimée');
      await loadCollections();
    } catch (e) {
      console.error('Erreur suppression collection:', e);
      toast.error('Erreur suppression collection');
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Modifier une collection' : 'Créer une collection'}</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Nom de la collection"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field md:col-span-1"
            required
          />
          <input
            type="text"
            placeholder="Description (optionnel)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field md:col-span-1"
          />
          <div className="flex gap-2 md:col-span-1">
            <button type="submit" className="btn-primary flex-1">{editing ? 'Mettre à jour' : 'Créer'}</button>
            {editing && (
              <button type="button" onClick={resetForm} className="btn-outline flex-1">Annuler</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-6 py-8 text-center" colSpan={4}>Chargement...</td></tr>
              ) : collections.length === 0 ? (
                <tr><td className="px-6 py-8 text-center text-gray-500" colSpan={4}>Aucune collection</td></tr>
              ) : (
                collections.map((col) => (
                  <tr key={col._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{col.name}</td>
                    <td className="px-6 py-4 text-gray-500">{col.slug}</td>
                    <td className="px-6 py-4">{col.description}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => onEdit(col)} className="p-2 text-primary hover:bg-primary/10 rounded">Modifier</button>
                        <button onClick={() => onDelete(col._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCollections;


