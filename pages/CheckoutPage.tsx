import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaWhatsapp, FaShip, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabaseClient';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const WHATSAPP_NUMBER = '14374442288';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Obtenir le nom d'un item (véhicule ou produit)
  const getItemName = (item: typeof cart.items[0]) => {
    if (item.type === 'vehicle') {
      return `${item.vehicle.brand} ${item.vehicle.model} (${item.vehicle.year})`;
    }
    return item.product.name;
  };

  // Obtenir le prix d'un item
  const getItemPrice = (item: typeof cart.items[0]) => {
    return item.type === 'vehicle' ? item.vehicle.price : item.product.price;
  };

  // Obtenir l'ID d'un item
  const getItemId = (item: typeof cart.items[0]) => {
    return item.type === 'vehicle' ? item.vehicle.id : item.product.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone) return;
    
    setSubmitting(true);

    try {
      // Créer la commande dans Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email,
          total_amount: cart.totalAmount,
          notes: form.notes,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Ajouter les articles (véhicules ET produits)
      const orderItems = cart.items.map(item => ({
        order_id: order.id,
        vehicle_id: item.type === 'vehicle' ? item.vehicle.id : null,
        product_id: item.type === 'product' ? item.product.id : null,
        quantity: item.quantity,
        price: getItemPrice(item)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Générer le message WhatsApp
      const itemsList = cart.items
        .map(item => {
          const name = getItemName(item);
          const price = getItemPrice(item);
          return `  - ${name} x${item.quantity}: ${formatPrice(price * item.quantity)}`;
        })
        .join('\n');

      const message = 
        `🛒 *Nouvelle commande #${order.id.slice(0, 8)}*\n\n` +
        `👤 *Client:* ${form.name || 'Non spécifié'}\n` +
        `📞 *Téléphone:* ${form.phone}\n` +
        `📧 *Email:* ${form.email || 'Non spécifié'}\n\n` +
        `📦 *Articles:*\n${itemsList}\n\n` +
        `💰 *Total:* ${formatPrice(cart.totalAmount)}\n` +
        `🚢 *Livraison:* 35 jours depuis Dubai\n\n` +
        `📝 *Notes:* ${form.notes || 'Aucune'}\n\n` +
        `🏷️ *Élite Transit Service (CMA&CGM)*\n` +
        `📍 Port de Jebel Ali, Dubai 🇦🇪`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      setSuccess(true);
      clearCart();
      
      // Ouvrir WhatsApp après 1.5s
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

    } catch (error) {
      console.error('Erreur commande:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.items.length === 0 && !success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-8">Ajoutez des véhicules ou produits avant de commander.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/vehicles"
            className="bg-primary-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-600 transition"
          >
            Voir les véhicules
          </Link>
          <Link
            to="/products"
            className="bg-primary-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-600 transition"
          >
            Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FaCheckCircle className="text-green-500 text-5xl" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Commande envoyée avec succès !</h2>
        <p className="text-gray-600 mb-4">
          Un message WhatsApp va s'ouvrir automatiquement avec le récapitulatif de votre commande.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Notre équipe vous contactera dans les plus brefs délais pour finaliser votre commande.
          <br />
          <span className="text-primary-500">Livraison estimée : 35 jours</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/vehicles"
            className="inline-block bg-primary-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-600 transition"
          >
            Voir les véhicules
          </Link>
          <Link
            to="/products"
            className="inline-block bg-white border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-primary-50 transition"
          >
            Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-500">Accueil</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-primary-500">Panier</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Checkout</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Finaliser la commande</h1>
        <p className="text-gray-500 mb-8">
          Remplissez vos coordonnées pour recevoir votre confirmation sur WhatsApp.
        </p>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition text-sm"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Numéro WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition text-sm"
                  placeholder="Ex: +229 97 00 00 00"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Nous vous contacterons sur ce numéro pour confirmer la commande.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email <span className="text-gray-400">(optionnel)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition text-sm"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Notes ou précisions
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition text-sm resize-none"
                  placeholder="Couleur préférée, options souhaitées, mode de paiement..."
                />
              </div>

              {/* Infos livraison */}
              <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
                <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm mb-1">
                  <FaShip /> Informations de livraison
                </div>
                <p className="text-primary-600 text-xs">
                  🚢 Départ du Port de Jebel Ali, Dubai 🇦🇪
                  <br />
                  📦 Livraison estimée : <strong>35 jours</strong>
                  <br />
                  🔒 Paiement sécurisé • Aucun intermédiaire en Afrique
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || !form.phone}
                className="w-full bg-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FaWhatsapp className="text-xl" /> Commander via WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-primary-500" /> Récapitulatif
              </h3>
              
              <div className="space-y-3 mb-4">
                {cart.items.map((item) => {
                  const id = getItemId(item);
                  const name = getItemName(item);
                  const price = getItemPrice(item);
                  
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">
                        {name}
                        <span className="text-gray-400 ml-1">x{item.quantity}</span>
                      </span>
                      <span className="text-gray-900 font-semibold flex-shrink-0">
                        {formatPrice(price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <hr className="border-gray-200 mb-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Livraison</span>
                  <span className="font-semibold">Incluse</span>
                </div>
              </div>
              
              <hr className="border-gray-200 mb-4" />
              
              <div className="flex justify-between text-lg font-extrabold">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(cart.totalAmount)}</span>
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center">
                🚢 Expédition depuis le Port de Jebel Ali, Dubai
                <br />
                📦 Délai de livraison : 35 jours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;