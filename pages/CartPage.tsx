import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Fonction pour obtenir l'ID unique d'un item (véhicule ou produit)
  const getItemId = (item: typeof cart.items[0]) => {
    return item.type === 'vehicle' ? item.vehicle.id : item.product.id;
  };

  // Fonction pour obtenir le nom d'un item
  const getItemName = (item: typeof cart.items[0]) => {
    if (item.type === 'vehicle') {
      return `${item.vehicle.brand} ${item.vehicle.model}`;
    }
    return item.product.name;
  };

  // Fonction pour obtenir l'image d'un item
  const getItemImage = (item: typeof cart.items[0]) => {
    if (item.type === 'vehicle') {
      return item.vehicle.images?.[0] || '/placeholder-car.jpg';
    }
    return item.product.image || '/placeholder.jpg';
  };

  // Fonction pour obtenir le prix unitaire d'un item
  const getItemPrice = (item: typeof cart.items[0]) => {
    return item.type === 'vehicle' ? item.vehicle.price : item.product.price;
  };

  // Fonction pour obtenir le lien de détail
  const getItemLink = (item: typeof cart.items[0]) => {
    return item.type === 'vehicle'
      ? `/vehicles/${item.vehicle.id}`
      : `/products/${item.product.id}`;
  };

  // Fonction pour obtenir les détails (année, carburant, etc.)
  const getItemDetails = (item: typeof cart.items[0]) => {
    if (item.type === 'vehicle') {
      return `${item.vehicle.year} • ${item.vehicle.fuel} • ${item.vehicle.transmission}`;
    }
    return item.product.category;
  };

  // Générer le message WhatsApp
  const generateWhatsAppMessage = () => {
    const itemsList = cart.items
      .map(item => {
        const name = getItemName(item);
        const price = getItemPrice(item);
        return `- ${name} (x${item.quantity}): ${formatPrice(price * item.quantity)}`;
      })
      .join('\n');

    return encodeURIComponent(
      `Bonjour! Je voudrais commander:\n\n${itemsList}\n\nTotal: ${formatPrice(cart.totalAmount)}`
    );
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8">Parcourez nos véhicules et produits, et ajoutez-les au panier</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-600 transition"
          >
            <FaArrowLeft /> Voir les véhicules
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-600 transition"
          >
            <FaArrowLeft /> Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Mon Panier</h1>
      <p className="text-gray-500 mb-8">{cart.totalItems} article{ cart.totalItems > 1 ? 's' : ''} dans votre panier</p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const id = getItemId(item);
            const name = getItemName(item);
            const image = getItemImage(item);
            const price = getItemPrice(item);
            const link = getItemLink(item);
            const details = getItemDetails(item);

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4"
              >
                {/* Image */}
                <img
                  src={image}
                  alt={name}
                  className="w-32 h-24 object-cover rounded-xl flex-shrink-0"
                />

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={link}
                    className="font-bold text-gray-900 hover:text-primary-500 text-sm line-clamp-2"
                  >
                    {name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">{details}</p>
                  <p className="text-primary-600 font-bold mt-1">
                    {formatPrice(price)}
                  </p>
                  <span className="text-xs text-gray-400">
                    Total: {formatPrice(price * item.quantity)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <button
                    onClick={() => removeFromCart(id)}
                    className="text-gray-400 hover:text-red-500 transition p-1"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => updateQuantity(id, item.quantity - 1)}
                      className="px-2.5 py-1 hover:bg-gray-200 rounded-l-lg font-bold text-sm transition"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm min-w-[1.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(id, item.quantity + 1)}
                      className="px-2.5 py-1 hover:bg-gray-200 rounded-r-lg font-bold text-sm transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition flex items-center gap-1"
          >
            <FaTrash className="text-xs" /> Vider le panier
          </button>
        </div>

        {/* Résumé */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h3>
          
          <div className="space-y-3 mb-6">
            {cart.items.map(item => {
              const name = getItemName(item);
              const price = getItemPrice(item);
              return (
                <div key={getItemId(item)} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate mr-2">
                    {name} <span className="text-gray-400">x{item.quantity}</span>
                  </span>
                  <span className="flex-shrink-0">{formatPrice(price * item.quantity)}</span>
                </div>
              );
            })}
            
            <hr className="border-gray-200" />
            
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span className="text-green-600 font-semibold">Gratuite</span>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="flex justify-between text-xl font-extrabold">
              <span>Total</span>
              <span className="text-primary-600">{formatPrice(cart.totalAmount)}</span>
            </div>
          </div>

          {/* Bouton Commander (checkout) */}
          <Link
            to="/checkout"
            className="w-full bg-primary-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-600 transition mb-3 shadow-lg shadow-primary-500/25"
          >
            Commander <FaArrowRight />
          </Link>

          {/* Bouton WhatsApp direct */}
          <a
            href={`https://wa.me/229XXXXXXXX?text=${generateWhatsAppMessage()}`}
            className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-400 transition shadow-lg shadow-green-500/25"
          >
            <FaWhatsapp className="text-xl" /> Commander via WhatsApp
          </a>

          {/* Liens pour continuer le shopping */}
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/vehicles"
              className="text-sm text-gray-400 hover:text-primary-500 transition text-center"
            >
              ← Continuer les achats de véhicules
            </Link>
            <Link
              to="/products"
              className="text-sm text-gray-400 hover:text-primary-500 transition text-center"
            >
              ← Voir les produits électroniques
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;