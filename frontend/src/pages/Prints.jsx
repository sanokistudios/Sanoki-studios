import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import PaintingCard from '../components/PaintingCard';
import { paintingsAPI } from '../utils/api';

const Prints = () => {
  const [paintings, setPaintings] = useState([]);
  const [allPaintings, setAllPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // États des filtres
  const [filters, setFilters] = useState({
    sortBy: 'featured',
    priceRange: [0, 5000],
    inStockOnly: false
  });

  useEffect(() => {
    loadPaintings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allPaintings]);

  const loadPaintings = async () => {
    setLoading(true);
    try {
      const response = await paintingsAPI.getAll();
      setAllPaintings(response.data.paintings || []);
      setPaintings(response.data.paintings || []);
    } catch (error) {
      console.error('Erreur lors du chargement des peintures:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allPaintings];

    // Filtre stock
    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.stock === null || p.stock > 0);
    }

    // Filtre prix
    filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Tri
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // featured: peintures featured en premier
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setPaintings(filtered);
  };

  const resetFilters = () => {
    setFilters({
      sortBy: 'featured',
      priceRange: [0, 5000],
      inStockOnly: false
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Peintures & Prints</h1>
      
      {/* Barre avec bouton filtrer et nombre de peintures */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          {paintings.length} peinture{paintings.length > 1 ? 's' : ''}
        </p>
        
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-sm font-medium">Filtrer et trier</span>
        </button>
      </div>

      {/* Grille de peintures */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div>
        </div>
      ) : paintings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucune peinture disponible
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {paintings.map((painting) => (
            <PaintingCard key={painting._id} painting={painting} />
          ))}
        </div>
      )}

      {/* Overlay des filtres */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowFilters(false)}>
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl animate-slide-in-right overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">FILTRES</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tri */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Trier par</h3>
                <div className="space-y-2">
                  {[
                    { value: 'featured', label: 'En vedette' },
                    { value: 'price-asc', label: 'Prix croissant' },
                    { value: 'price-desc', label: 'Prix décroissant' },
                    { value: 'name-asc', label: 'Nom (A-Z)' },
                    { value: 'name-desc', label: 'Nom (Z-A)' },
                    { value: 'newest', label: 'Plus récent' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Prix</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Min: {filters.priceRange[0]} TND</label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({ ...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]] })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max: {filters.priceRange[1]} TND</label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm font-medium">En stock uniquement</span>
                </label>
              </div>

              {/* Boutons */}
              <div className="flex gap-2">
                <button
                  onClick={resetFilters}
                  className="flex-1 btn-outline"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 btn-primary"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prints;

