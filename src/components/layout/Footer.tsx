import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaFacebook, FaWhatsapp, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaShip, FaArrowRight,
  FaShieldAlt, FaCheckCircle, FaInstagram, FaAnchor
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const WHATSAPP_NUMBER = '14374442288';
  const PHONE = '+1 (437) 444-2288';
  const EMAIL = 'contact@elitetransitservice.com';

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* Vague décorative */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" className="w-full h-auto fill-white">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-8">
        
        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Colonne 1 - Marque */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <FaShip className="text-white text-lg" />
              </div>
              <div>
                <span className="block text-lg font-extrabold text-primary-400 leading-tight">
                  ÉLITE TRANSIT
                </span>
                <span className="block text-lg font-extrabold text-white leading-tight -mt-0.5">
                  SERVICE
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.15em] text-primary-400 -mt-0.5">
                  CMA & CGM
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Votre partenaire de confiance pour l'importation de véhicules d'occasion, 
              produits électroniques et biens divers depuis le <strong className="text-gray-300">Port de Jebel Ali, Dubai 🇦🇪</strong>.
              <br />
              <span className="text-primary-400 text-xs">Aucun intermédiaire en Afrique • Transaction directe</span>
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3">
              {[
                { icon: FaFacebook, href: '#', color: 'hover:text-blue-400' },
                { icon: FaInstagram, href: '#', color: 'hover:text-pink-400' },
                { icon: FaWhatsapp, href: `https://wa.me/${WHATSAPP_NUMBER}`, color: 'hover:text-green-400' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className={`bg-gray-800 p-3 rounded-xl hover:bg-gray-700 transition-all ${social.color} text-gray-400`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary-500 rounded-full"></span>
              Liens rapides
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/vehicles', label: 'Véhicules disponibles' },
                { to: '/products', label: 'Produits électroniques' },
                { to: '/contact', label: 'Contactez-nous' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition group"
                  >
                    <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 - Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary-500 rounded-full"></span>
              Nos services
            </h4>
            <ul className="space-y-3">
              {[
                { icon: FaShip, label: 'Importation depuis Dubai' },
                { icon: FaShip, label: 'Transit & Logistique' },
                { icon: FaShieldAlt, label: 'Dédouanement' },
                { icon: FaCheckCircle, label: 'Inspection véhicules' },
                { icon: FaAnchor, label: 'Départ Port de Jebel Ali' }
              ].map((service, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-400">
                  <service.icon className="text-primary-500 text-sm" />
                  {service.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 - Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary-500 rounded-full"></span>
              Contact
            </h4>
            <ul className="space-y-4 mb-6">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition group"
                >
                  <span className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition">
                    <FaWhatsapp className="text-green-400" />
                  </span>
                  <div>
                    <span className="block text-xs text-gray-500">WhatsApp</span>
                    <span className="font-semibold text-white">{PHONE}</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${WHATSAPP_NUMBER}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition group"
                >
                  <span className="bg-primary-500/20 p-2 rounded-lg group-hover:bg-primary-500/30 transition">
                    <FaPhone className="text-primary-400" />
                  </span>
                  <div>
                    <span className="block text-xs text-gray-500">Téléphone</span>
                    <span className="font-semibold text-white">{PHONE}</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition group"
                >
                  <span className="bg-yellow-500/20 p-2 rounded-lg group-hover:bg-yellow-500/30 transition">
                    <FaEnvelope className="text-yellow-400" />
                  </span>
                  <div>
                    <span className="block text-xs text-gray-500">Email</span>
                    <span className="font-semibold text-white">{EMAIL}</span>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <span className="bg-blue-500/20 p-2 rounded-lg mt-1">
                  <FaMapMarkerAlt className="text-blue-400" />
                </span>
                <div>
                  <span className="block text-xs text-gray-500">Adresse</span>
                  <span className="font-semibold text-white">Port de Jebel Ali, Dubai 🇦🇪</span>
                  <span className="block text-xs text-gray-500 mt-0.5">Aucun représentant en Afrique</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre de confiance */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: FaShip, title: 'Livraison 35 jours', desc: 'Depuis Dubai' },
              { icon: FaShieldAlt, title: 'Paiement sécurisé', desc: '100% protégé' },
              { icon: FaCheckCircle, title: 'Qualité garantie', desc: 'Inspection rigoureuse' },
              { icon: FaAnchor, title: 'Port de Jebel Ali', desc: 'Expédition directe' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <item.icon className="text-primary-500 text-2xl" />
                <span className="text-white font-semibold text-sm">{item.title}</span>
                <span className="text-gray-500 text-xs">{item.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Barre inférieure */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            © {currentYear} <span className="text-primary-400 font-semibold">Élite Transit Service (CMA&CGM)</span> – Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-primary-400 transition">Contact</Link>
            <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-xs font-semibold">
              🇦🇪 Port de Jebel Ali, Dubai
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;