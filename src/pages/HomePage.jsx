// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Hero';
import LiveFeed from '../components/LiveFeed';
import About from '../components/About';

const HomePage = () => {
  return (
    <div className="w-full space-y-0">
      <Hero />
      <div className="container mx-auto px-4 space-y-20">
        <LiveFeed />
        <About />
      </div>
    </div>
  );
};

export default HomePage;