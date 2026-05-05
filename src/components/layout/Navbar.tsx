import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShoppingCart, FaBars, FaTimes
} from 'react-icons/fa';
import { useCart } from '../../../contexts/CartContext';
import logoImage from '../../assets/images/logo.jpg'


const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { cart } = useCart();
  const cartCount = cart.totalItems;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NAV_LINKS = [
    { path: '/', label: 'Accueil' },
    { path: '/vehicles', label: 'Véhicules' },
    { path: '/products', label: 'Produits' },
    { path: '/contact', label: 'Contact' },
  ];

  const MOBILE_LINKS = [
    { path: '/', label: 'Accueil', icon: '🏠' },
    { path: '/vehicles', label: 'Véhicules', icon: '🚗' },
    { path: '/products', label: 'Produits', icon: '📦' },
    { path: '/contact', label: 'Contact', icon: '📞' },
  ];

  const formatCartAmount = () => {
    if (cart.totalAmount === 0) return '';
    if (cart.totalAmount >= 1000000) {
      return (cart.totalAmount / 1000000).toFixed(1) + 'M FCFA';
    }
    return new Intl.NumberFormat('fr-FR').format(cart.totalAmount) + ' FCFA';
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-primary-500/5 border-b border-gray-100'
          : 'bg-white'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-4 flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'py-2.5' : 'py-3.5'
      }`}>
        {/* Logo */}
<Link 
  to="/" 
  className="flex items-center gap-3 group"
  onClick={closeMobile}
>
  {/* Conteneur du logo — propre et prestigieux */}
  <div className="relative flex-shrink-0">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
      <img 
        src={logoImage} 
        alt="Élite Transit Service" 
        className="w-full h-full object-contain scale-110" 
      />
    </div>
  </div>

  {/* Texte de marque */}
  <div className="leading-tight">
    <span className="block text-base lg:text-lg font-extrabold text-primary-600 tracking-tight">
      ÉLITE TRANSIT
    </span>
    <span className="block text-base lg:text-lg font-extrabold text-gray-900 tracking-tight -mt-0.5">
      SERVICE
    </span>
    <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-primary-400 -mt-0.5">
      CMA & CGM
    </span>
  </div>
</Link>

        {/* Navigation Desktop (inchangée) */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isActive(item.path)
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
              {isActive(item.path) && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Actions Desktop (inchangées) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/cart"
            className="relative flex items-center gap-2.5 bg-gray-50 hover:bg-primary-50 px-4 py-2.5 rounded-xl transition-all group shadow-sm border border-gray-100 hover:border-primary-200"
          >
            <div className="relative">
              <FaShoppingCart className="text-gray-600 group-hover:text-primary-500 transition text-base" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </div>
            <div className="text-left leading-tight">
              <span className="block text-xs font-bold text-gray-700 group-hover:text-primary-600 transition">
                Panier
              </span>
              {cartCount > 0 ? (
                <span className="block text-[10px] text-primary-500 font-semibold">
                  {cartCount} article{cartCount > 1 ? 's' : ''}
                  {cart.totalAmount > 0 && ` • ${formatCartAmount()}`}
                </span>
              ) : (
                <span className="block text-[10px] text-gray-400">
                  Vide
                </span>
              )}
            </div>
          </Link>

          <Link
            to="/vehicles"
            className="flex items-center gap-2 bg-primary-500 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all hover:bg-primary-600 shadow-lg shadow-primary-500/25"
          >
            Voir les offres
          </Link>
        </div>

        {/* Bouton Menu Mobile (inchangé) */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl bg-gray-50 text-gray-600 shadow-sm"
            onClick={closeMobile}
          >
            <FaShoppingCart className="text-base" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </Link>

          <button
            onClick={toggleMobile}
            className="p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
            aria-label="Menu"
          >
            {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile (inchangé) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {MOBILE_LINKS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                  {isActive(item.path) && (
                    <span className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></span>
                  )}
                </Link>
              ))}

              <div className="pt-3">
                <Link
                  to="/vehicles"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white py-3.5 rounded-xl font-bold hover:bg-primary-600 transition-all"
                >
                  Voir les offres
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;