import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShip, FaShoppingCart, FaBars, FaTimes, 
  FaWhatsapp
} from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

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

  const WHATSAPP_NUMBER = '14374442288';

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-primary-500/5 border-b border-gray-100'
          : 'bg-white'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-4 flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-3'
      }`}>
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
          onClick={closeMobile}
        >
          {/* Icône logo */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all">
              <FaShip className="text-white text-lg" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
          </div>

          {/* Texte logo */}
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

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
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

        {/* Actions Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Panier */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl transition-all bg-gray-50 hover:bg-primary-50 text-gray-600 hover:text-primary-600 shadow-sm"
          >
            <FaShoppingCart className="text-base" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </motion.span>
            )}
          </Link>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-green-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-green-400 shadow-lg shadow-green-500/25"
          >
            <FaWhatsapp className="text-sm" />
            WhatsApp
          </a>

          {/* CTA */}
          <Link
            to="/vehicles"
            className="flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-primary-600 shadow-lg shadow-primary-500/25"
          >
            <FaShip className="text-sm" />
            Voir les offres
          </Link>
        </div>

        {/* Bouton Menu Mobile */}
        <button
          onClick={toggleMobile}
          className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          aria-label="Menu"
        >
          {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Menu Mobile */}
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

              {/* Panier mobile */}
              <Link
                to="/cart"
                onClick={closeMobile}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-all"
              >
                <span>🛒</span>
                Panier
                {cartCount > 0 && (
                  <span className="ml-auto bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* CTA Mobile */}
              <div className="pt-3 space-y-2">
                <Link
                  to="/vehicles"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-all"
                >
                  <FaShip /> Voir les véhicules
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-400 transition-all"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;