import { motion } from 'framer-motion';
import { FaWhatsapp, FaShoppingCart } from 'react-icons/fa';
import { Product } from '../../types/vehicle';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [added, setAdded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleOrder = () => {
    const message = encodeURIComponent(
      `Bonjour! Je suis intéressé par:\n\n` +
      `📦 *${product.name}*\n` +
      `💰 Prix: ${formatPrice(product.price)}\n` +
      `📂 Catégorie: ${product.category}\n\n` +
      `Pouvez-vous me donner plus d'informations ?`
    );
    window.open(`https://wa.me/229XXXXXXXX?text=${message}`, '_blank');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badge catégorie */}
        <span className="absolute top-3 left-3 bg-primary-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {product.category}
        </span>
        
        {/* Badge promotion */}
        {product.badge && (
          <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
            product.badge === 'Premium' || product.badge === 'Best Seller'
              ? 'bg-yellow-400 text-gray-900'
              : product.badge === 'Promo'
                ? 'bg-red-500 text-white'
                : product.badge === 'Nouveau'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-900 text-white'
          }`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        <p className="text-primary-600 font-extrabold text-lg mb-3">
          {formatPrice(product.price)}
        </p>

        {/* Boutons */}
        <div className="flex gap-2">
          <button
            onClick={handleOrder}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <FaWhatsapp className="text-sm" />
            {added ? 'Message envoyé !' : 'Commander'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;