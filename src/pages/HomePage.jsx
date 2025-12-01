// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from '../components/Carousel';
import LiveFeed from '../components/LiveFeed';
import About from '../components/About';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation (e.g., /#live-feed)
    if (location.hash === '#live-feed') {
      setTimeout(() => {
        const element = document.getElementById('live-feed');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    
    // Check if we should scroll to Latest News from state
    if (location.state?.scrollToFeed) {
      setTimeout(() => {
        const liveFeedSection = document.getElementById('live-feed');
        if (liveFeedSection) {
          liveFeedSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="w-full">
      <div id="top" />
      {/* Carousel section */}
      <Carousel />
      {/* Main content sections */}
      <div className="w-full space-y-0">
        <div className="container mx-auto px-4 space-y-20 py-16">
          <LiveFeed />
          <About />
        </div>
      </div>
    </div>
  );
};

export default HomePage;