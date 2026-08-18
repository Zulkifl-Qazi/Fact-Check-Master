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
    <div className="w-full flex flex-col gap-16 md:gap-20 pb-16 md:pb-24 relative">
      <div id="top" className="absolute top-0 pointer-events-none" />
      
      {/* HERO EDITORIAL GRID - loads eagerly (above the fold on desktop) */}
      <div className="order-2 md:order-1">
        <HeroEditorialGrid />
      </div>
      
      {/* LiveFeed (Latest News) */}
      <div className="order-1 md:order-2 w-full pt-0">
        <Suspense fallback={
          <section id="live-feed" className="w-full pt-4 md:pt-12 pb-12 bg-white dark:bg-slate-950">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
              <div className="mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <div className="h-8 w-48 rounded skeleton mb-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.9fr] lg:grid-cols-[6fr_2.9fr_2.9fr] gap-8">
                <div className="h-[300px] rounded-lg skeleton" />
                <div className="h-[300px] rounded-lg skeleton" />
                <div className="h-[300px] rounded-lg skeleton" />
              </div>
            </div>
          </section>
        }>
          <LiveFeed searchQuery={searchQuery} showOnly="latest" />
        </Suspense>
      </div>

      {/* Articles & Guides Section */}
      <div className="order-3 w-full">
        <Suspense fallback={<div className="w-full py-10" />}>
          <ArticlesSection />
        </Suspense>
      </div>

      {/* LiveFeed (More Latest News) */}
      <div className="order-4 w-full">
        <Suspense fallback={<div className="w-full py-10" />}>
          <LiveFeed searchQuery={searchQuery} showOnly="more" />
        </Suspense>
      </div>
      
      {/* View All News Button */}
      <div className="order-5 w-full text-center py-4">
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
      
      {/* About Section */}
      <div className="order-6 w-full">
        <Suspense fallback={<div className="w-full py-10" />}>
          <About />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;