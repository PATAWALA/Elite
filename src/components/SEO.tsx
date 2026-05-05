import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
}

const SITE_NAME = 'Élite Transit Service (CMA&CGM)';
const BASE_URL = 'https://elite-eta-three.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/logo.jpg`;
const DEFAULT_DESCRIPTION =
  'Importation directe de véhicules et produits depuis le Port de Jebel Ali à Dubaï. Prix directs, livraison en 35 jours partout en Afrique. Aucun intermédiaire.';

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = '',
  type = 'website',
}: SEOProps) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Importation directe depuis Dubai`;
  const pageUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  return (
    <Helmet>
      {/* Titre et description */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph (Facebook, LinkedIn, WhatsApp…) */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      {/* Dimensions de l'image (optionnel) */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Élite Transit Service – Importation depuis Dubai" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
    </Helmet>
  );
};

export default SEO;