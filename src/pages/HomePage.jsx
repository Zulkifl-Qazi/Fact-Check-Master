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
      
      {/* HERO EDITORIAL GRID - loads eagerly (above the fold on ALL devices) */}
      <div style={{ minHeight: '400px' }}>
        <HeroEditorialGrid />
      </div>
      
      {/* LiveFeed (Latest News) */}
      <div className="w-full pt-0" style={{ minHeight: '350px' }}>
        <Suspense fallback={
          <section id="live-feed" className="w-full pt-4 md:pt-12 pb-12 bg-white dark:bg-slate-950" style={{ minHeight: '350px' }}>
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
              <div className="mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <div className="h-8 w-48 rounded skeleton mb-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.9fr] lg:grid-cols-[6fr_2.9fr_2.9fr] gap-8 items-start">
                {/* Col 1 skeleton — matches lead posts */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col sm:flex-row gap-5 items-start pb-6 border-b border-slate-200/50 dark:border-slate-800/50">
                    <div className="w-full sm:w-[240px] aspect-[16/10] rounded-lg skeleton flex-shrink-0" />
                    <div className="flex-grow flex flex-col gap-2 w-full">
                      <div className="h-5 w-5/6 rounded skeleton" />
                      <div className="h-4 w-full rounded skeleton" />
                      <div className="h-3 w-1/3 rounded skeleton" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="w-full sm:w-[240px] aspect-[16/10] rounded-lg skeleton flex-shrink-0" />
                    <div className="flex-grow flex flex-col gap-2 w-full">
                      <div className="h-5 w-5/6 rounded skeleton" />
                      <div className="h-4 w-full rounded skeleton" />
                      <div className="h-3 w-1/3 rounded skeleton" />
                    </div>
                  </div>
                </div>
                {/* Col 2 skeleton — matches thumbnail list */}
                <div className="hidden md:flex flex-col gap-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/50 last:border-none">
                      <div className="w-24 h-16 rounded-md skeleton flex-shrink-0" />
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="h-3 w-1/4 rounded skeleton" />
                        <div className="h-4 w-5/6 rounded skeleton" />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Col 3 skeleton — matches popular */}
                <div className="hidden lg:flex flex-col gap-4">
                  <div className="h-6 w-36 rounded skeleton mb-2" />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="py-2.5 border-b border-slate-100 dark:border-slate-800/50 flex flex-col gap-2">
                      <div className="h-4 w-full rounded skeleton" />
                      <div className="h-3 w-1/3 rounded skeleton" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        }>
          <LiveFeed searchQuery={searchQuery} showOnly="latest" />
        </Suspense>
      </div>

      {/* Articles & Guides Section */}
      <div className="w-full">
        <Suspense fallback={<div className="w-full py-10" />}>
          <ArticlesSection />
        </Suspense>
      </div>

      {/* LiveFeed (More Latest News) */}
      <div className="w-full">
        <Suspense fallback={<div className="w-full py-10" />}>
          <LiveFeed searchQuery={searchQuery} showOnly="more" />
        </Suspense>
      </div>
      
      {/* View All News Button */}
      <div className="w-full text-center py-4">
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
      <div className="w-full">
        <Suspense fallback={<div className="w-full py-10" />}>
          <About />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;