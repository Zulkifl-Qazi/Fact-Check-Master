import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LiveFeed from '../components/LiveFeed';
import CategoryFeed from '../components/CategoryFeed';

const NewsDashboard = () => {
  const [activeTab, setActiveTab] = useState('latest');
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { id: 'world-news', label: 'World News', icon: '🌍' },
    { id: 'viral-claims', label: 'Viral Claims', icon: '🔥' },
    { id: 'military-claims', label: 'Military Claims', icon: '⚔️' },
    { id: 'indian-claims', label: 'Indian Claims', icon: '' },
    { id: 'afghan-claims', label: 'Afghan Claims', icon: '' },
  ];

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* Navigation Bar - Premium Style */}
      <div 
        className="fixed left-0 right-0 z-40 backdrop-blur-sm"
        style={{
          top: '80px',
          background: 'linear-gradient(to right, rgb(15, 23, 42), rgb(30, 41, 59), rgb(15, 23, 42))',
          borderTop: '1px solid rgba(168, 85, 247, 0.3)',
          borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
          {/* Main Navigation Tabs */}
          <div 
            className="flex items-center gap-5 border-b"
            style={{ 
              paddingTop: '24px', 
              paddingBottom: '20px',
              borderBottomColor: 'rgba(51, 65, 85, 0.5)'
            }}
          >
            <button
              onClick={() => {
                setActiveTab('latest');
                setActiveCategory(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`font-bold rounded-lg transition-all duration-300 ${
                activeTab === 'latest' ? '' : 'hover:scale-105'
              }`}
              style={activeTab === 'latest' 
                ? {
                    padding: '14px 40px',
                    fontSize: '16px',
                    background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(168, 85, 247), rgb(37, 99, 235))',
                    color: 'white',
                    boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.6)',
                    border: 'none'
                  }
                : {
                    padding: '14px 40px',
                    fontSize: '16px',
                    background: 'rgba(30, 41, 59, 0.7)',
                    color: 'rgb(203, 213, 225)',
                    border: '1px solid rgba(71, 85, 105, 0.5)'
                  }
              }
            >
              Latest news
            </button>
            
            <button
              onClick={() => setActiveTab('regions')}
              className={`font-bold rounded-lg transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'regions' ? '' : 'hover:scale-105'
              }`}
              style={activeTab === 'regions' 
                ? {
                    padding: '14px 40px',
                    fontSize: '16px',
                    background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(168, 85, 247), rgb(37, 99, 235))',
                    color: 'white',
                    boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.6)',
                    border: 'none'
                  }
                : {
                    padding: '14px 40px',
                    fontSize: '16px',
                    background: 'rgba(30, 41, 59, 0.7)',
                    color: 'rgb(203, 213, 225)',
                    border: '1px solid rgba(71, 85, 105, 0.5)'
                  }
              }
            >
              Regions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => setActiveTab('topics')}
              className={`font-bold rounded-lg transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'topics' ? '' : 'hover:scale-105'
              }`}
              style={activeTab === 'topics' 
                ? {
                    padding: '14px 40px',
                    fontSize: '16px',
                    background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(168, 85, 247), rgb(37, 99, 235))',
                    color: 'white',
                    boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.6)',
                    border: 'none'
                  }
                : {
                    padding: '14px 40px',
                    fontSize: '16px',
                    background: 'rgba(30, 41, 59, 0.7)',
                    color: 'rgb(203, 213, 225)',
                    border: '1px solid rgba(71, 85, 105, 0.5)'
                  }
              }
            >
              Topics
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Category Pills */}
          <div className="overflow-x-auto scrollbar-hide" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
            <div className="flex gap-4 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`font-bold rounded-lg transition-all duration-300 whitespace-nowrap ${
                    activeCategory === category.id ? '' : 'hover:scale-105'
                  }`}
                  style={activeCategory === category.id
                    ? {
                        padding: '14px 32px',
                        fontSize: '16px',
                        background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(59, 130, 246), rgb(147, 51, 234))',
                        color: 'white',
                        boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.7)',
                        border: '2px solid rgba(168, 85, 247, 0.6)',
                        transform: 'scale(1.05)'
                      }
                    : {
                        padding: '14px 32px',
                        fontSize: '16px',
                        background: 'linear-gradient(to right, rgba(37, 99, 235, 0.9), rgba(59, 130, 246, 0.9))',
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(96, 165, 250, 0.3)'
                      }
                  }
                >
                  {category.icon && <span style={{ marginRight: '10px', fontSize: '20px' }}>{category.icon}</span>}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div style={{ height: '256px' }}></div>

      {/* Content Section with Better Spacing */}
      <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-16 pb-48 space-y-20">
          
          {/* Show Latest News (all categories) when no category is selected */}
          {!activeCategory && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              id="live-feed"
              className="scroll-mt-32"
            >
              <LiveFeed />
            </motion.div>
          )}

          {/* Show selected category only */}
          {activeCategory === 'world-news' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              id="world-news"
            >
              <CategoryFeed category="world-news" title="World News" icon="🌍" />
            </motion.div>
          )}

          {activeCategory === 'viral-claims' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              id="viral-claims"
            >
              <CategoryFeed category="viral-claims" title="Viral Claims" icon="🔥" />
            </motion.div>
          )}

          {activeCategory === 'military-claims' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              id="military-claims"
            >
              <CategoryFeed category="military-claims" title="Military Claims" icon="⚔️" />
            </motion.div>
          )}

          {activeCategory === 'indian-claims' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              id="indian-claims"
            >
              <CategoryFeed category="indian-claims" title="Indian Claims" icon="" />
            </motion.div>
          )}

          {activeCategory === 'afghan-claims' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              id="afghan-claims"
            >
              <CategoryFeed category="afghan-claims" title="Afghan Claims" icon="" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDashboard;
