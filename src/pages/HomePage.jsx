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
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-2xl">📊</span>
              <span>View All News Categories</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              Explore World News, Viral Claims, Military Claims, Sports News and more
            </p>
          </div>
          
          <About />
        </div>
      </div>
    </div>
  );
};

export default HomePage;