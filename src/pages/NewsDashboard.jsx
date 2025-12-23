import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CategoryFeed from '../components/CategoryFeed';
import worldNewsImg from '../assets/latest-news.jpeg';
import viralNewsImg from '../assets/viral-news.jpeg';
import militaryNewsImg from '../assets/military-news.jpeg';
import indianClaimsImg from '../assets/indian-claims.jpeg';
import afghanClaimsImg from '../assets/afghan-claims.jpeg';

const NewsDashboard = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    { 
      id: 'world-news', 
      label: 'World News',
      description: 'Global events and international breaking news',
      image: worldNewsImg
    },
    { 
      id: 'viral-claims', 
      label: 'Viral Claims',
      description: 'Fact-checking trending stories and social media claims',
      image: viralNewsImg
    },
    { 
      id: 'military-claims', 
      label: 'Military Claims',
      description: 'Defense updates and military operations verification',
      image: militaryNewsImg
    },
    { 
      id: 'indian-claims', 
      label: 'Indian Claims',
      description: 'News and fact-checks from India region',
      image: indianClaimsImg
    },
    { 
      id: 'afghan-claims', 
      label: 'Afghan Claims',
      description: 'Afghanistan news and claim verification updates',
      image: afghanClaimsImg
    },
  ];

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Spacer for navbar */}
      <div style={{ height: '80px' }}></div>

      {/* Professional Header Section */}
      <div className="w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
              News Dashboard
            </h1>
            
            {/* Subtitle - Show category name when selected */}
            {activeCategory ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-3 mt-6"
              >
                <button
                  onClick={() => setActiveCategory(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 border border-slate-700 hover:border-slate-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {categories.find(c => c.id === activeCategory)?.label}
                </h2>
              </motion.div>
            ) : (
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mt-4">
                Explore curated news categories and fact-checked information
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Category Blocks Grid - Only show when no category is selected */}
      {!activeCategory && (
        <div className="w-full pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-2xl transition-all duration-500 flex flex-col group shadow-2xl hover:shadow-purple-500/20"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.95))',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {/* Image Section */}
                <div 
                  className="w-full relative overflow-hidden"
                  style={{
                    height: '200px',
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                  <img 
                    src={category.image} 
                    alt={category.label}
                    className="transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>

                {/* Content Section with Enhanced Styling */}
                <div 
                  className="p-6 flex flex-col items-center justify-center gap-3 flex-grow relative"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
                  }}
                >
                  {/* Decorative line */}
                  <div 
                    className="w-12 h-1 rounded-full mb-2 transition-all duration-500 group-hover:w-20 group-hover:shadow-lg group-hover:shadow-purple-500/50"
                    style={{
                      background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(59, 130, 246))',
                    }}
                  />
                  
                  {/* Label */}
                  <h3 
                    className="font-bold text-center transition-all duration-300 group-hover:text-purple-300 group-hover:scale-105"
                    style={{
                      fontSize: '22px',
                      color: 'white',
                      letterSpacing: '0.5px',
                      textShadow: '0 2px 15px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    {category.label}
                  </h3>

                  {/* Description */}
                  <p 
                    className="text-center text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-200"
                    style={{
                      color: 'rgba(203, 213, 225, 0.85)',
                      maxWidth: '220px',
                    }}
                  >
                    {category.description}
                  </p>
                  
                  {/* Arrow indicator on hover */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <svg 
                      className="w-6 h-6 text-purple-400 group-hover:text-purple-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
                  }}
                />
                
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(147, 51, 234, 0.3)',
                  }}
                />
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
      )}

      {/* Show selected category posts - Full width when active */}
      {activeCategory && (
        <div className="w-full pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-800/50 p-6 md:p-8"
            >
              <CategoryFeed 
                category={activeCategory} 
                title={categories.find(c => c.id === activeCategory)?.label} 
              />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDashboard;
