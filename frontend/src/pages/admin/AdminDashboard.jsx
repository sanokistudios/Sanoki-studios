import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, MessageSquare, LogOut, Home, ShoppingCart } from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Produits', path: '/admin/produits', icon: Package },
    { name: 'Commandes', path: '/admin/commandes', icon: ShoppingCart },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Administration</h1>
              <p className="text-sm text-gray-300">Connecté en tant que {user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex gap-2 bg-white rounded-lg p-2 shadow-md">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-accent text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Contenu */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

