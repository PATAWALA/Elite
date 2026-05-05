import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaWhatsapp } from 'react-icons/fa';
import { useProducts } from '../../hooks/useProducts';
import LoadingSpinner from '../ui/LoadingSpinner';
import ProductCard from '../cards/ProductCard';

const CATEGORIES = [
  { value: 'all', label: '📱 Tous' },
  { value: 'Téléphones', label: '📱 Téléphones' },
  { value: 'Informatique', label: '💻 Informatique' },
  { value: 'TV & Audio', label: '📺 TV & Audio' },
  { value: 'Électroménager', label: '🔌 Électroménager' },
  { value: 'Gaming', label: '🎮 Gaming' },
  { value: 'Montres', label: '⌚ Montres' },
  { value: 'Maison', label: '🏠 Maison' },
];

const OtherProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { products, loading, error } = useProducts({
    category: selectedCategory,
    limit: 3
  });

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre + Filtres */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="text-primary-500 font-bold text-sm uppercase tracking-widest">
              Plus de produits
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold mt-2 text-gray-900">
              Électronique & Électroménager
            </h2>
            <p className="text-gray-500 mt-1">
              Importés depuis Dubai, livrés chez vous
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grille 3 colonnes */}
        {loading ? (
          <LoadingSpinner message="Chargement des produits..." />
        ) : error ? (
          <p className="text-center text-red-500 py-12">Erreur: {error}</p>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-5xl mb-3">📦</p>
            <p className="text-gray-500">Aucun produit dans cette catégorie.</p>
            <button onClick={() => setSelectedCategory('all')} className="text-primary-500 mt-2 font-semibold hover:underline">
              Voir tous les produits
            </button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Voir tout */}
        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
          >
            Voir tous les produits <FaArrowRight />
          </Link>
        </div>

        {/* Bannière WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 md:p-10 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Vous cherchez autre chose ?
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Nous importons tous types de biens depuis Dubai : meubles, vêtements, pièces détachées, matériel pro...
            </p>
            <a
              href="https://wa.me/229XXXXXXXX?text=Bonjour!%20Je%20voudrais%20un%20devis%20pour%20un%20produit%20sp%C3%A9cifique."
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <FaWhatsapp className="text-2xl" /> Demander un devis
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OtherProducts;