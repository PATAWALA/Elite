import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, FaCheckCircle, 
  FaShip, FaShieldAlt, FaGlobeAfrica, FaBox
} from 'react-icons/fa';

const HeroSection = () => {

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Fond gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900"></div>
      
      {/* Image de fond floutée */}
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920')] bg-cover bg-center opacity-10"
      ></div>

      {/* Formes décoratives */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* ===== COLONNE TEXTE ===== */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-400/20 text-primary-300 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              🇦🇪 Port de Jebel Ali, Dubai • Importation directe
            </motion.div>

            {/* Titre principal */}
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6">
              Votre véhicule
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-yellow-400">
                livré en 35 jours
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              Achetez votre voiture d'occasion aux meilleurs prix. 
              Nous nous occupons de <strong className="text-primary-300">tout</strong> : 
              achat, transit, dédouanement, livraison.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              ⚓ Basés au Port de Jebel Ali, nous expédions directement chez vous. 
              <strong className="text-gray-400"> Aucun intermédiaire en Afrique.</strong>
            </p>

            {/* Bénéfices */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: FaCheckCircle, text: 'Prix directs Dubai' },
                { icon: FaShip, text: 'Livraison 35 jours' },
                { icon: FaShieldAlt, text: 'Paiement sécurisé' },
                { icon: FaGlobeAfrica, text: 'Toute l\'Afrique' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2"
                >
                  <item.icon className="text-primary-400 text-sm" />
                  <span className="text-gray-200 text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Boutons CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/vehicles"
                className="group bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-primary-500/30"
              >
                Voir les véhicules
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/products"
                className="group bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2 backdrop-blur-sm"
              >
                <FaBox />
                Autres biens
              </Link>
            </motion.div>

            {/* Preuve sociale */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 flex items-center gap-4"
            >
              {/* Avatars en ligne */}
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
                ].map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt={`Client ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover ring-2 ring-gray-800"
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-gray-800 bg-primary-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-gray-800">
                  +500
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">
                  <strong className="text-white">+500</strong> clients satisfaits
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ===== COLONNE VISUEL ===== */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Image principale */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/20 border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800"
                alt="Véhicule importé Dubai"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Overlay info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary-500 text-white text-xs px-3 py-1 rounded-full">
                    Disponible
                  </span>
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    🇦🇪 Dubai
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">Mercedes GLC 300</h3>
                <p className="text-primary-300 text-xl font-bold mt-1">28 000 000 FCFA</p>
              </div>
            </div>

            {/* Badge flottant prix */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 z-20 bg-yellow-400 text-gray-900 rounded-2xl p-4 shadow-xl"
            >
              <p className="text-xs font-semibold">À partir de</p>
              <p className="text-2xl font-extrabold">1M FCFA</p>
            </motion.div>

            {/* Badge flottant livraison */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -left-6 z-20 bg-white text-gray-900 rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <FaShip className="text-primary-500 text-xl" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Livraison</p>
                  <p className="text-lg font-extrabold text-primary-600">35 jours</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;