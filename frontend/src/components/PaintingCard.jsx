import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useState } from 'react';

const PaintingCard = ({ painting }) => {
  // Vérifier si la peinture est en rupture
  const isOutOfStock = painting.stock !== null && painting.stock === 0;
  const [hovered, setHovered] = useState(false);

  // Image alternative pour le hover
  const hoverImage = painting.images?.[1] || painting.images?.[0] || 'https://via.placeholder.com/400';
  const defaultImage = painting.images?.[0] || 'https://via.placeholder.com/400';

  return (
    <Link to={`/peinture/${painting._id}`} className="group block">
      <div className="animate-fade-in">
        {/* Image - Sans bordure avec effet hover */}
        <div 
          className="relative overflow-hidden aspect-square bg-gray-100 mb-3"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={hovered ? hoverImage : defaultImage}
            alt={painting.name}
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

        {/* Nom + Prix */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
            {painting.name}
          </h3>
          <p className="text-sm text-gray-600">
            {painting.price} TND
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PaintingCard;

