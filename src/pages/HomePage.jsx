// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
import LiveFeed from '../components/LiveFeed';
import About from '../components/About';

const HomePage = () => {
  return (
    <div className="w-full">
      <div id="top" />
      {/* Carousel section - positioned above hero */}
      <Carousel />
      <Hero />
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