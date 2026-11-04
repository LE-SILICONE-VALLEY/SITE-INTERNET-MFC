import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import siteConfig from '@/config/siteConfig';
import { openMailto, CONTACT_EMAIL } from '@/lib/mailto';

const FALLBACK_HERO = '/insurance-hero.jpg';         // place ce fichier dans /public
const FALLBACK_COMPARATOR = '/conseiller-geneve.jpg'; // place ce fichier dans /public

const generateFallbackData = (title) => ({
  title: title,
  hero: {
    subtitle: 'Des garanties à comprendre, un contrat à choisir ensemble.',
    description: 'Nous faisons le point sur votre situation, vos priorités et les contrats que vous avez déjà. Votre conseiller vous aide à examiner les garanties, les exclusions et le budget avant de choisir une solution.',
    ctaText: 'Demander une offre sur-mesure',
    action: 'mailto',
    subject: `Demande d'offre sur-mesure pour : ${title}`,
    image: { alt: "Vue de Genève et de sa rade", src: FALLBACK_HERO }
  },
  comparator: {
    title: `Faisons le point sur votre projet`,
    description:
      "Un échange pour clarifier vos besoins, examiner les contrats existants et préparer les options à comparer. Vous gardez la décision à chaque étape.",
    points: ['Votre situation et vos priorités', 'Les garanties et exclusions à examiner', 'Un accompagnement pour comprendre vos options'],
    ctaText: 'Parler à un expert',
    action: 'mailto',
    subject: `Demande de conseil pour : ${title}`,
    image: { alt: "Échange autour d’un ordinateur dans un espace de travail", src: FALLBACK_COMPARATOR }
  },
  complements: {
    title: 'Les points à examiner ensemble',
    description: 'Les garanties disponibles et leurs conditions dépendent du contrat étudié.',
    items: [
      { label: 'Votre besoin', icon: 'Target' },
      { label: 'Les garanties', icon: 'Shield' },
      { label: 'Les exclusions', icon: 'FileText' },
      { label: 'Votre budget', icon: 'Wallet' }
    ]
  }
});

const InsurancePage = () => {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const { insurancePages } = siteConfig;

  const pageInfo = insurancePages.pages[category]?.[slug];
  const names = { '3eme-pilier': '3ᵉ pilier & prévoyance', 'rc-privee': 'Responsabilité civile privée', 'rc-professionnelle': 'Responsabilité civile professionnelle', '2eme-pilier': 'Prévoyance professionnelle', 'vehicules-professionnel': 'Véhicules professionnels' };
  const title = pageInfo?.title || names[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const data = pageInfo || generateFallbackData(title);

  const handleCtaClick = (ctaData) => {
    if (ctaData.path) {
      navigate(ctaData.path);
    } else if (ctaData.action === 'whatsapp') {
      window.open(`https://wa.me/41797896193?text=${encodeURIComponent(ctaData.subject || `Bonjour Christian, j’aimerais un conseil sur : ${title}`)}`, '_blank', 'noopener,noreferrer');
    } else if (ctaData.action === 'mailto') {
      openMailto(CONTACT_EMAIL, ctaData.subject || `Demande d'informations pour : ${title}`);
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageTransition>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
                <img
                  className="mfc-service-photo" decoding="async"
                  alt={data.hero.image?.alt || 'Assurance – visuel'}
                  src={data.hero.image?.src || FALLBACK_HERO}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_HERO;
                  }}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">{data.title}</h1>
                <p className="mt-4 text-lg font-semibold text-red-600">{data.hero.subtitle}</p>
                <p className="mt-4 text-lg text-gray-600 leading-relaxed">{data.hero.description}</p>
                <Button
                  size="lg"
                  onClick={() => handleCtaClick(data.hero)}
                  className="mt-8 btn-primary rounded-full font-semibold px-8 py-6 text-base w-full sm:w-auto"
                >
                  {data.hero.ctaText} <ArrowRight className="ml-2 h-5 w-5 inline" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Comparator Section */}
        {data.comparator && (
          <section id="comparator-section" className="py-20 lg:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.comparator.title}</h2>
                    <p className="text-gray-600 mb-6">{data.comparator.description}</p>
                    <ul className="space-y-3 mb-8">
                      {data.comparator.points.map((point, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleCtaClick(data.comparator)}
                      size="lg"
                      className="w-full btn-primary rounded-full font-semibold py-6 text-base"
                    >
                      {data.comparator.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
                  <img
                    className="mfc-service-photo" decoding="async"
                    alt={data.comparator.image?.alt || 'Comparateur – visuel'}
                    src={data.comparator.image?.src || FALLBACK_COMPARATOR}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_COMPARATOR;
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Complements Section */}
        {data.complements && (
          <section className="py-20 lg:py-24 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-white">{data.complements.title}</h2>
              <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">{data.complements.description}</p>

              <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.complements.items.map((item, i) => {
                  const Icon = Icons[item.icon] || Icons.Shield;
                  return (
                    <motion.div
                      key={i}
                      className="flex flex-col items-center space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-8 w-8 text-red-400" />
                      </div>
                      <span className="text-white font-medium text-sm">{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
};

export default InsurancePage;
