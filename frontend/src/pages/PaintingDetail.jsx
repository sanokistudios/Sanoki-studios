import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Truck } from 'lucide-react';
import { paintingsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PaintingDetail = () => {
  const { id } = useParams();
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    loadPainting();
  }, [id]);

  const loadPainting = async () => {
    try {
      const response = await paintingsAPI.getById(id);
      setPainting(response.data.painting);
    } catch (error) {
      console.error('Erreur lors du chargement de la peinture:', error);
      toast.error('Peinture introuvable');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(painting, quantity);
    toast.success('Peinture ajoutée au panier');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!painting) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Peinture introuvable</h2>
        <Link to="/prints" className="btn-primary">
          Retour aux peintures
        </Link>
      </div>
    );
  }

  const isOutOfStock = painting.stock !== null && painting.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <Link
        to="/prints"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux peintures
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-light rounded-lg overflow-hidden mb-4">
            <img
              src={painting.images?.[selectedImage] || 'https://via.placeholder.com/600'}
              alt={painting.name}
              className="w-full h-full object-cover"
            />
          </div>
          {painting.images && painting.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {painting.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-accent' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${painting.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{painting.name}</h1>
          <p className="text-3xl font-bold text-accent mb-6">
            {painting.price} TND
          </p>

          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">{painting.description}</p>
          </div>

          {/* Quantité */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Quantité
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border-2 hover:bg-gray-100 font-semibold"
              >
                -
              </button>
              <span className="w-12 text-center font-semibold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border-2 hover:bg-gray-100 font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Bouton ajouter au panier */}
          {isOutOfStock ? (
            <div className="w-full bg-red-50 border-2 border-red-500 text-red-700 py-4 px-6 text-center font-bold uppercase">
              PEINTURE ÉPUISÉE
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Ajouter au panier
            </button>
          )}

          {/* Infos livraison */}
          <div className="mt-8 p-4 bg-gray-light rounded-none">
            <div className="flex items-start gap-3">
              <Truck className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Livraison en Tunisie</h3>
                <p className="text-sm text-gray-600">
                  Livraison rapide dans toute la Tunisie en 2-5 jours ouvrables.
                  Paiement à la livraison disponible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingDetail;

