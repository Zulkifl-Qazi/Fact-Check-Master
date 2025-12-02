// src/pages/HomePage.jsx
import React from 'react';
import Carousel from '../components/Carousel';
import LiveFeed from '../components/LiveFeed';
import CategoryFeed from '../components/CategoryFeed';
import About from '../components/About';

const HomePage = () => {
  return (
    <div className="w-full">
      <div id="top" />
      {/* Carousel section */}
      <Carousel />
      {/* Main content sections */}
      <div className="w-full space-y-0">
        <div className="container mx-auto px-4 space-y-20 py-16">
          <LiveFeed />
          <CategoryFeed category="world-news" title="World News" icon="🌍" />
          <CategoryFeed category="viral-claims" title="Viral Claims" icon="🔥" />
          <CategoryFeed category="military-claims" title="Military Claims" icon="⚔️" />
          <CategoryFeed category="sports-news" title="Sports News" icon="⚽" />
          <About />
        </div>
      </div>
    </div>
  );
};

export default HomePage;