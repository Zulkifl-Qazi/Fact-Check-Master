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
      {/* Sticky Navigation - AFP Style */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-xl">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-4 pt-6 pb-4">
            <button
              onClick={() => {
                setActiveTab('latest');
                setActiveCategory(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-6 py-2.5 text-sm font-bold rounded transition-all ${
                activeTab === 'latest'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Latest news
            </button>
            
            <button
              onClick={() => setActiveTab('regions')}
              className={`px-6 py-2.5 text-sm font-bold rounded transition-all flex items-center gap-2 ${
                activeTab === 'regions'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Regions
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-6 py-2.5 text-sm font-bold rounded transition-all flex items-center gap-2 ${
                activeTab === 'topics'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Topics
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Category Pills */}
          <div className="pb-6 pt-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-6 py-2.5 text-sm font-bold rounded transition-all whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-2 ring-blue-400/50'
                      : 'bg-blue-600/90 text-white hover:bg-blue-500 shadow-md'
                  }`}
                >
                  {category.icon && <span className="mr-2 text-base">{category.icon}</span>}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-40"></div>

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
