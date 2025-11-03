import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../utils/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // États des filtres
  const [filters, setFilters] = useState({
    sortBy: 'featured',
    priceRange: [0, 500],
    inStockOnly: false
  });

  const location = useLocation();

  // Charger et recharger lors des changements d'URL (ex: menu hamburger -> /boutique?collection=slug ou ?search=query)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const collectionSlug = urlParams.get('collection');
    const search = urlParams.get('search');
    
    setSearchQuery(search || '');
    
    if (collectionSlug) {
      loadProducts(collectionSlug);
    } else {
      loadProducts();
    }
  }, [location.search]);

  useEffect(() => {
    applyFilters();
  }, [filters, allProducts, searchQuery]);

  const loadProducts = async (collectionSlug = null) => {
    setLoading(true);
    try {
      const params = collectionSlug ? { collection: collectionSlug } : {};
      const response = await productsAPI.getAll(params);
      setAllProducts(response.data.products);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de normalisation pour recherche intelligente
  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      // Normaliser les accents
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Enlever les espaces, tirets, underscores
      .replace(/[\s\-_]+/g, '')
      // Enlever les caractères spéciaux sauf lettres et chiffres
      .replace(/[^a-z0-9]/g, '');
  };

  // Fonction de recherche intelligente
  const matchesSearch = (product, query) => {
    if (!query || !query.trim()) return true;
    
    // Normaliser tous les champs à rechercher
    const normalizedName = normalizeText(product.name);
    const normalizedDescription = normalizeText(product.description || '');
    const normalizedCollection = normalizeText(product.collection || '');
    const allText = normalizedName + ' ' + normalizedDescription + ' ' + normalizedCollection;
    
    // Normaliser la requête (enlever espaces/tirets mais garder pour séparer les mots)
    const normalizedQuery = normalizeText(query);
    
    // 1. Recherche exacte : la requête complète est dans le texte
    if (allText.includes(normalizedQuery)) {
      return true;
    }
    
    // 2. Recherche inverse : le nom/description est dans la requête
    // Ex: si on cherche "tshirt" et le produit s'appelle "t-shirt"
    if (normalizedName.length > 0 && normalizedQuery.includes(normalizedName)) {
      return true;
    }
    
    // 3. Recherche approximative : tous les caractères de la requête sont présents dans l'ordre
    // Ex: "tshirt" trouve "t-shirt", "fleure" trouve "fleuré"
    let foundIndex = 0;
    let allCharsFound = true;
    
    for (let i = 0; i < normalizedQuery.length; i++) {
      const char = normalizedQuery[i];
      const nextIndex = allText.indexOf(char, foundIndex);
      if (nextIndex === -1) {
        allCharsFound = false;
        break;
      }
      foundIndex = nextIndex + 1;
    }
    
    if (allCharsFound) {
      return true;
    }
    
    // 4. Recherche par mots : diviser la requête originale en mots (avant normalisation complète)
    // Ex: "t-shirt noir" -> ["t-shirt", "noir"]
    const originalWords = query.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[\s\-_]+/)
      .filter(word => word.length > 0);
    
    if (originalWords.length > 1) {
      // Vérifier si au moins un mot est présent dans le nom/description
      let matchingWords = 0;
      for (const word of originalWords) {
        const normalizedWord = normalizeText(word);
        if (normalizedName.includes(normalizedWord) || 
            normalizedDescription.includes(normalizedWord) ||
            normalizedCollection.includes(normalizedWord)) {
          matchingWords++;
        }
      }
      // Si au moins 50% des mots correspondent, on considère que c'est un match
      if (matchingWords >= Math.ceil(originalWords.length * 0.5)) {
        return true;
      }
    }
    
    return false;
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Filtre de recherche intelligente
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(p => matchesSearch(p, searchQuery));
    }

    // Filtre stock - vérifier si toutes les tailles sont épuisées
    if (filters.inStockOnly) {
      filtered = filtered.filter(p => {
        // Si pas de tailles, considérer comme disponible
        if (!p.sizes || p.sizes.length === 0) {
          return true;
        }
        // Si au moins une taille a du stock, le produit est disponible
        const stockBySize = p.stockBySize || {};
        return p.sizes.some(size => {
          const stock = stockBySize[size];
          return stock === undefined || stock === null || stock > 0;
        });
      });
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
        // featured: produits featured en premier
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setProducts(filtered);
  };

  const resetFilters = () => {
    setFilters({
      sortBy: 'featured',
      priceRange: [0, 500],
      inStockOnly: false
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Indicateur de recherche */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
          <p className="text-sm">
            Résultats pour : <span className="font-semibold">"{searchQuery}"</span>
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              window.history.pushState({}, '', '/boutique');
            }}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            Effacer la recherche
          </button>
        </div>
      )}

      {/* Barre avec bouton filtrer et nombre de produits */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          {products.length} produit{products.length > 1 ? 's' : ''}
        </p>
        
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-sm font-medium">Filtrer et trier</span>
        </button>
      </div>

      {/* Grille de produits */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucun produit disponible
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-x-2 md:gap-y-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
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
                    { value: 'featured', label: 'EN VEDETTE' },
                    { value: 'newest', label: 'PLUS RÉCENTS' },
                    { value: 'name-asc', label: 'ALPHABÉTIQUE, DE A À Z' },
                    { value: 'name-desc', label: 'ALPHABÉTIQUE, DE Z À A' },
                    { value: 'price-asc', label: 'PRIX: FAIBLE À ÉLEVÉ' },
                    { value: 'price-desc', label: 'PRIX: ÉLEVÉ À FAIBLE' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="mb-6 pt-6 border-t">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">En stock uniquement</span>
                </label>
              </div>

              {/* Prix */}
              <div className="mb-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">Prix</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({ ...filters, priceRange: [0, parseInt(e.target.value)] })}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>{filters.priceRange[0]} TND</span>
                    <span>à</span>
                    <span>{filters.priceRange[1]} TND</span>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-6 border-t">
                <button
                  onClick={resetFilters}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  EFFACER
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  APPLIQUER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;

