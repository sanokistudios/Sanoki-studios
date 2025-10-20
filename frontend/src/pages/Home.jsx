import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Truck, Shield } from 'lucide-react';
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
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary to-gray-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Style Tunisien Moderne
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Découvrez notre collection de t-shirts et vêtements de qualité,
              conçus avec passion en Tunisie.
            </p>
            <Link to="/boutique" className="btn-secondary inline-flex items-center gap-2">
              Découvrir la boutique
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">
                Livraison dans toute la Tunisie en 2-5 jours
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualité Garantie</h3>
              <p className="text-gray-600">
                Produits de haute qualité, testés et approuvés
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tendances Actuelles</h3>
              <p className="text-gray-600">
                Styles modernes et designs innovants
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Produits en Vedette</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection des meilleurs produits du moment
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Rejoignez notre communauté
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Suivez-nous sur les réseaux sociaux pour ne rien manquer de nos
            nouveautés et offres exclusives
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="btn-secondary">
              Nous contacter
            </Link>
            <Link to="/boutique" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
              Explorer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

