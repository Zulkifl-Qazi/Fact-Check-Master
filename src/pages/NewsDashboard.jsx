import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategoryFeed from '../components/CategoryFeed';

const NewsDashboard = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { id: 'world-news', label: 'World News', icon: '🌍' },
    { id: 'viral-claims', label: 'Viral Claims', icon: '🔥' },
    { id: 'military-claims', label: 'Military Claims', icon: '⚔️' },
    { id: 'indian-claims', label: 'Indian Claims', icon: '🇮🇳' },
    { id: 'afghan-claims', label: 'Afghan Claims', icon: '🇦🇫' },
  ];

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* Spacer for navbar */}
      <div style={{ height: '80px' }}></div>

      {/* Category Blocks Grid */}
      <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-12">
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
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'ring-4 ring-purple-500' 
                    : 'hover:ring-2 hover:ring-purple-400'
                }`}
                style={{
                  background: activeCategory === category.id
                    ? 'linear-gradient(135deg, rgb(147, 51, 234), rgb(168, 85, 247), rgb(37, 99, 235))'
                    : 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9))',
                  boxShadow: activeCategory === category.id
                    ? '0 25px 50px -12px rgba(147, 51, 234, 0.6), 0 0 30px rgba(168, 85, 247, 0.4)'
                    : '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
                  border: activeCategory === category.id
                    ? '2px solid rgba(168, 85, 247, 0.8)'
                    : '1px solid rgba(71, 85, 105, 0.5)',
                  padding: '32px 24px',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px'
                }}
              >
                {/* Icon */}
                <div 
                  className="text-5xl mb-2"
                  style={{
                    filter: activeCategory === category.id 
                      ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
                      : 'none'
                  }}
                >
                  {category.icon}
                </div>
                
                {/* Label */}
                <div 
                  className="font-bold text-center"
                  style={{
                    fontSize: '18px',
                    color: 'white',
                    textShadow: activeCategory === category.id
                      ? '0 2px 10px rgba(0, 0, 0, 0.5)'
                      : 'none'
                  }}
                >
                  {category.label}
                </div>

                {/* Active indicator */}
                {activeCategory === category.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 bg-white rounded-full p-1"
                  >
                    <svg 
                      className="w-5 h-5 text-purple-600" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Show selected category posts */}
          {activeCategory && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-12"
            >
              <CategoryFeed 
                category={activeCategory} 
                title={categories.find(c => c.id === activeCategory)?.label} 
                icon={categories.find(c => c.id === activeCategory)?.icon} 
              />
            </motion.div>
          )}

          {/* Show message when no category selected */}
          {!activeCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-6">📰</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Select a Category
              </h2>
              <p className="text-gray-400 text-lg">
                Click on any category block above to view posts
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDashboard;
