import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useVehicles } from '../../src/hooks/useVehicles';
import LoadingSpinner from '../ui/LoadingSpinner';
import VehicleCard from '../cards/VehicleCard';

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

const FeaturedVehicles = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { vehicles, loading, error } = useVehicles({
    featured: true,
    category: selectedCategory,
    limit: 3
  });

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre + Filtres sur la même ligne */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="text-primary-500 font-bold text-sm uppercase tracking-widest">
              Notre Sélection
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold mt-2 text-gray-900">
              Véhicules en vedette
            </h2>
            <p className="text-gray-500 mt-1">
              Importés avec soin depuis Dubai
            </p>
          </div>
          
          {/* Filtres catégories */}
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
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grille */}
        {loading ? (
          <LoadingSpinner message="Chargement..." />
        ) : error ? (
          <p className="text-center text-red-500 py-12">Erreur: {error}</p>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">📭</p>
            <p className="text-gray-500">Aucun véhicule dans cette catégorie.</p>
            <button onClick={() => setSelectedCategory('all')} className="text-primary-500 mt-2 font-semibold hover:underline">
              Voir tout
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
            ))}
          </div>
        )}

        {/* Voir tout */}
        <div className="text-center mt-10">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
          >
            Voir tous les véhicules <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;