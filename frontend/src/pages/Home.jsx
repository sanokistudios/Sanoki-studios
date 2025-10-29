import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getAll({ featured: true, limit: 4 });
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Image - Placeholder pour l'instant */}
      <section className="relative h-[70vh] min-h-[500px] bg-gray-200">
        <img 
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1600&h=900&fit=crop" 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        {/* On gardera cette section pour ajouter l'image plus tard */}
      </section>

      {/* Info Livraison - Discrète */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Truck className="w-4 h-4" />
            <span>Livraison rapide dans toute la Tunisie en 2-5 jours</span>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Produits en Vedette</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-4 md:gap-x-2 md:gap-y-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/boutique" className="btn-outline">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

