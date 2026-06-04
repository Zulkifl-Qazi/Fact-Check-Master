import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

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
  }, []);

  return (
    <BrowserRouter>
    <ScrollToHash />
    <div className="relative flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <h1 className="sr-only">Fact Check Master - Real-Time Fact Checking & Verification</h1>
      <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] h-96 w-96 bg-blue-500/5 blur-[140px]" />
      </div>
      <Navbar />
      <main className="relative flex-grow w-full z-10">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news-dashboard" element={<NewsDashboard />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/post/:id" element={<PostView />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/about" element={<AboutPage />} />
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