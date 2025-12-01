// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from '../components/Carousel';
import LiveFeed from '../components/LiveFeed';
import About from '../components/About';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we should scroll to Latest News
    if (location.state?.scrollToFeed) {
      setTimeout(() => {
        const liveFeedSection = document.getElementById('live-feed');
        if (liveFeedSection) {
          const offset = 80;
          const elementPosition = liveFeedSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
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