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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Spacer for navbar */}
      <div style={{ height: '80px' }}></div>

      {/* Professional Header Section */}
      <div className="w-full relative overflow-hidden mb-12 md:mb-16 lg:mb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
        }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Main Title - Responsive sizing */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-3 md:mb-4 drop-shadow-2xl px-2">
              News Dashboard
            </h1>
            
            {/* Subtitle - Show category name when selected */}
            {activeCategory ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 md:mt-8"
              >
                <motion.button
                  onClick={() => setActiveCategory(null)}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 md:px-8 md:py-3.5 rounded-full transition-all duration-300 flex items-center gap-2.5 font-bold text-base md:text-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(168, 85, 247), rgb(192, 132, 252))',
                    color: 'white',
                    boxShadow: '0 15px 35px -5px rgba(147, 51, 234, 0.6), 0 0 25px rgba(147, 51, 234, 0.4)',
                  }}
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </motion.button>
                <div className="hidden sm:block h-8 md:h-10 w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent"></div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 px-2">
                  {categories.find(c => c.id === activeCategory)?.label}
                </h2>
              </motion.div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mt-4 md:mt-6 font-light px-4"
              >
                Explore curated news categories and fact-checked information
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Category Blocks Grid - Only show when no category is selected */}
      {!activeCategory && (
        <div className="w-full pb-40 md:pb-48 lg:pb-56">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
            >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-500 flex flex-col group h-full"
                style={{
                  minHeight: '380px',
                  boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(147, 51, 234, 0.2)',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(51, 65, 85, 0.98))',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.5), rgba(59, 130, 246, 0.5))',
                    padding: '2px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                {/* Image Section */}
                <div 
                  className="w-full relative overflow-hidden flex-shrink-0"
                  style={{
                    height: '180px',
                  }}
                >
                  {/* Vibrant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-purple-900/30 to-transparent z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src={category.image} 
                    alt={category.label}
                    className="transition-all duration-700 group-hover:scale-115 group-hover:brightness-125 group-hover:saturate-150"
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
                  className="p-5 md:p-7 flex flex-col items-center justify-center gap-3 md:gap-4 flex-grow relative"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
                  }}
                >
                  {/* Decorative line with glow */}
                  <div 
                    className="w-14 h-1 md:w-16 md:h-1.5 rounded-full mb-1 md:mb-2 transition-all duration-500 group-hover:w-24 md:group-hover:w-28 group-hover:h-1.5 md:group-hover:h-2"
                    style={{
                      background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(59, 130, 246), rgb(236, 72, 153))',
                      boxShadow: '0 0 20px rgba(147, 51, 234, 0.6)',
                    }}
                  />
                  
                  {/* Label */}
                  <h3 
                    className="font-black text-center transition-all duration-300 group-hover:scale-105 md:group-hover:scale-110 text-xl md:text-2xl"
                    style={{
                      background: 'linear-gradient(to right, #fff, #e0e7ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '0.5px',
                      textShadow: '0 4px 20px rgba(147, 51, 234, 0.5)',
                    }}
                  >
                    {category.label}
                  </h3>

                  {/* Description */}
                  <p 
                    className="text-center text-sm md:text-base leading-relaxed transition-all duration-300 group-hover:text-gray-100 px-2"
                    style={{
                      color: 'rgba(203, 213, 225, 0.9)',
                      maxWidth: '280px',
                    }}
                  >
                    {category.description}
                  </p>
                  
                  {/* Arrow indicator with glow */}
                  <motion.div 
                    className="mt-2 md:mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50">
                      <svg 
                        className="w-5 h-5 md:w-6 md:h-6 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced shine effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 20%, rgba(255, 255, 255, 0.2) 50%, transparent 80%)',
                    transform: 'translateX(-100%)',
                  }}
                />
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 40px rgba(147, 51, 234, 0.4), 0 0 40px rgba(147, 51, 234, 0.2)',
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
        <div className="w-full pb-40 md:pb-48 lg:pb-56">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-purple-500/20 p-4 sm:p-6 md:p-8 lg:p-10"
              style={{
                boxShadow: '0 30px 60px -15px rgba(147, 51, 234, 0.3)',
              }}
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
