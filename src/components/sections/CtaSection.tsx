import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaWhatsapp, FaEnvelope, FaShip } from 'react-icons/fa';

const CtaSection = () => {
  const WHATSAPP_NUMBER = '14374442288'; // +1 (437) 444-2288

  return (
    <section className="relative py-24 overflow-hidden bg-orange-50">
      {/* Fond subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50"></div>
      
      {/* Motif décoratif très léger */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-primary-600 px-5 py-2 rounded-full text-sm font-semibold mb-8 border border-primary-200 shadow-sm">
            <FaShip className="text-sm" /> Importation depuis Dubai • Port de Jebel Ali
          </span>

          {/* Titre */}
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Prêt à recevoir votre
            <span className="block text-primary-500">véhicule en 35 jours ?</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez les <strong className="text-gray-900">centaines de clients</strong> qui nous font confiance 
            depuis le <strong className="text-gray-900">Port de Jebel Ali, Dubai 🇦🇪</strong>.
            <br />
            <span className="text-primary-600 font-medium">Un message, et nous démarrons votre importation.</span>
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link
              to="/vehicles"
              className="group bg-white text-gray-900 hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-gray-200 border border-gray-100"
            >
              Voir le catalogue
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-primary-500/20"
            >
              <FaWhatsapp className="text-xl" />
              Commander sur WhatsApp
            </a>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap justify-center gap-6 text-gray-500 mb-10">
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-500 transition"
            >
              <FaWhatsapp className="text-green-500" /> +1 (437) 444-2288
            </a>
            <span className="text-gray-300 hidden sm:block">|</span>
            <a 
              href="mailto:contact@transit-auto.com" 
              className="flex items-center gap-2 hover:text-primary-500 transition"
            >
              <FaEnvelope className="text-primary-400" /> contact@transit-auto.com
            </a>
          </div>

          {/* Garanties */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              '🔒 Transaction sécurisée',
              '✅ Véhicules inspectés',
              '🚢 Départ Jebel Ali',
              '💯 Satisfait ou remboursé'
            ].map((item, i) => (
              <span
                key={i}
                className="bg-white/70 backdrop-blur-sm text-gray-600 px-4 py-2 rounded-lg text-xs border border-gray-200 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;