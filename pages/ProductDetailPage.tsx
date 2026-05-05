import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft, FaWhatsapp, FaShoppingCart,
  FaTruck, FaBox,
  FaTag, 
} from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../src/components/ui/LoadingSpinner';
import type { Product } from '../types/vehicle';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct, cart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const isInCart = cart.items.some(
    item => item.type === 'product' && item.product?.id === product?.id
  );

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (!error && data) {
      setProduct(data as Product);
    }
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addProduct(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Bonjour! Je suis intéressé par:\n\n` +
      `📦 *${product.name}*\n` +
      `💰 Prix: ${formatPrice(product.price)}\n` +
      `📂 Catégorie: ${product.category}\n\n` +
      `Pouvez-vous me donner plus d'informations ?`
    );
    window.open(`https://wa.me/229XXXXXXXX?text=${message}`, '_blank');
  };

  if (loading) return <LoadingSpinner message="Chargement du produit..." />;
  
  if (!product) return (
    <div className="text-center py-20">
      <p className="text-2xl text-gray-500">Produit non trouvé</p>
      <Link to="/products" className="mt-4 inline-block text-primary-500 font-semibold">
        Retour aux produits
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-500">Accueil</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-500">Produits</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-500 mb-6 font-semibold transition"
        >
          <FaArrowLeft /> Retour
        </button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  {product.category}
                </span>
                {product.badge && (
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                    product.badge === 'Premium' || product.badge === 'Best Seller' || product.badge === 'Top vente'
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-red-500 text-white'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Infos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg"
          >
            {/* Catégorie */}
            <span className="inline-block bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              {product.category}
            </span>

            {/* Nom */}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Prix */}
            <p className="text-4xl font-extrabold text-primary-600 mb-8">
              {formatPrice(product.price)}
            </p>

            {/* Caractéristiques */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <FaBox className="text-primary-500 text-lg mb-1" />
                <span className="block text-xs text-gray-500">Catégorie</span>
                <span className="font-bold text-gray-900">{product.category}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <FaTag className="text-primary-500 text-lg mb-1" />
                <span className="block text-xs text-gray-500">État</span>
                <span className="font-bold text-green-600">Neuf</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Livraison info */}
            <div className="bg-primary-50 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-2 text-primary-700 font-semibold mb-2">
                <FaTruck /> Livraison express
              </div>
              <p className="text-primary-600 text-sm">
                Importé de Dubai • Livré chez vous en 48-72h
              </p>
            </div>

            {/* Boutons action */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition ${
                  added
                    ? 'bg-green-500 text-white'
                    : isInCart
                      ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                <FaShoppingCart />
                {added ? 'Ajouté !' : isInCart ? 'Ajouté au panier - Voir le panier' : 'Ajouter au panier'}
              </button>
              
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition"
              >
                <FaWhatsapp className="text-xl" /> Commander sur WhatsApp
              </button>
            </div>

            {/* Garanties */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                '✅ Produit neuf',
                '🔒 Transaction sécurisée',
                '🚚 Livraison 48-72h',
                '💯 Satisfait ou remboursé'
              ].map((item, i) => (
                <span key={i} className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Produits similaires (optionnel) */}
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition"
          >
            ← Voir tous les produits
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;