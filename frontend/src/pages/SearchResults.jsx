import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PaintingCard from '../components/PaintingCard';
import { productsAPI, paintingsAPI } from '../utils/api';

const SearchResults = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search');
    setSearchQuery(search || '');
    
    if (search) {
      loadSearchResults(search);
    } else {
      setLoading(false);
    }
  }, [location.search]);

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
  const matchesSearch = (item, query, isPainting = false) => {
    if (!query || !query.trim()) return true;
    
    // Normaliser tous les champs à rechercher
    const normalizedName = normalizeText(item.name);
    const normalizedDescription = normalizeText(item.description || '');
    const normalizedCollection = normalizeText(item.collection || '');
    const allText = normalizedName + ' ' + normalizedDescription + ' ' + normalizedCollection;
    
    // Normaliser la requête
    const normalizedQuery = normalizeText(query);
    
    // 1. Recherche exacte : la requête complète est dans le texte
    if (allText.includes(normalizedQuery)) {
      return true;
    }
    
    // 2. Recherche inverse : le nom/description est dans la requête
    if (normalizedName.length > 0 && normalizedQuery.includes(normalizedName)) {
      return true;
    }
    
    // 3. Recherche approximative : tous les caractères de la requête sont présents dans l'ordre
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
    
    // 4. Recherche par mots
    const originalWords = query.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[\s\-_]+/)
      .filter(word => word.length > 0);
    
    if (originalWords.length > 1) {
      let matchingWords = 0;
      for (const word of originalWords) {
        const normalizedWord = normalizeText(word);
        if (normalizedName.includes(normalizedWord) || 
            normalizedDescription.includes(normalizedWord) ||
            normalizedCollection.includes(normalizedWord)) {
          matchingWords++;
        }
      }
      if (matchingWords >= Math.ceil(originalWords.length * 0.5)) {
        return true;
      }
    }
    
    return false;
  };

  const loadSearchResults = async (query) => {
    setLoading(true);
    try {
      // Charger tous les produits
      const productsResponse = await productsAPI.getAll();
      const allProducts = productsResponse.data.products || [];
      
      // Charger toutes les peintures
      const paintingsResponse = await paintingsAPI.getAll();
      const allPaintings = paintingsResponse.data.paintings || [];
      
      // Filtrer les produits correspondant à la recherche
      const filteredProducts = allProducts.filter(p => matchesSearch(p, query, false));
      
      // Filtrer les peintures correspondant à la recherche
      const filteredPaintings = allPaintings.filter(p => matchesSearch(p, query, true));
      
      setProducts(filteredProducts);
      setPaintings(filteredPaintings);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalResults = products.length + paintings.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête de recherche */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Résultats de recherche</h1>
        {searchQuery && (
          <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-between">
            <p className="text-sm">
              Résultats pour : <span className="font-semibold">"{searchQuery}"</span>
            </p>
            <p className="text-sm text-gray-600">
              {totalResults} résultat{totalResults > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader"></div>
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Aucun résultat trouvé pour "{searchQuery}"
          </p>
          <p className="text-sm text-gray-400">
            Essayez avec d'autres mots-clés ou vérifiez l'orthographe
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Section T-shirts */}
          {products.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">
                T-shirts ({products.length})
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-x-2 md:gap-y-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Section Peintures */}
          {paintings.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">
                Peintures ({paintings.length})
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-x-2 md:gap-y-6">
                {paintings.map((painting) => (
                  <PaintingCard key={painting._id} painting={painting} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;


