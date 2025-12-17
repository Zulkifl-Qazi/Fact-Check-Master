// src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import LiveFeed from '../components/LiveFeed';
import About from '../components/About';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div id="top" />
      {/* Carousel section */}
      <Carousel />
      {/* Main content sections */}
      <div className="w-full space-y-0">
        <div className="container mx-auto px-4 space-y-20 py-16">
          <LiveFeed />
          
          {/* View All News Button */}
          <div className="text-center py-8">
            <button
              onClick={() => navigate('/news-dashboard')}
              style={{ backgroundColor: '#9333ea', borderColor: '#a855f7' }}
              className="group relative inline-flex items-center gap-3 px-10 py-5 text-white font-bold text-lg rounded-lg shadow-2xl hover:brightness-110 transition-all duration-300 transform hover:scale-105 border-2"
            >
              <span>View All News Categories</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
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