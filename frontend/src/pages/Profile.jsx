import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Package, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Mon Profil</h1>

        <div className="grid gap-6">
          {/* Informations personnelles */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-medium" />
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-medium" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-medium" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Historique des commandes */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Mes commandes
            </h2>
            <p className="text-gray-medium">Vous n'avez pas encore passé de commande.</p>
            {/* TODO: Ajouter la liste des commandes */}
          </div>

          {/* Actions */}
          <button
            onClick={logout}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <LogOut className="h-5 w-5" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

