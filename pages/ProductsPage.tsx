import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaWhatsapp, FaShip } from 'react-icons/fa';
import { useProducts } from '../src/hooks/useProducts';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductCard from '../components/cards/ProductCard';

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

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  
  const WHATSAPP_NUMBER = '14374442288';

  const { products, loading, error } = useProducts({
    category: selectedCategory
  });

  const filteredProducts = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header avec image de fond */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 py-16 lg:py-20 overflow-hidden">
        {/* Image de fond */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1920')] bg-cover bg-center opacity-15"
        ></div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
        
        {/* Formes décoratives */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-primary-400/20">
              <FaShip className="text-sm" /> Port de Jebel Ali, Dubai
            </span>
            <h1 className="text-3xl lg:text-5xl font-extrabold text-white mb-3">
              Tous nos produits
            </h1>
            <p className="text-gray-300 text-lg">
              Importés de Dubai • Livrés chez vous en 35 jours
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Recherche + Catégories */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          {/* Barre de recherche */}
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Catégories */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compteur */}
        <p className="text-sm text-gray-500 mb-4">
          <strong className="text-primary-600 text-base">{filteredProducts.length}</strong> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          {selectedCategory !== 'all' && (
            <span className="text-gray-400"> • {CATEGORIES.find(c => c.value === selectedCategory)?.label}</span>
          )}
        </p>

        {/* Résultats */}
        {loading ? (
          <LoadingSpinner message="Chargement des produits..." />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500">Erreur: {error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-5xl mb-3">📦</p>
            <p className="text-gray-500">Aucun produit trouvé.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearch(''); }}
              className="text-primary-500 mt-2 font-semibold hover:underline"
            >
              Voir tous les produits
            </button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* CTA WhatsApp */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl p-8 md:p-10 text-center text-white relative overflow-hidden"
        >
          {/* Formes décoratives */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Besoin d'un produit spécifique ?
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Nous importons tous types de biens depuis le Port de Jebel Ali à Dubai.
              Contactez-nous pour un devis gratuit !
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Bonjour! Je voudrais un devis pour un produit spécifique.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <FaWhatsapp className="text-xl" /> Contactez-nous sur WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductsPage;