import { motion } from 'framer-motion';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

const SectionTitle = ({ subtitle, title, description, centered = true, light = false }: SectionTitleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      {subtitle && (
        <span className={`font-bold text-sm uppercase tracking-widest ${light ? 'text-primary-300' : 'text-primary-500'}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-4xl lg:text-5xl font-extrabold mt-4 mb-4 ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {description && (
        <p className={`max-w-2xl mx-auto ${light ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;