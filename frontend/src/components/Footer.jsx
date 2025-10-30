import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* MENTIONS LÉGALES - Remplace MARQUE et Navigation */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-black">MENTIONS LÉGALES</h3>
          <div className="bg-gray-50 p-6 rounded-lg space-y-3">
            <Link to="/mentions-legales" className="block text-gray-700 hover:text-black transition-colors">MENTIONS LÉGALES</Link>
            <Link to="/faq" className="block text-gray-700 hover:text-black transition-colors">FAQ</Link>
            <Link to="/privacy-policy" className="block text-gray-700 hover:text-black transition-colors">PRIVACY POLICY</Link>
            <Link to="/refund-policy" className="block text-gray-700 hover:text-black transition-colors">REFUND POLICY</Link>
            <Link to="/delivery-policy" className="block text-gray-700 hover:text-black transition-colors">DELIVERY POLICY</Link>
            <Link to="/conditions-of-sale" className="block text-gray-700 hover:text-black transition-colors">CONDITIONS OF SALE</Link>
          </div>
        </div>

        {/* Réseaux sociaux - Icônes noires sur fond gris très clair */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-lg font-semibold mb-4 text-black">Suivez-nous</h3>
          <div className="flex space-x-4 ml-auto">
            <a
              href="#"
              className="w-10 h-10 bg-gray-50 text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-all border border-gray-200"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-gray-50 text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-all border border-gray-200"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <Link to="/contact" className="text-sm text-gray-700 hover:text-black transition-colors">CONTACT</Link>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} MARQUE. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
