import { Link, useNavigate } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collectionsAPI } from '../utils/api';
// Logo animé GIF

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

  const [collections, setCollections] = useState([]);

  // Charger les collections depuis l'API
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const response = await collectionsAPI.getAll();
        console.log('Collections chargées:', response.data);
        setCollections(response.data.collections || []);
      } catch (error) {
        console.error('Erreur lors du chargement des collections:', error);
        setCollections([]);
      }
    };
    loadCollections();
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Gauche: Hamburger & Search (sans nom de marque) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-9 h-9" />
                ) : (
                  <img 
                    src="/images/icone_menu_hamburger.png" 
                    alt="Menu" 
                    className="w-9 h-9"
                  />
                )}
              </button>
              
              {/* Icône recherche */}
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Rechercher">
                <img 
                  src="/images/icone_loupe.png" 
                  alt="Rechercher" 
                  className="w-9 h-9"
                />
              </button>
            </div>

            {/* Centre: Logo animé GIF */}
            <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
              <img 
                src="/images/logo.gif" 
                alt="Logo" 
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Droite: Compte utilisateur + Panier */}
            <div className="flex items-center gap-1 sm:space-x-2 md:space-x-4">
              {/* Compte utilisateur - Icône personne au lieu de "Connexion" */}
              <div className="relative" ref={dropdownRef}>
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1 px-2 md:px-3 py-2 text-primary hover:bg-gray-100 rounded-none transition-colors"
                    >
                      <img 
                        src="/images/icone_profil.png" 
                        alt="Profil" 
                        className="w-9 h-9"
                      />
                      <span className="hidden sm:inline font-medium text-sm">{user?.name}</span>
                      <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown */}
                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50 animate-fade-in">
                        <div className="py-1">
                          <Link
                            to="/profil"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            Mon Profil
                          </Link>
                          <Link
                            to="/profil"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            Mes Commandes
                          </Link>
                          {user?.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="block px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              Dashboard Admin
                            </Link>
                          )}
                          <hr className="my-1" />
                          <button
                            onClick={handleLogout}
                            className="block px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/connexion"
                    className="flex items-center p-2 text-primary hover:bg-gray-100 rounded-none transition-colors"
                  >
                    <img 
                      src="/images/icone_profil.png" 
                      alt="Connexion" 
                      className="w-9 h-9"
                    />
                  </Link>
                )}
              </div>

              {/* Panier - Icône sac */}
              <button
                onClick={toggleCart}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img 
                  src="/images/icone_panier.png" 
                  alt="Panier" 
                  className="w-9 h-9"
                />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-primary">Navigation</h2>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-9 h-9" />
                    </button>
                  </div>

                  {/* ALL - Lien vers la boutique */}
                  <div className="mb-6">
                    <Link
                      to="/boutique"
                      className="block py-2 px-4 text-base text-gray-dark hover:bg-gray-100 hover:text-accent transition-colors rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ALL
                    </Link>
                  </div>

                  {/* Collections */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Collections</h3>
                    {collections.length > 0 ? (
                      <nav className="space-y-1">
                        {collections.map((collection) => (
                          <Link
                            key={collection._id || collection.name}
                            to={`/boutique?collection=${collection.slug || collection.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block py-2 px-4 text-base text-gray-dark hover:bg-gray-100 hover:text-accent transition-colors rounded-lg cursor-pointer"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {collection.name}
                          </Link>
                        ))}
                      </nav>
                    ) : (
                      <p className="text-sm text-gray-400 px-4">Aucune collection disponible</p>
                    )}
                  </div>
                  
                  {/* MORE */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">MORE</h3>
                    <nav className="space-y-1">
                      <Link
                        to="/a-propos"
                        className="block py-2 px-4 text-base text-gray-dark hover:bg-gray-100 hover:text-accent transition-colors rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        About Us
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
      </nav>
    </header>
  );
};

export default Header;

