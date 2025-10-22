import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
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
          
          {/* Badge rupture si nécessaire */}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-medium uppercase">
              Rupture
            </span>
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

