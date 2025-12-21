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
      {/* Sticky Navigation - Premium Style */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-purple-500/30 shadow-2xl backdrop-blur-sm">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-5 pt-6 pb-5 border-b border-slate-700/50">
            <button
              onClick={() => {
                setActiveTab('latest');
                setActiveCategory(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-10 py-3.5 text-base font-bold rounded-lg transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'latest'
                  ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white shadow-2xl shadow-purple-600/60'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-600/50 hover:border-purple-500/50'
              }`}
            >
              Latest news
            </button>
            
            <button
              onClick={() => setActiveTab('regions')}
              className={`px-10 py-3.5 text-base font-bold rounded-lg transition-all duration-300 flex items-center gap-3 transform hover:scale-105 ${
                activeTab === 'regions'
                  ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white shadow-2xl shadow-purple-600/60'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-600/50 hover:border-purple-500/50'
              }`}
            >
              Regions
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-10 py-3.5 text-base font-bold rounded-lg transition-all duration-300 flex items-center gap-3 transform hover:scale-105 ${
                activeTab === 'topics'
                  ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-white shadow-2xl shadow-purple-600/60'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-600/50 hover:border-purple-500/50'
              }`}
            >
              Topics
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Category Pills */}
          <div className="py-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-8 py-3.5 text-base font-bold rounded-lg transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-600/70 ring-2 ring-purple-400/60 scale-105'
                      : 'bg-gradient-to-r from-blue-600/90 to-blue-500/90 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-2xl border border-blue-400/30'
                  }`}
                >
                  {category.icon && <span className="mr-2.5 text-xl">{category.icon}</span>}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-64"></div>

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
