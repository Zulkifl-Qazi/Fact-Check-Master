// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NewsDashboard from './pages/NewsDashboard';
import Contact from './pages/Contact';
import AdminFeedback from './pages/AdminFeedback';
import AdminPosts from './pages/AdminPosts';
import AdminLogin from './pages/AdminLogin';
import PostView from './pages/PostView';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Set document title and meta description
    document.title = 'Fact Check Master';
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Countering Fake News, Propaganda, Post-Truth and Beyond The Truth Rhetoric.';
  }, []);

  return (
    <BrowserRouter>
    <ScrollToHash />
    <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-gradient-to-br from-purple-950 via-slate-950 to-black text-white">
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] h-96 w-96 bg-fuchsia-500/10 blur-[140px]" />
      </div>
      <Navbar />
      <main className="relative flex-grow w-full z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news-dashboard" element={<NewsDashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/post/:id" element={<PostView />} />
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
        </Routes>
      </main>
      <Footer />
    </div>
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
          const navOffset = 80; // approx navbar height
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