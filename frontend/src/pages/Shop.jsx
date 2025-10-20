import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../utils/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    loadProducts();
  }, [category, sortBy, search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (sortBy) params.sort = sortBy;
      if (search) params.search = search;

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Boutique</h1>
        <p className="text-gray-600">
          Découvrez tous nos produits
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Filtres</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-700">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Catégorie */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Toutes les catégories</option>
            <option value="t-shirt">T-shirts</option>
            <option value="sweat">Sweats</option>
            <option value="accessoire">Accessoires</option>
            <option value="autre">Autre</option>
          </select>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Trier par</option>
            <option value="newest">Plus récents</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Produits */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucun produit trouvé
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600">
            {products.length} produit(s) trouvé(s)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;

