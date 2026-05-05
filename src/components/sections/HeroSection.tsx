import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, FaShip, FaShieldAlt, FaGlobeAfrica, 
  FaBox, FaStar
} from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gray-950 overflow-hidden">
      {/* Fond avec gradient très subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      
      {/* Image de fond ultra légère */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&q=80')] bg-cover bg-center opacity-[0.03]"
      />

      {/* Lignes décoratives très fines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/5 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Colonne texte */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Badge discret */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-300 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Port de Jebel Ali, Dubai
            </div>

            {/* Titre */}
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Votre véhicule
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-yellow-400">
                livré en 35 jours
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
              Importation directe depuis le Port de Jebel Ali. Nous gérons l’achat, le transit, 
              le dédouanement et la livraison. Sans intermédiaire, en toute transparence.
            </p>

            {/* Arguments */}
            <div className="grid grid-cols-2 gap-4 mb-10 max-w-md">
              {[
                { icon: FaShip, label: 'Départ Jebel Ali' },
                { icon: FaShieldAlt, label: 'Transaction sécurisée' },
                { icon: FaGlobeAfrica, label: 'Livraison partout en Afrique' },
                { icon: FaStar, label: 'Véhicules inspectés' }
              ].map((arg, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <arg.icon className="text-primary-400 text-base flex-shrink-0" />
                  <span className="text-sm">{arg.label}</span>
                </div>
              ))}
            </div>

            {/* Boutons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/vehicles"
                className="group bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-base transition-all transform hover:scale-[1.02] inline-flex items-center gap-2 shadow-xl shadow-primary-500/25"
              >
                Voir les véhicules
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="group bg-transparent hover:bg-white/5 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-base transition-all inline-flex items-center gap-2 backdrop-blur-sm"
              >
                <FaBox />
                Nos produits
              </Link>
            </div>
          </motion.div>

          {/* Colonne visuelle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
              <img
                src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80"
                alt="Importation véhicule Dubai"
                className="w-full h-[550px] object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Infos voiture */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex gap-2 mb-3">
                  <span className="bg-white/10 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20">
                    🇦🇪 Dubai
                  </span>
                  <span className="bg-primary-500/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                    Disponible
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">Mercedes GLC 300</h3>
                <p className="text-primary-200 text-lg font-semibold">28 000 000 FCFA</p>
              </div>
            </div>

            {/* Badge prix (flottant) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-8 -right-8 bg-white rounded-2xl p-5 shadow-2xl"
            >
              <p className="text-xs text-gray-500 font-medium">À partir de</p>
              <p className="text-2xl font-bold text-gray-900">1M FCFA</p>
            </motion.div>

            {/* Badge livraison (flottant) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-5 shadow-2xl flex items-center gap-3"
            >
              <FaShip className="text-primary-500 text-2xl" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Livraison</p>
                <p className="text-xl font-bold text-gray-900">35 jours</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;