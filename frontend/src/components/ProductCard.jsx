import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes?.[0], product.colors?.[0]);
  };

  return (
    <Link to={`/produit/${product._id}`} className="group">
      <div className="card animate-fade-in">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-gray-light">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.featured && (
            <span className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
              Vedette
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Rupture
            </span>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-medium text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {/* Tailles disponibles */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex gap-1 mb-3">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="text-xs px-2 py-1 bg-gray-100 rounded"
                >
                  {size}
                </span>
              ))}
            </div>
          )}

          {/* Prix et bouton */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {product.price} TND
            </span>
            {product.stock > 0 && (
              <button
                onClick={handleQuickAdd}
                className="p-2 bg-primary text-white rounded-full hover:bg-accent transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

