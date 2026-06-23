// src/pages/HomePage.jsx
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeroEditorialGrid from '../components/HeroEditorialGrid';

// Lazy-load below-the-fold sections — they don't need to be in the initial bundle
const ArticlesSection = lazy(() => import('../components/ArticlesSection'));
const LiveFeed = lazy(() => import('../components/LiveFeed'));
const About = lazy(() => import('../components/About'));

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const query = searchParams.get('search');
    setSearchQuery(query || '');
    
    if (query) {
      setTimeout(() => {
        const liveFeedSection = document.getElementById('live-feed');
        if (liveFeedSection) {
          liveFeedSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  return (
    <div className="w-full">
      <div id="top" />
      
      {/* HERO EDITORIAL GRID - loads eagerly (above the fold) */}
      <HeroEditorialGrid />
      
      {/* Below-the-fold sections — lazy loaded */}
      <div className="w-full space-y-0">
        <div className="w-full space-y-20 py-16">
          {/* LiveFeed (Latest News) */}
          <Suspense fallback={
            <div id="live-feed" className="w-full py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-9 w-9 border-2 border-slate-200 dark:border-slate-800 border-t-blue-600" />
            </div>
          }>
            <LiveFeed searchQuery={searchQuery} showOnly="latest" />
          </Suspense>

          {/* Articles & Guides Section */}
          <Suspense fallback={<div className="w-full py-10" />}>
            <ArticlesSection />
          </Suspense>

          {/* LiveFeed (More Latest News) */}
          <Suspense fallback={<div className="w-full py-10" />}>
            <LiveFeed searchQuery={searchQuery} showOnly="more" />
          </Suspense>
          
          {/* View All News Button */}
          <div className="text-center py-8">
            <button
              onClick={() => navigate('/news-dashboard')}
              className="btn btn-primary btn-lg group"
            >
              <span>View All News Categories</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">-&gt;</span>
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              Explore World News, Viral Claims, Military Claims and more
            </p>
          </div>
          
          <Suspense fallback={<div className="w-full py-10" />}>
            <About />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default HomePage;