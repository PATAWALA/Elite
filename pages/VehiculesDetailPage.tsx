import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft, FaTachometerAlt, FaGasPump, FaCog,
  FaCalendarAlt, FaWhatsapp, FaShip,
  FaChevronLeft, FaChevronRight,
  FaShoppingCart, FaCheck, FaAnchor,
  FaShieldAlt, FaMoneyBillWave, FaHandHoldingUsd
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
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const WHATSAPP_NUMBER = '14374442288';

  const isInCart = cart.items.some(
    item => item.type === 'vehicle' && item.vehicle?.id === vehicle?.id
  );

  useEffect(() => {
    if (id) fetchVehicle(id);
  }, [id]);

  const fetchVehicle = async (vehicleId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();
    if (!error && data) {
      const vd = data as Vehicle;
      setVehicle(vd);
      fetchSimilarVehicles(vd);
    }
    setLoading(false);
  };

  const fetchSimilarVehicles = async (v: Vehicle) => {
    const { data } = await supabase
      .from('vehicles')
      .select('*')
      .eq('available', true)
      .neq('id', v.id)
      .or(`category.eq.${v.category},brand.eq.${v.brand}`)
      .limit(6)
      .order('created_at', { ascending: false });
    if (data) setSimilarVehicles(data as Vehicle[]);
  };

  const formatPrice = (price: number, currency: string = 'FCFA') => {
    if (!price) return '—';
    if (currency === 'USD') return '$' + new Intl.NumberFormat('fr-FR').format(price);
    if (currency === 'GNF') return new Intl.NumberFormat('fr-FR').format(price) + ' GNF';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleAddToCart = () => {
    if (vehicle) { addVehicle(vehicle); setAdded(true); setTimeout(() => setAdded(false), 1500); }
  };

  const images = vehicle?.images?.length ? vehicle.images : ['/placeholder-car.jpg'];
  const nextImage = () => setCurrentImage(p => (p + 1) % images.length);
  const prevImage = () => setCurrentImage(p => (p - 1 + images.length) % images.length);

  const generateWA = () => {
    if (!vehicle) return '';
    let m = `Bonjour! Je suis intéressé par:\n\n🚗 *${vehicle.brand} ${vehicle.model}* (${vehicle.year})\n📍 ${vehicle.mileage?.toLocaleString()} km | ⛽ ${vehicle.fuel} | ⚙️ ${vehicle.transmission}`;
    if (vehicle.never_accidented) m += `\n✅ Jamais accidenté`;
    m += `\n\n💰 Prix: ${formatPrice(vehicle.price_fcfa || vehicle.price)}`;
    if (vehicle.price_usd) m += ` / ${formatPrice(vehicle.price_usd, 'USD')}`;
    if (vehicle.advance_fcfa) {
      m += `\n💳 Avance: ${formatPrice(vehicle.advance_fcfa)}`;
      if (vehicle.advance_usd) m += ` / ${formatPrice(vehicle.advance_usd, 'USD')}`;
    }
    m += `\n\nRéf: ${vehicle.id.slice(0, 8)}`;
    return encodeURIComponent(m);
  };

  const handleOrderNow = async () => {
    if (!vehicle) return;
    
    const phone = prompt('Entrez votre numéro WhatsApp pour que nous puissions vous contacter :', '');
    if (!phone || phone.trim().length < 5) {
      alert('Veuillez entrer un numéro WhatsApp valide.');
      return;
    }

    setOrdering(true);
    const priceFcfa = vehicle.price_fcfa || vehicle.price;

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: '',
          customer_phone: phone.trim(),
          total_amount: priceFcfa,
          status: 'pending',
          notes: `Commande en ligne: ${vehicle.brand} ${vehicle.model} (${vehicle.year})`
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          vehicle_id: vehicle.id,
          quantity: 1,
          price: priceFcfa
        });

      if (itemError) throw itemError;

      const adminMessage = encodeURIComponent(
        `🛒 *Nouvelle commande #${order.id.slice(0, 8)}*\n\n` +
        `🚗 ${vehicle.brand} ${vehicle.model} (${vehicle.year})\n` +
        `💰 ${formatPrice(priceFcfa)}\n` +
        `📞 Client: ${phone.trim()}\n\n` +
        `_Cette commande vient du site web. Contactez le client rapidement._`
      );

      setOrderSuccess(true);
      
      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${adminMessage}`, '_blank');
      }, 1000);

    } catch (error) {
      console.error('Erreur commande:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <LoadingSpinner message="Chargement..." />;
  if (!vehicle) return (
    <div className="text-center py-20">
      <p className="text-2xl text-gray-500">Véhicule non trouvé</p>
      <Link to="/vehicles" className="mt-4 text-primary-500 font-semibold">Retour</Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-2.5">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link to="/" className="hover:text-primary-500">Accueil</Link><span>/</span>
            <Link to="/vehicles" className="hover:text-primary-500">Véhicules</Link><span>/</span>
            <span className="text-gray-700 font-medium truncate">{vehicle.brand} {vehicle.model}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-500 hover:text-primary-500 mb-4 text-sm font-medium transition">
          <FaArrowLeft className="text-xs" /> Retour
        </button>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          
          {/* ===== IMAGE ===== */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <motion.img key={currentImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                src={images[currentImage]} alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-[350px] lg:h-[450px] object-cover cursor-pointer"
                onClick={() => setShowFullscreen(true)}
              />
              
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2.5 rounded-full shadow-lg transition" title="Précédent"><FaChevronLeft /></button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2.5 rounded-full shadow-lg transition" title="Suivant"><FaChevronRight /></button>
                </>
              )}

              <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {vehicle.category || 'SUV'}
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mt-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition ${i === currentImage ? 'border-primary-500' : 'border-gray-200 hover:border-primary-300'}`}
                    title={`Image ${i + 1}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ===== INFOS ===== */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-5 lg:p-6 shadow-lg flex flex-col justify-between">
            
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">{vehicle.brand} {vehicle.model}</h1>
                  <p className="text-sm text-gray-400">{vehicle.year}</p>
                </div>
                {vehicle.never_accidented && (
                  <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-green-100 flex-shrink-0">
                    <FaShieldAlt /> Jamais accidenté
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mb-5 text-sm text-gray-600">
                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg"><FaTachometerAlt className="text-primary-400" /> {vehicle.mileage?.toLocaleString()} km</span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg"><FaGasPump className="text-primary-400" /> {vehicle.fuel}</span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg"><FaCog className="text-primary-400" /> {vehicle.transmission}</span>
                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg"><FaCalendarAlt className="text-primary-400" /> {vehicle.year}</span>
              </div>

              <div className="bg-primary-50 rounded-xl p-4 mb-3 border border-primary-100">
                <div className="flex items-center gap-1.5 text-primary-600 text-xs font-semibold mb-1"><FaMoneyBillWave /> Prix total</div>
                <p className="text-3xl font-extrabold text-primary-600">{formatPrice(vehicle.price_fcfa || vehicle.price)}</p>
                {(vehicle.price_usd || vehicle.price_gnf) && (
                  <div className="flex gap-2 text-xs text-gray-500 mt-1">
                    {vehicle.price_usd && <span className="bg-white px-2 py-0.5 rounded">{formatPrice(vehicle.price_usd, 'USD')}</span>}
                    {vehicle.price_gnf && <span className="bg-white px-2 py-0.5 rounded">{formatPrice(vehicle.price_gnf, 'GNF')}</span>}
                  </div>
                )}
              </div>

              {vehicle.advance_fcfa > 0 && (
                <div className="bg-green-50 rounded-xl p-4 mb-3 border border-green-100">
                  <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold mb-1"><FaHandHoldingUsd /> Avance à la commande</div>
                  <p className="text-2xl font-extrabold text-green-600">{formatPrice(vehicle.advance_fcfa)}</p>
                  {(vehicle.advance_usd || vehicle.advance_gnf) && (
                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                      {vehicle.advance_usd && <span className="bg-white px-2 py-0.5 rounded">{formatPrice(vehicle.advance_usd, 'USD')}</span>}
                      {vehicle.advance_gnf && <span className="bg-white px-2 py-0.5 rounded">{formatPrice(vehicle.advance_gnf, 'GNF')}</span>}
                    </div>
                  )}
                </div>
              )}

              {vehicle.description && (
                <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3">{vehicle.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
                <FaAnchor className="text-primary-400" /> Port de Jebel Ali, Dubai 🇦🇪 • <FaShip className="text-primary-400 ml-1" /> Livraison 35 jours
              </div>
            </div>

            {/* ===== BOUTONS ===== */}
            <div className="flex flex-col gap-2">
              <button onClick={handleAddToCart}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${added ? 'bg-green-500 text-white' : isInCart ? 'bg-primary-100 text-primary-700' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>
                {added ? <><FaCheck /> Ajouté !</> : isInCart ? <><FaShoppingCart /> Dans le panier</> : <><FaShoppingCart /> Ajouter au panier</>}
              </button>

              <button onClick={handleOrderNow} disabled={ordering}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-primary-500/25 disabled:opacity-50">
                {ordering ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <><FaShoppingCart /> Commander maintenant</>}
              </button>

              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${generateWA()}`} target="_blank" rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition">
                <FaWhatsapp /> WhatsApp direct
              </a>

              {orderSuccess && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <FaCheck className="text-green-500 text-xl mx-auto mb-1" />
                  <p className="text-green-700 font-bold text-sm">Commande enregistrée !</p>
                  <p className="text-green-600 text-xs">Notre équipe vous contactera bientôt sur WhatsApp.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Véhicules similaires */}
        {similarVehicles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl lg:text-2xl font-extrabold text-gray-900">Véhicules similaires</h2>
              <Link to="/vehicles" className="text-sm text-primary-500 font-semibold hover:text-primary-600">Voir tout →</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
              {similarVehicles.map((s, i) => (
                <div key={s.id} className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start">
                  <VehicleCard vehicle={s} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setShowFullscreen(false)}>
          <button onClick={() => setShowFullscreen(false)} className="absolute top-6 right-6 text-white text-3xl z-10">✕</button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl"><FaChevronLeft /></button>
          <img src={images[currentImage]} alt="" className="max-w-full max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl"><FaChevronRight /></button>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;