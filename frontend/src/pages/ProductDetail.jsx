import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Package, Truck } from 'lucide-react';
import { productsAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data.product);
      // Sélectionner par défaut la première taille et couleur
      if (response.data.product.sizes?.length > 0) {
        setSelectedSize(response.data.product.sizes[0]);
      }
      if (response.data.product.colors?.length > 0) {
        setSelectedColor(response.data.product.colors[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      toast.error('Produit introuvable');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Veuillez sélectionner une taille');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error('Veuillez sélectionner une couleur');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Produit introuvable</h2>
        <Link to="/boutique" className="btn-primary">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <Link
        to="/boutique"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à la boutique
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-light rounded-lg overflow-hidden mb-4">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-accent' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-accent mb-6">
            {product.price} TND
          </p>

          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Tailles - Boutons carrés sans arrondi */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Taille
              </label>
              <div className="flex gap-2">
                {product.sizes.map((size) => {
                  // Vérifier si la taille est en stock
                  const sizeStock = product.stockBySize?.[size];
                  const isSizeOutOfStock = sizeStock !== undefined && sizeStock !== null && sizeStock === 0;
                  const isSizeDisabled = isSizeOutOfStock;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => !isSizeDisabled && setSelectedSize(size)}
                      disabled={isSizeDisabled}
                      className={`px-4 py-2 border-2 font-medium transition-all ${
                        isSizeDisabled
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Couleurs - Boutons carrés sans arrondi */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Couleur
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 font-medium transition-all ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantité - Boutons carrés sans arrondi */}
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

          {/* Stock - MASQUÉ pour les utilisateurs (interne uniquement) */}

          {/* Vérifier si toutes les tailles sont épuisées */}
          {(() => {
            const stockBySize = product.stockBySize || {};
            const allSizesOutOfStock = product.sizes && product.sizes.length > 0 && 
              product.sizes.every(size => {
                const stock = stockBySize[size];
                return stock !== undefined && stock !== null && stock === 0;
              });
            
            return allSizesOutOfStock ? (
              <div className="w-full bg-red-50 border-2 border-red-500 text-red-700 py-4 px-6 text-center font-bold uppercase">
                PRODUIT ÉPUISÉ
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={
                  selectedSize && product.stockBySize?.[selectedSize] === 0
                }
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                {selectedSize && product.stockBySize?.[selectedSize] === 0 
                  ? 'Taille épuisée' 
                  : 'Ajouter au panier'}
              </button>
            );
          })()}

          {/* Composition */}
          {product.composition && (
            <div className="mt-8">
              <h3 className="text-sm font-bold mb-2">COMPOSITION</h3>
              <div className="text-xs text-gray-700 whitespace-pre-line">
                {product.composition}
              </div>
            </div>
          )}

          {/* Guide des tailles */}
          {product.sizeGuide && ((product.sizeGuide.referenceModel && product.sizeGuide.referenceModel.name) || (product.sizeGuide.sizeRange && Object.keys(product.sizeGuide.sizeRange).length > 0)) && (
            <div className="mt-8">
              <h3 className="text-sm font-bold mb-2">INFORMATIONS SUR LES TAILLES</h3>
              {product.sizeGuide.referenceModel && product.sizeGuide.referenceModel.name && (
                <div className="mb-4 text-xs text-gray-700">
                  <p className="font-semibold mb-2">
                    {product.sizeGuide.referenceModel.name.toUpperCase()} (FOND BLANC) MESURE {product.sizeGuide.referenceModel.height || ''}, 
                    PÈSE {product.sizeGuide.referenceModel.weight || ''} ET PORTE UNE TAILLE {product.sizeGuide.referenceModel.size || ''}.
                  </p>
                </div>
              )}
              {product.sizeGuide.sizeRange && Object.keys(product.sizeGuide.sizeRange).length > 0 && (
                <div className="text-xs text-gray-700">
                  <p className="font-semibold mb-2">PLAGE DE TAILLES (BASÉE SUR LES COMMANDES USUELLES) :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(product.sizeGuide.sizeRange).map(([range, size]) => (
                      <li key={range}>
                        {range}: {size}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Instructions de lavage */}
          {product.washingInstructions && (
            <div className="mt-8">
              <h3 className="text-sm font-bold mb-2">INFORMATIONS DE LAVAGE</h3>
              <div className="text-xs text-gray-700 space-y-3">
                {product.washingInstructions.handWash && (
                  <div>
                    <p className="font-semibold">LAVAGE À LA MAIN RECOMMANDÉ :</p>
                    <p>{product.washingInstructions.handWash}</p>
                  </div>
                )}
                {product.washingInstructions.machineWash && (
                  <div>
                    <p className="font-semibold">LAVAGE EN MACHINE :</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {product.washingInstructions.machineWash.temperature && (
                        <li>TEMPERATURE : MAX {product.washingInstructions.machineWash.temperature}</li>
                      )}
                      {product.washingInstructions.machineWash.cycle && (
                        <li>CYCLE : {product.washingInstructions.machineWash.cycle}</li>
                      )}
                      {product.washingInstructions.machineWash.spin && (
                        <li>ESSORAGE : {product.washingInstructions.machineWash.spin}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
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

export default ProductDetail;

