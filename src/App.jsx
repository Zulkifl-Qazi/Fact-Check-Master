import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { AuthProvider } from './hooks/useAuth';
import AuthModal from './components/AuthModal';

const NewsDashboard = lazy(() => import('./pages/NewsDashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminFeedback = lazy(() => import('./pages/AdminFeedback'));
const AdminPosts = lazy(() => import('./pages/AdminPosts'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const DeviceManagement = lazy(() => import('./pages/DeviceManagement'));
const PostView = lazy(() => import('./pages/PostView'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ArticleView = lazy(() => import('./pages/ArticleView'));
const ArticlesList = lazy(() => import('./pages/ArticlesList'));
const AdminArticles = lazy(() => import('./pages/AdminArticles'));
const AdminComments = lazy(() => import('./pages/AdminComments'));
const PressConference = lazy(() => import('./pages/PressConference'));


function App() {
  useEffect(() => {
    // Set document title and meta description
    document.title = 'Fact Check Master - Real-Time Fact Checking & Verification';
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Fact Check Master is a real-time fact-checking platform dedicated to verifying viral news, social media claims, and countering misinformation.';

    // Lazy load Google AdSense on first user interaction to prevent render blocking
    let adsenseLoaded = false;
    const loadAdsense = () => {
      if (adsenseLoaded) return;
      adsenseLoaded = true;
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5110446565839848';
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      // Clean up event listeners immediately
      window.removeEventListener('scroll', loadAdsense);
      window.removeEventListener('mousemove', loadAdsense);
      window.removeEventListener('touchstart', loadAdsense);
    };

    window.addEventListener('scroll', loadAdsense, { passive: true });
    window.addEventListener('mousemove', loadAdsense, { passive: true });
    window.addEventListener('touchstart', loadAdsense, { passive: true });

    return () => {
      window.removeEventListener('scroll', loadAdsense);
      window.removeEventListener('mousemove', loadAdsense);
      window.removeEventListener('touchstart', loadAdsense);
    };
  }, []);

  return (
    <BrowserRouter>
    <AuthProvider>
      <ScrollToHash />
      <SEOManager />
      <div className="relative flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <a href="#main-content" className="skip-link" style={{ position: 'absolute', top: '-100px' }}>Skip to content</a>
        <h1 className="sr-only">Fact Check Master - Real-Time Fact Checking & Verification</h1>
        <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
          <div className="absolute bottom-[-15%] right-[-10%] h-96 w-96 bg-blue-500/5 blur-[140px]" />
        </div>
        <Navbar />
        <AuthModal />
        <main id="main-content" className="relative flex-grow w-full z-10 pt-16 md:pt-[104px]">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news-dashboard" element={<NewsDashboard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/post/:id" element={<PostView />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/articles" element={<ArticlesList />} />
              <Route path="/articles/:slug" element={<ArticleView />} />
              <Route path="/press-conference" element={<PressConference />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/feedback"
                element={
                  <RequireAdmin>
                    <AdminFeedback />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/posts"
                element={
                  <RequireAdmin>
                    <AdminPosts />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/articles"
                element={
                  <RequireAdmin>
                    <AdminArticles />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/comments"
                element={
                  <RequireAdmin>
                    <AdminComments />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/devices"
                element={
                  <RequireAdmin>
                    <DeviceManagement />
                  </RequireAdmin>
                }
              />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <Analytics />
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

// Scroll to anchors across routes like "/#fact-checks" and "/#about"
function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    // If a hash exists, smooth-scroll to it with an offset for the sticky navbar
    if (location.hash) {
      const id = location.hash.replace('#', '');
      
      // Retry mechanism to ensure element is in DOM
      const scrollToElement = (attempts = 0) => {
        const el = document.getElementById(id);
        if (el) {
          const navOffset = 115; // approx navbar height with sub-navbar
          const rect = el.getBoundingClientRect();
          const absoluteY = rect.top + window.scrollY - navOffset;
          window.scrollTo({ top: absoluteY < 0 ? 0 : absoluteY, behavior: 'smooth' });
        } else if (attempts < 10) {
          // Retry after 100ms if element not found, up to 10 times (1 second total)
          setTimeout(() => scrollToElement(attempts + 1), 100);
        }
      };
      
      // Start scrolling attempt after initial delay
      setTimeout(() => scrollToElement(), 150);
    }
    // Only scroll to top if explicitly navigating to home without a hash
    else if (location.pathname === '/' && !location.state?.preventScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);
  return null;
}

// Dynamically manages page titles and canonical link tags for SEO on route transitions
function SEOManager() {
  const location = useLocation();

  useEffect(() => {
    // 1. Dynamic Canonical Link Tag Update
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    const cleanUrl = 'https://www.factcheckmaster.com' + location.pathname;
    link.setAttribute('href', cleanUrl);

    // 2. Fallback titles for static pages (dynamic pages set their own)
    const titles = {
      '/': 'Fact Check Master - Real-Time Fact Checking & Verification',
      '/articles': 'Articles & Guides - Fact Check Master',
      '/news-dashboard': 'News Dashboard - Fact Check Master',
      '/about': 'About Us - Fact Check Master',
      '/contact': 'Contact Us - Fact Check Master',
      '/privacy-policy': 'Privacy Policy - Fact Check Master',
      '/terms-of-service': 'Terms of Service - Fact Check Master'
    };

    if (titles[location.pathname]) {
      document.title = titles[location.pathname];
    }
  }, [location]);

  return null;
}

// Simple client-side guard for admin routes using localStorage
function RequireAdmin({ children }) {
  const [ok, setOk] = React.useState(null);
  React.useEffect(() => {
    try {
      const logged = localStorage.getItem('af_logged_in') === '1';
      setOk(logged);
    } catch {
      setOk(false);
    }
  }, []);
  if (ok === null) return null; // render nothing until we know
  return ok ? children : <Navigate to="/admin/login" replace />;
}