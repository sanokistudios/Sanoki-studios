import { useEffect, useState } from 'react';
import { Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { heroImagesAPI, productsAPI } from '../utils/api';

const Home = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    loadHeroImages();
    loadProducts();
  }, []);

  // Auto-play du carrousel avec transition smooth
  useEffect(() => {
    if (heroImages.length <= 1 || !autoPlay) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval);
  }, [heroImages.length, autoPlay]);

  const loadHeroImages = async () => {
    try {
      const response = await heroImagesAPI.getAll();
      setHeroImages(response.data.images || []);
    } catch (error) {
      console.error('Erreur lors du chargement des images hero:', error);
      setHeroImages([]);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Charger uniquement les produits featured (affichés sur la page d'accueil)
      const response = await productsAPI.getAll({ featured: true });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    setAutoPlay(false); // Arrêter l'auto-play quand l'utilisateur navigue manuellement
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setAutoPlay(false); // Arrêter l'auto-play quand l'utilisateur navigue manuellement
  };

  const goToImage = (index) => {
    if (index !== currentImageIndex) {
      setCurrentImageIndex(index);
      setAutoPlay(false); // Arrêter l'auto-play quand l'utilisateur navigue manuellement
    }
  };

  // Si une seule image, pas de carrousel
  const showCarousel = heroImages.length > 1;

  return (
    <div className="animate-fade-in">
      {/* Hero Carousel */}
      {heroImages.length > 0 && (
        <section className="relative h-[70vh] min-h-[500px] bg-gray-200 overflow-hidden">
          {/* Conteneur pour les images avec transition slide style album photo */}
          <div 
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(-${currentImageIndex * 100}%)`,
              width: `${heroImages.length * 100}%`
            }}
          >
            {heroImages.map((heroImage, index) => (
              <div
                key={index}
                className="h-full flex-shrink-0 relative"
                style={{ width: `${100 / heroImages.length}%` }}
              >
                <img 
                  src={heroImage.imageUrl} 
                  alt={`Hero ${index + 1}`} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
            
            {/* Navigation buttons - seulement si plus d'une image */}
            {showCarousel && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-10"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Indicateurs de pagination */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? 'bg-white w-8'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Aller à l'image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
        </section>
      )}

      {/* Info Livraison */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Truck className="w-4 h-4" />
            <span>Livraison rapide dans toute la Tunisie en 2-5 jours</span>
          </div>
        </div>
      </div>

      {/* Produits */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Tous les produits</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loader"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Aucun produit disponible</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
