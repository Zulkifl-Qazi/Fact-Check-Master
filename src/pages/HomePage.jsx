// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeroEditorialGrid from '../components/HeroEditorialGrid';
import LiveFeed from '../components/LiveFeed';
import About from '../components/About';

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
      
      {/* HERO EDITORIAL GRID - Al Jazeera Style 3-Column Layout */}
      <HeroEditorialGrid />
      
      {/* ORIGINAL CONTENT - Restored as before */}
      <div className="w-full space-y-0">
        <div className="w-full space-y-20 py-16">
          <LiveFeed searchQuery={searchQuery} />
          
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
          
          <About />
        </div>
      </div>
    </div>
  );
};

export default HomePage;