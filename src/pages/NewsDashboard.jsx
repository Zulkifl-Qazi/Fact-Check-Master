import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategoryFeed from '../components/CategoryFeed';

const NewsDashboard = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { 
      id: 'world-news', 
      label: 'World News', 
      icon: '🌍',
      description: 'Global events and international breaking news',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80'
    },
    { 
      id: 'viral-claims', 
      label: 'Viral Claims', 
      icon: '🔥',
      description: 'Fact-checking trending stories and social media claims',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'
    },
    { 
      id: 'military-claims', 
      label: 'Military Claims', 
      icon: '⚔️',
      description: 'Defense updates and military operations verification',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80'
    },
    { 
      id: 'indian-claims', 
      label: 'Indian Claims', 
      icon: '🇮🇳',
      description: 'News and fact-checks from India region',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'
    },
    { 
      id: 'afghan-claims', 
      label: 'Afghan Claims', 
      icon: '🇦🇫',
      description: 'Afghanistan news and claim verification updates',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80'
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
                  boxShadow: activeCategory === category.id
                    ? '0 25px 50px -12px rgba(147, 51, 234, 0.6), 0 0 30px rgba(168, 85, 247, 0.4)'
                    : '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
                  border: activeCategory === category.id
                    ? '2px solid rgba(168, 85, 247, 0.8)'
                    : '1px solid rgba(71, 85, 105, 0.5)',
                  minHeight: '260px',
                }}
              >
                {/* Background Image with Overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.4)',
                  }}
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: activeCategory === category.id
                      ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.85), rgba(168, 85, 247, 0.85), rgba(37, 99, 235, 0.85))'
                      : 'linear-gradient(135deg, rgba(30, 41, 59, 0.75), rgba(51, 65, 85, 0.75))',
                  }}
                />

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center gap-3">
                  {/* Icon */}
                  <div 
                    className="text-5xl mb-2"
                    style={{
                      filter: activeCategory === category.id 
                        ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
                        : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                    }}
                  >
                    {category.icon}
                  </div>
                  
                  {/* Label */}
                  <div 
                    className="font-bold text-center"
                    style={{
                      fontSize: '20px',
                      color: 'white',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
                      marginBottom: '8px'
                    }}
                  >
                    {category.label}
                  </div>

                  {/* Description */}
                  <p 
                    className="text-center text-sm leading-relaxed"
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                      maxWidth: '200px'
                    }}
                  >
                    {category.description}
                  </p>
                </div>

                {/* Active indicator */}
                {activeCategory === category.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 bg-white rounded-full p-1 z-20"
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
