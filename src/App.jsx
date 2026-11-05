import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from "react-helmet";
import siteConfig from "@/config/siteConfig";
import { supabase } from "@/lib/supabase";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { campaignSource } from '@/lib/funnel';

import Home from "@/pages/Home";
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const PartnersPage = lazy(() => import('@/pages/PartnersPage'));
const ComparatorPage = lazy(() => import('@/pages/ComparatorPage'));
const InsurancePage = lazy(() => import('@/pages/InsurancePage'));
const EngagementPage = lazy(() => import('@/pages/EngagementPage'));
const CollectiveDiscountPage = lazy(() => import('@/pages/CollectiveDiscountPage'));
const DeclarationImpots = lazy(() => import('@/pages/DeclarationImpots'));
const AdminFiscalDashboard = lazy(() => import('@/pages/AdminFiscalDashboard'));
const AdminFiscalDetail = lazy(() => import('@/pages/AdminFiscalDetail'));
const AdminComparatorDashboard = lazy(() => import('@/pages/AdminComparatorDashboard'));
const CabinetLogin = lazy(() => import('@/pages/CabinetLogin'));
const SubsidyHelpPage = lazy(() => import('@/pages/SubsidyHelpPage'));
const LamalCompare = lazy(() => import('@/pages/LamalCompare'));
const Privacy = lazy(() => import('@/pages/Privacy'));
import '@/premium.css';
import AdsConsent from "@/components/layout/AdsConsent";

const ThemeInjector = () => {
  const { themeColors } = siteConfig.theme;
  const cssVariables = Object.entries(themeColors)
    .map(([key, value]) => `--${key}: ${value};`)
    .join("\n");

  return (
    <Helmet>
      <style>{`:root { ${cssVariables} }`}</style>
    </Helmet>
  );
};

const ProtectedAdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(!!session?.user);
      setLoading(false);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/cabinet-login" replace />;
  }

  return children;
};

const PageLayout = () => {
  const location = useLocation();
  useEffect(() => { campaignSource(); }, [location.search]);
  const { toast } = useToast();

  const showToast = (options = {}) => {
    toast({
      title:
        options?.title ||
        "🚧 Cette fonctionnalité n'est pas encore implémentée",
      description:
        options?.description ||
        "Mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochaine requête ! 🚀",
      variant: options?.variant || "default",
      duration: 4000,
    });
  };

  return (
    <>
      <Helmet>
        <title>{siteConfig.meta.title}</title>
        <meta name="description" content={siteConfig.meta.description} />
        <meta name="keywords" content={siteConfig.meta.keywords} />
        <meta property="og:title" content={siteConfig.meta.ogTitle} />
        <meta
          property="og:description"
          content={siteConfig.meta.ogDescription}
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_CH" />
      </Helmet>

      <div className="flex min-h-screen flex-col bg-white text-gray-800">
        <Header showToast={showToast} />

        <main className="flex-grow pt-20">
          <Suspense fallback={<div className="premium-container" role="status" style={{paddingTop:80,paddingBottom:80}}>Chargement de votre espace…</div>}><AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home showToast={showToast} />} />
              <Route path="/confidentialite" element={<Privacy />} />
              <Route path="/aide-subside" element={<SubsidyHelpPage />} />
              <Route path="/comparaison-lamal" element={<LamalCompare />} />
              <Route path="/comparateur/assurance-maladie" element={<Navigate to="/comparaison-lamal" replace />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/engagement" element={<EngagementPage />} />
              <Route path="/partenaires" element={<PartnersPage />} />
              <Route
                path="/rabais-collectif"
                element={<CollectiveDiscountPage />}
              />
              <Route
                path="/declaration-impots"
                element={<DeclarationImpots />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/cabinet-login" element={<CabinetLogin />} />

              <Route
                path="/admin/dossiers-fiscaux"
                element={
                  <ProtectedAdminRoute>
                    <AdminFiscalDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/dossiers-fiscaux/:id"
                element={
                  <ProtectedAdminRoute>
                    <AdminFiscalDetail />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/comparateur"
                element={
                  <ProtectedAdminRoute>
                    <AdminComparatorDashboard />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/comparateur/:type"
                element={<ComparatorPage showToast={showToast} />}
              />
              <Route
                path="/assurances/:category/:slug"
                element={<InsurancePage showToast={showToast} />}
              />
            </Routes>
          </AnimatePresence></Suspense>
        </main>

        <Footer showToast={showToast} />
        {siteConfig.whatsapp.enabled && !['/', '/aide-subside', '/comparaison-lamal'].includes(location.pathname) && <WhatsAppButton />}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ThemeInjector />
      <ScrollToTop />
      <PageLayout />
      <AdsConsent />
      <Toaster />
    </Router>
  );
}

export default App;
