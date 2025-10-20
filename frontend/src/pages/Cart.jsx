import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">
            Découvrez nos produits et ajoutez-les à votre panier
          </p>
          <Link to="/boutique" className="btn-primary">
            Découvrir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des produits */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.cartId}
              className="bg-white rounded-lg shadow-md p-6 flex gap-6 animate-fade-in"
            >
              <img
                src={item.images?.[0] || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <Link
                  to={`/produit/${item._id}`}
                  className="text-xl font-semibold hover:text-accent"
                >
                  {item.name}
                </Link>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  {item.size && <p>Taille: {item.size}</p>}
                  {item.color && <p>Couleur: {item.color}</p>}
                </div>
                <p className="text-2xl font-bold text-accent mt-3">
                  {item.price} TND
                </p>
              </div>
              <div className="flex flex-col justify-between items-end">
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                    className="w-10 h-10 border-2 rounded-lg hover:bg-gray-100 font-semibold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                    className="w-10 h-10 border-2 rounded-lg hover:bg-gray-100 font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Vider le panier
          </button>
        </div>

        {/* Résumé */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Résumé</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-semibold">{getCartTotal().toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="font-semibold">Calculée à la caisse</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-bold text-accent">
                  {getCartTotal().toFixed(2)} TND
                </span>
              </div>
            </div>

            <Link
              to="/commande"
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              Passer commande
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/boutique"
              className="block text-center mt-4 text-accent hover:underline"
            >
              Continuer mes achats
            </Link>

            <div className="mt-6 p-4 bg-gray-light rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Paiement à la livraison</strong> disponible.
                Vous paierez lors de la réception de votre commande.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

