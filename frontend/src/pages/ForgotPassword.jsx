import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <Mail className="mx-auto h-16 w-16 text-accent mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">Email envoyé !</h2>
          <p className="text-gray-medium mb-6">
            Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
          </p>
          <Link to="/connexion" className="text-accent hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Mot de passe oublié ?</h2>
          <p className="mt-2 text-gray-medium">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="Votre email"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        <Link to="/connexion" className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-medium hover:text-accent">
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;

