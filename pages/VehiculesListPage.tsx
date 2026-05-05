import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaFilter, FaTimes, 
  FaTags, FaGasPump, FaCog, FaDollarSign, FaShip 
} from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import VehicleCard from '../components/cards/VehicleCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import type { Vehicle } from '../types/vehicle';

type Filters = {
  category: string;
  brand: string;
  fuel: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  search: string;
};

const CATEGORIES = [
  { value: 'all', label: '🚗 Tous' },
  { value: 'Berline', label: '🚘 Berlines' },
  { value: 'SUV', label: '🚙 SUV' },
  { value: '4x4', label: '🛻 4x4' },
  { value: 'Van', label: '🚌 Vans' },
  { value: 'Citadine', label: '🚗 Citadines' },
  { value: 'Coupé', label: '🏎️ Coupés' },
  { value: 'Pick-up', label: '🛻 Pick-ups' },
];

const BRANDS = ['Toutes', 'Toyota', 'Mercedes-Benz', 'BMW', 'Hyundai', 'Honda', 'Nissan', 'Ford', 'Volkswagen', 'Audi'];
const FUELS = ['Tous', 'Essence', 'Diesel', 'Hybride', 'Électrique'];
const TRANSMISSIONS = ['Toutes', 'Manuelle', 'Automatique'];

const ProductListPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    brand: 'Toutes',
    fuel: 'Tous',
    transmission: 'Toutes',
    minPrice: 0,
    maxPrice: 100000000,
    search: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    setLoading(true);
    
    let query = supabase
      .from('vehicles')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.brand !== 'Toutes') {
      query = query.eq('brand', filters.brand);
    }
    if (filters.fuel !== 'Tous') {
      query = query.eq('fuel', filters.fuel);
    }
    if (filters.transmission !== 'Toutes') {
      query = query.eq('transmission', filters.transmission);
    }
    if (filters.minPrice > 0) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice < 100000000) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.search) {
      query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setVehicles(data as Vehicle[]);
    } else {
      console.error('Erreur:', error);
      setVehicles([]);
    }
    setLoading(false);
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      brand: 'Toutes',
      fuel: 'Tous',
      transmission: 'Toutes',
      minPrice: 0,
      maxPrice: 100000000,
      search: ''
    });
    setShowFilters(false);
  };

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.brand !== 'Toutes',
    filters.fuel !== 'Tous',
    filters.transmission !== 'Toutes',
    filters.minPrice > 0,
    filters.maxPrice < 100000000
  ].filter(Boolean).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header avec image de fond */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 py-16 lg:py-20 overflow-hidden">
        {/* Image de fond */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')] bg-cover bg-center opacity-20"
        ></div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
        
        {/* Formes décoratives */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>

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
              Nos véhicules disponibles
            </h1>
            <p className="text-gray-300 text-lg">
              Importés directement de Dubai • Livrés chez vous en 35 jours
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Barre de recherche + catégories + bouton filtres */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          {/* Ligne 1 : Recherche + bouton filtres */}
          <div className="flex gap-3 mb-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une marque ou un modèle..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                showFilters
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <FaFilter />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="bg-yellow-400 text-gray-900 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Ligne 2 : Catégories (scrollable horizontal) */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat.value}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.value }))}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filters.category === cat.value
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Panneau filtres avancés */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl p-5 mb-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FaFilter className="text-primary-500 text-sm" /> Filtres avancés
                </h3>
                {activeFiltersCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-red-500 font-semibold">
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
                    <FaTags className="text-primary-400" /> Marque
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  >
                    {BRANDS.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
                    <FaGasPump className="text-primary-400" /> Carburant
                  </label>
                  <select
                    value={filters.fuel}
                    onChange={(e) => setFilters(prev => ({ ...prev, fuel: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  >
                    {FUELS.map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
                    <FaCog className="text-primary-400" /> Transmission
                  </label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters(prev => ({ ...prev, transmission: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  >
                    {TRANSMISSIONS.map(trans => (
                      <option key={trans} value={trans}>{trans}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5">
                    <FaDollarSign className="text-primary-400" /> Prix max
                  </label>
                  <select
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="100000000">Tous les prix</option>
                    <option value="5000000">Moins de 5M FCFA</option>
                    <option value="10000000">Moins de 10M FCFA</option>
                    <option value="15000000">Moins de 15M FCFA</option>
                    <option value="20000000">Moins de 20M FCFA</option>
                    <option value="30000000">Moins de 30M FCFA</option>
                    <option value="50000000">Moins de 50M FCFA</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Résultats */}
        {loading ? (
          <LoadingSpinner message="Chargement des véhicules..." />
        ) : vehicles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-5xl mb-3">🔍</p>
            <h3 className="text-xl font-bold text-gray-700 mb-1">Aucun véhicule trouvé</h3>
            <p className="text-gray-500 mb-4">Modifiez vos critères de recherche.</p>
            <button
              onClick={resetFilters}
              className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-600 transition"
            >
              Voir tous les véhicules
            </button>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                <strong className="text-primary-600 text-base">{vehicles.length}</strong> véhicule{vehicles.length > 1 ? 's' : ''} trouvé{vehicles.length > 1 ? 's' : ''}
                {filters.category !== 'all' && (
                  <span className="text-gray-400"> • {CATEGORIES.find(c => c.value === filters.category)?.label}</span>
                )}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vehicles.map((vehicle, index) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;