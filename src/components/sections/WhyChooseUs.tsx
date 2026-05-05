import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaShip, FaGlobeAfrica } from 'react-icons/fa';
import SectionTitle from '../ui/SectionTitle';

const FEATURES = [
  {
    icon: FaShip,
    title: 'Importation Directe',
    description: 'Basés au Port de Jebel Ali à Dubai 🇦🇪, nous expédions directement chez vous en 35 jours. Aucun intermédiaire, prix imbattables.'
  },
  {
    icon: FaShieldAlt,
    title: 'Transaction 100% Sécurisée',
    description: 'Paiement sécurisé, documents vérifiés. Nous traitons directement avec vous, sans représentant en Afrique. Zéro risque.'
  },
  {
    icon: FaCheckCircle,
    title: 'Qualité Contrôlée',
    description: 'Chaque véhicule et produit est inspecté minutieusement avant expédition depuis notre entrepôt de Jebel Ali. Satisfaction garantie.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Décorations */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <SectionTitle
          subtitle="Pourquoi nous choisir"
          title="La différence Transit Auto"
          description="Découvrez ce qui fait de nous votre partenaire de confiance pour l'importation de véhicules et produits depuis Dubai."
          light
        />

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-gray-700/80 transition-all border border-gray-700/50 group"
            >
              <div className="w-20 h-20 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500/20 transition-all">
                <feature.icon className="text-primary-400 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Info localisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600/20 to-primary-800/20 border border-primary-500/20 rounded-2xl p-6 text-center backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇦🇪</span>
              <div className="text-left">
                <p className="font-bold text-white">Port de Jebel Ali, Dubai</p>
                <p className="text-sm text-gray-400">Notre unique localisation</p>
              </div>
            </div>

            <span className="hidden md:block text-gray-600">|</span>

            <div className="flex items-center gap-2">
              <FaGlobeAfrica className="text-primary-400 text-xl" />
              <div className="text-left">
                <p className="font-bold text-white">Expédition Afrique</p>
                <p className="text-sm text-gray-400">Livraison en 35 jours</p>
              </div>
            </div>

            <span className="hidden md:block text-gray-600">|</span>

            <div className="text-left">
              <p className="font-bold text-white">Aucun intermédiaire</p>
              <p className="text-sm text-gray-400">Transaction directe avec nous</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;