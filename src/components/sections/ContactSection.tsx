import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, 
  FaShip, FaClock, FaPaperPlane, FaGlobeAfrica,
  FaAnchor
} from 'react-icons/fa';

const ContactSection = () => {
  const WHATSAPP_NUMBER = '14374442288';
  const PHONE = '+1 (437) 444-2288';
  const EMAIL = 'contact@elitetransitservice.com';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `📩 *Nouveau message depuis le site*\n\n` +
      `👤 *Nom:* ${form.name}\n` +
      `📧 *Email:* ${form.email}\n` +
      `📞 *Téléphone:* ${form.phone}\n` +
      `📌 *Sujet:* ${form.subject}\n\n` +
      `💬 *Message:*\n${form.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-500 font-bold text-sm uppercase tracking-widest">
            Contactez-nous
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold mt-4 mb-4 text-gray-900">
            Parlons de votre projet
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une question sur un véhicule, un produit, ou les modalités d'importation ?
            Nous sommes à votre écoute.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Carte info principale */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                  <FaAnchor className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Élite Transit Service</h3>
                  <p className="text-sm text-gray-500">CMA & CGM</p>
                </div>
              </div>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition group"
                >
                  <span className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaWhatsapp className="text-white" />
                  </span>
                  <div>
                    <span className="block text-xs text-gray-500">WhatsApp</span>
                    <span className="font-bold text-gray-900 group-hover:text-green-600 transition">{PHONE}</span>
                  </div>
                </a>

                <a
                  href={`tel:${WHATSAPP_NUMBER}`}
                  className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition group"
                >
                  <span className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-white" />
                  </span>
                  <div>
                    <span className="block text-xs text-gray-500">Téléphone</span>
                    <span className="font-bold text-gray-900 group-hover:text-primary-600 transition">{PHONE}</span>
                  </div>
                </a>

                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition group"
                >
                  <span className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-white" />
                  </span>
                  <div>
                    <span className="block text-xs text-gray-500">Email</span>
                    <span className="font-bold text-gray-900 group-hover:text-amber-600 transition">{EMAIL}</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Infos pratiques */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaClock className="text-primary-500" /> Informations pratiques
              </h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Port de Jebel Ali</p>
                    <p>Dubai, Émirats Arabes Unis 🇦🇪</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaShip className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Expédition</p>
                    <p>Livraison en 35 jours vers toute l'Afrique</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FaGlobeAfrica className="text-primary-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Zone de livraison</p>
                    <p>Toute l'Afrique • Aucun intermédiaire</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaPaperPlane className="text-primary-500" /> Envoyez-nous un message
              </h3>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition text-sm"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition text-sm"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition text-sm"
                    placeholder="+1 437 444 2288"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sujet</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition text-sm"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="Véhicule">Achat de véhicule</option>
                    <option value="Produit">Achat de produit électronique</option>
                    <option value="Importation">Importation sur mesure</option>
                    <option value="Délai">Délai de livraison</option>
                    <option value="Autre">Autre demande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition text-sm resize-none"
                    placeholder="Décrivez votre projet ou votre question..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-500 text-white py-4 rounded-xl font-bold hover:bg-primary-600 transition flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25"
                >
                  <FaWhatsapp className="text-lg" />
                  Envoyer via WhatsApp
                </button>

                <p className="text-xs text-gray-400 text-center">
                  En cliquant, votre message sera envoyé directement sur notre WhatsApp.
                  Nous répondons sous 24h maximum.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;