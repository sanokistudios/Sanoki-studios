import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const ProductCard = ({ product }) => {
  // Vérifier si le produit est en rupture
  const isOutOfStock = product.stock !== null && product.stock === 0;

  return (
    <Link to={`/produit/${product._id}`} className="group block">
      <div className="animate-fade-in">
        {/* Image - Sans bordure */}
        <div className="relative overflow-hidden aspect-square bg-gray-100 mb-3">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
          />
          
          {/* Badge rupture de stock */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 text-xs font-bold uppercase flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              EN RUPTURE
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

