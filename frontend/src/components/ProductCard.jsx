import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  // Vérifier si toutes les tailles sont épuisées
  const isOutOfStock = (() => {
    // Si le produit n'a pas de tailles, considérer comme disponible
    if (!product.sizes || product.sizes.length === 0) {
      return false;
    }
    // Si toutes les tailles ont un stock de 0, le produit est épuisé
    const stockBySize = product.stockBySize || {};
    return product.sizes.every(size => {
      const stock = stockBySize[size];
      return stock !== undefined && stock !== null && stock === 0;
    });
  })();
  const [hovered, setHovered] = useState(false);

  // Image alternative pour le hover (placeholder pour l'instant)
  const hoverImage = product.images?.[1] || product.images?.[0] || 'https://via.placeholder.com/400?text=Person+Wearing+Product';
  const defaultImage = product.images?.[0] || 'https://via.placeholder.com/400';

  return (
    <Link to={`/produit/${product._id}`} className="group block">
      <div className="animate-fade-in">
        {/* Image - Sans bordure avec effet hover */}
        <div 
          className="relative overflow-hidden aspect-square bg-gray-100 mb-3"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={hovered ? hoverImage : defaultImage}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          
          {/* Badge SOLD OUT */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-xs font-bold uppercase flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              SOLD OUT
            </div>
          )}
        </div>

        {/* Nom + Prix - Simple et épuré */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600">
            {product.price} TND
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
