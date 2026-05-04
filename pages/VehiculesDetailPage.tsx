import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft, FaTachometerAlt, FaGasPump, FaCog,
  FaCalendarAlt, FaWhatsapp, FaShip,
  FaChevronLeft, FaChevronRight, FaExpand,
  FaShoppingCart, FaCheck, FaAnchor
} from 'react-icons/fa';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import VehicleCard from '../components/cards/VehicleCard';
import type { Vehicle } from '../types/vehicle';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addVehicle, cart } = useCart();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [added, setAdded] = useState(false);

  const WHATSAPP_NUMBER = '14374442288';

  const isInCart = cart.items.some(
    item => item.type === 'vehicle' && item.vehicle?.id === vehicle?.id
  );

  useEffect(() => {
    if (id) {
      fetchVehicle(id);
    }
  }, [id]);

  const fetchVehicle = async (vehicleId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (!error && data) {
      const vehicleData = data as Vehicle;
      setVehicle(vehicleData);
      
      // Récupérer les véhicules similaires (même catégorie ou marque)
      fetchSimilarVehicles(vehicleData);
    }
    setLoading(false);
  };

  const fetchSimilarVehicles = async (currentVehicle: Vehicle) => {
    const { data } = await supabase
      .from('vehicles')
      .select('*')
      .eq('available', true)
      .neq('id', currentVehicle.id)
      .or(`category.eq.${currentVehicle.category},brand.eq.${currentVehicle.brand}`)
      .limit(6)
      .order('created_at', { ascending: false });

    if (data) {
      setSimilarVehicles(data as Vehicle[]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (vehicle) {
      addVehicle(vehicle);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const images = vehicle?.images?.length ? vehicle.images : ['/placeholder-car.jpg'];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) return <LoadingSpinner message="Chargement du véhicule..." />;
  
  if (!vehicle) return (
    <div className="text-center py-20">
      <p className="text-2xl text-gray-500">Véhicule non trouvé</p>
      <Link to="/vehicles" className="mt-4 inline-block text-primary-500 font-semibold">
        Retour aux véhicules
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-500">Accueil</Link>
            <span>/</span>
            <Link to="/vehicles" className="hover:text-primary-500">Véhicules</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold truncate">
              {vehicle.brand} {vehicle.model}
            </span>
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

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Galerie images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[currentImage]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-[400px] lg:h-[500px] object-cover cursor-pointer"
                onClick={() => setShowFullscreen(true)}
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition"
                  >
                    <FaChevronRight />
                  </button>
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition"
                  >
                    <FaExpand />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-primary-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  {vehicle.category || vehicle.location}
                </span>
                {vehicle.featured && (
                  <span className="bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-full text-sm font-bold">
                    Top vente
                  </span>
                )}
              </div>
            </div>

            {/* Miniatures */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition ${
                      i === currentImage ? 'border-primary-500' : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Infos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-gray-500 text-lg mb-6">{vehicle.year}</p>

              <p className="text-4xl font-extrabold text-primary-600 mb-8">
                {formatPrice(vehicle.price)}
              </p>

              {/* Caractéristiques */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: FaTachometerAlt, label: 'Kilométrage', value: `${vehicle.mileage?.toLocaleString()} km` },
                  { icon: FaGasPump, label: 'Carburant', value: vehicle.fuel },
                  { icon: FaCog, label: 'Transmission', value: vehicle.transmission },
                  { icon: FaCalendarAlt, label: 'Année', value: vehicle.year },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <item.icon className="text-primary-500 text-lg mb-1" />
                    <span className="block text-xs text-gray-500">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Livraison info */}
              <div className="bg-primary-50 rounded-xl p-4 mb-8 border border-primary-100">
                <div className="flex items-center gap-2 text-primary-700 font-semibold mb-2">
                  <FaAnchor /> Port de Jebel Ali, Dubai 🇦🇪
                </div>
                <p className="text-primary-600 text-sm">
                  Importé directement depuis notre entrepôt à Dubai.
                </p>
                <p className="text-sm text-primary-500 mt-2 flex items-center gap-2">
                  <FaShip /> Livraison en 35 jours partout en Afrique
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
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
                >
                  {added ? (
                    <><FaCheck /> Ajouté au panier !</>
                  ) : isInCart ? (
                    <><FaShoppingCart /> Déjà dans le panier</>
                  ) : (
                    <><FaShoppingCart /> Ajouter au panier</>
                  )}
                </button>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Bonjour! Je suis intéressé par le véhicule ${vehicle.brand} ${vehicle.model} (${vehicle.year}) à ${formatPrice(vehicle.price)}. Réf: ${vehicle.id.slice(0, 8)}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition"
                >
                  <FaWhatsapp className="text-xl" /> Commander sur WhatsApp
                </a>
              </div>

              {/* Garanties */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  '✅ Véhicule inspecté',
                  '🔒 Transaction sécurisée',
                  '🚢 Départ Jebel Ali',
                  '💯 Satisfait ou remboursé'
                ].map((item, i) => (
                  <span key={i} className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== VÉHICULES SIMILAIRES ===== */}
        {similarVehicles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                  Véhicules similaires
                </h2>
                <p className="text-gray-500 mt-1">
                  Vous pourriez aussi être intéressé par
                </p>
              </div>
              <Link
                to="/vehicles"
                className="hidden sm:flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition"
              >
                Voir tout <FaChevronRight className="text-sm" />
              </Link>
            </div>

            {/* Scroll horizontal */}
            <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {similarVehicles.map((similar, i) => (
                <div
                  key={similar.id}
                  className="flex-shrink-0 w-[300px] sm:w-[340px] snap-start"
                >
                  <VehicleCard vehicle={similar} index={i} />
                </div>
              ))}
            </div>

            {/* Lien mobile */}
            <div className="text-center mt-6 sm:hidden">
              <Link
                to="/vehicles"
                className="text-primary-500 font-semibold hover:text-primary-600 transition"
              >
                Voir tous les véhicules →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 z-10"
          >
            ✕
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300"
          >
            <FaChevronLeft />
          </button>
          <img
            src={images[currentImage]}
            alt=""
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;