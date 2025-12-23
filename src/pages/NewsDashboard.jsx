import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategoryFeed from '../components/CategoryFeed';
import worldNewsImg from '../assets/latest-news.jpeg';
import viralNewsImg from '../assets/viral-news.jpeg';
import militaryNewsImg from '../assets/military-news.jpeg';
import indianClaimsImg from '../assets/indian-claims.jpeg';
import afghanClaimsImg from '../assets/afghan-claims.jpeg';

const NewsDashboard = () => {
  const [activeCategory, setActiveCategory] = useState(null);

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

      {/* Category Blocks Grid - Only show when no category is selected */}
      {!activeCategory && (
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
                className={`relative overflow-hidden rounded-xl transition-all duration-300 flex flex-col ${
                  activeCategory === category.id 
                    ? 'ring-4 ring-purple-500' 
                    : 'hover:ring-2 hover:ring-purple-400'
                }`}
                style={{
                  boxShadow: activeCategory === category.id
                    ? '0 25px 50px -12px rgba(147, 51, 234, 0.6), 0 0 30px rgba(168, 85, 247, 0.4)'
                    : '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
                  border: activeCategory === category.id
                    ? '2px solid rgba(168, 85, 247, 0.8)'
                    : '1px solid rgba(71, 85, 105, 0.5)',
                  background: activeCategory === category.id
                    ? 'linear-gradient(135deg, rgb(147, 51, 234), rgb(168, 85, 247), rgb(37, 99, 235))'
                    : 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.95))',
                }}
              >
                {/* Image Section */}
                <div 
                  className="w-full relative"
                  style={{
                    height: '180px',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={category.image} 
                    alt={category.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  {/* Active indicator on image */}
                  {activeCategory === category.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 bg-white rounded-full p-1"
                      style={{ zIndex: 10 }}
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
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col items-center justify-center gap-3 flex-grow">
                  {/* Label */}
                  <div 
                    className="font-bold text-center"
                    style={{
                      fontSize: '20px',
                      color: 'white',
                      textShadow: activeCategory === category.id
                        ? '0 2px 10px rgba(0, 0, 0, 0.5)'
                        : 'none'
                    }}
                  >
                    {category.label}
                  </div>

                  {/* Description */}
                  <p 
                    className="text-center text-xs leading-relaxed"
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      maxWidth: '200px'
                    }}
                  >
                    {category.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Show message when no category selected */}
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
