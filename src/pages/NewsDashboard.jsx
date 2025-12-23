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
    <div className="w-full min-h-screen bg-slate-950">
      {/* Spacer for navbar */}
      <div style={{ height: '80px' }}></div>

      {/* Page Title */}
      <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
          >
            Select a Category
          </motion.h1>
        </div>
      </div>

      {/* Category Blocks Grid - Only show when no category is selected */}
      {!activeCategory && (
        <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="container mx-auto px-4 py-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12"
            >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                whileHover={{ scale: 1.08, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-2xl transition-all duration-500 flex flex-col group"
                style={{
                  boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(51, 65, 85, 0.98))',
                }}
              >
                {/* Image Section */}
                <div 
                  className="w-full relative overflow-hidden"
                  style={{
                    height: '200px',
                  }}
                >
                  <img 
                    src={category.image} 
                    alt={category.label}
                    className="transition-transform duration-700 group-hover:scale-110"
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
                    background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
                  }}
                >
                  {/* Decorative line */}
                  <div 
                    className="w-12 h-1 rounded-full mb-2 transition-all duration-500 group-hover:w-20"
                    style={{
                      background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(59, 130, 246))',
                    }}
                  />
                  
                  {/* Label */}
                  <h3 
                    className="font-bold text-center transition-all duration-300 group-hover:text-purple-300"
                    style={{
                      fontSize: '22px',
                      color: 'white',
                      letterSpacing: '0.5px',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {category.label}
                  </h3>

                  {/* Description */}
                  <p 
                    className="text-center text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-300"
                    style={{
                      color: 'rgba(203, 213, 225, 0.9)',
                      maxWidth: '220px',
                    }}
                  >
                    {category.description}
                  </p>
                  
                  {/* Arrow indicator on hover */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <svg 
                      className="w-6 h-6 text-purple-400" 
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
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                    transform: 'translateX(-100%)',
                    animation: 'shine 2s infinite',
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
        <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
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
