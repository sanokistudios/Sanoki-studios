import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogIn, Search, LayoutDashboard, ChevronDown, Package, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'; // On va ajouter le logo

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { getCartCount, toggleCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  // Navigation simplifiée pour le menu hamburger
  const navigation = [
    { name: 'Boutique', path: '/boutique' },
    { name: 'About Us', path: '/a-propos' }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
            {/* Gauche: Hamburger + Search */}
            <div className="flex items-center gap-3">
              {/* Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              
              {/* Bouton Search */}
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-6 h-6" />
              </button>
            </div>

            {/* Centre: Logo seul (agrandi) */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
              <img 
                src={logo} 
                alt="Sanoki Studios" 
                className="h-20 w-auto object-contain"
              />
            </Link>

            {/* Droite: Compte utilisateur + Panier */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Compte utilisateur */}
              <div className="relative" ref={dropdownRef}>
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden sm:inline font-medium">{user?.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50 animate-fade-in">
                        <div className="py-1">
                          <Link
                            to="/profil"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Mon Profil</span>
                          </Link>
                          <Link
                            to="/profil"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <Package className="w-4 h-4" />
                            <span>Mes Commandes</span>
                          </Link>
                          {user?.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              <span>Dashboard Admin</span>
                            </Link>
                          )}
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/connexion"
                    className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Connexion</span>
                  </Link>
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
          </div>
        </div>

          {/* Menu Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMobileMenuOpen(false)}>
              <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl animate-slide-in-left" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  {/* Header du menu */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-primary">Navigation</h2>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Navigation - Seulement les liens de navigation */}
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="block py-4 px-4 text-lg text-gray-dark hover:bg-gray-100 hover:text-accent transition-colors rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
      </nav>
    </header>
  );
};

export default Header;

