import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import type { Product } from '../../types/vehicle';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addProduct, cart } = useCart();
  const [added, setAdded] = useState(false);

  const isInCart = cart.items.some(
    item => item.type === 'product' && item.product?.id === product.id
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addProduct(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-gray-100 hover:border-primary-300 transition-all"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badge catégorie */}
        <span className="absolute top-3 left-3 bg-primary-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {product.category}
        </span>
        
        {/* Badge promotion */}
        {product.badge && (
          <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
            product.badge === 'Premium' || product.badge === 'Best Seller' || product.badge === 'Top vente'
              ? 'bg-yellow-400 text-gray-900'
              : product.badge === 'Promo' || product.badge === 'Bon plan'
                ? 'bg-red-500 text-white'
                : product.badge === 'Nouveau' || product.badge === 'Essentiel'
                  ? 'bg-green-500 text-white'
                  : product.badge === 'Pratique'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-900 text-white'
          }`}>
            {product.badge}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">
          {product.name}
        </h3>
        
        <p className="text-primary-600 font-extrabold text-2xl mb-4">
          {formatPrice(product.price)}
        </p>

        {/* Boutons Détails + Ajouter au panier */}
        <div className="flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
          >
            Détails
          </Link>
          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-semibold transition text-sm ${
              added
                ? 'bg-green-500 text-white'
                : isInCart
                  ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {added ? (
              <>
                <FaCheck /> Ajouté !
              </>
            ) : (
              <>
                <FaShoppingCart /> {isInCart ? ' +1' : 'Ajouter'}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;