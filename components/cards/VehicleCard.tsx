import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaTachometerAlt, FaGasPump, FaCog, FaShoppingCart, FaCheck } from 'react-icons/fa';
import type { Vehicle } from '../../types/vehicle';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

const VehicleCard = ({ vehicle, index = 0 }: VehicleCardProps) => {
  const { addVehicle, cart } = useCart();
  const [added, setAdded] = useState(false);

  const isInCart = cart.items.some(
    item => item.type === 'vehicle' && item.vehicle?.id === vehicle.id
  );

  const formatPrice = (price: number, currency: string = 'FCFA') => {
    if (!price) return '—';
    if (currency === 'USD') return '$' + new Intl.NumberFormat('fr-FR').format(price);
    if (currency === 'GNF') return new Intl.NumberFormat('fr-FR').format(price) + ' GNF';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addVehicle(vehicle);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-gray-100 hover:border-primary-300 transition-all"
    >
      <Link to={`/vehicles/${vehicle.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={vehicle.images?.[0] || '/placeholder-car.jpg'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* UN SEUL BADGE */}
          <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {vehicle.category || 'SUV'}
          </span>
          
          {vehicle.featured && (
            <span className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <FaStar /> Top
            </span>
          )}
        </div>
        
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900">
            {vehicle.brand} {vehicle.model}
          </h3>
          
          <div className="flex items-center gap-3 text-gray-500 text-sm mt-2">
            <span className="flex items-center gap-1">
              <FaTachometerAlt className="text-primary-400" /> {vehicle.mileage?.toLocaleString()} km
            </span>
            <span className="flex items-center gap-1">
              <FaGasPump className="text-primary-400" /> {vehicle.fuel}
            </span>
            <span className="flex items-center gap-1">
              <FaCog className="text-primary-400" /> {vehicle.transmission}
            </span>
          </div>
          
          {/* Prix */}
          <div className="mt-3">
            <p className="text-primary-600 font-extrabold text-xl">
              {formatPrice(vehicle.price_fcfa || vehicle.price, 'FCFA')}
            </p>
            <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
              <span>{formatPrice(vehicle.price_usd, 'USD')}</span>
              <span>•</span>
              <span>{formatPrice(vehicle.price_gnf, 'GNF')}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Boutons */}
      <div className="px-5 pb-5 flex gap-2">
        <Link
          to={`/vehicles/${vehicle.id}`}
          className="flex-1 text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
        >
          Détails
        </Link>
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition text-sm ${
            added
              ? 'bg-green-500 text-white'
              : isInCart
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          {added ? (
            <><FaCheck /> Ajouté !</>
          ) : (
            <><FaShoppingCart /> {isInCart ? ' +1' : 'Ajouter'}</>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default VehicleCard;