import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount, toggleCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const navigation = [
    { name: 'Accueil', path: '/' },
    { name: 'Boutique', path: '/boutique' },
    { name: 'À Propos', path: '/a-propos' }
  ];
  
  // Ajouter Contact uniquement pour les invités
  if (!isAuthenticated) {
    navigation.push({ name: 'Contact', path: '/contact' });
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">
              MARQUE
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-dark hover:text-accent transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Panier, Auth et Menu Mobile */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Auth - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <Link
                  to="/profil"
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.name}</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Connexion</span>
                  </Link>
                  <Link
                    to="/inscription"
                    className="btn-primary"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Inscription</span>
                  </Link>
                </>
              )}
            </div>

            {/* Panier */}
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Menu Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block py-3 text-gray-dark hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth - Mobile */}
            <div className="mt-4 pt-4 border-t space-y-2">
              {isAuthenticated ? (
                <Link
                  to="/profil"
                  className="flex items-center gap-2 py-3 text-gray-dark hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    className="flex items-center gap-2 py-3 text-gray-dark hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Connexion</span>
                  </Link>
                  <Link
                    to="/inscription"
                    className="flex items-center gap-2 py-3 text-gray-dark hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Inscription</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

