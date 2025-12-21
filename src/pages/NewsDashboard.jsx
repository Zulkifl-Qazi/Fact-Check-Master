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

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const navHeight = 140; // Height of sticky navigation
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    scrollToSection(`#${categoryId}`);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* Sticky Navigation - AFP Style */}
      <div className="sticky top-0 z-50 bg-slate-900/98 backdrop-blur-md border-b border-slate-700/50">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1 py-3">
            <button
              onClick={() => {
                setActiveTab('latest');
                setActiveCategory(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'latest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-slate-300 hover:text-white'
              }`}
            >
              Latest news
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setActiveTab('regions')}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'regions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-slate-300 hover:text-white'
              }`}
            >
              Regions
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all flex items-center gap-1.5 ${
                activeTab === 'topics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-slate-300 hover:text-white'
              }`}
            >
              Topics
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Category Pills */}
          <div className="pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-1.5 text-sm font-semibold rounded transition-all whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600/90 text-white hover:bg-blue-500'
                  }`}
                >
                  {category.icon && <span className="mr-1.5">{category.icon}</span>}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with Better Spacing */}
      <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-16 pb-48 space-y-20">
          
          {/* Latest News Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            id="live-feed"
            className="scroll-mt-32"
          >
            <LiveFeed />
          </motion.div>

          {/* Elegant Section Divider */}
          <div className="relative py-12">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-8 py-3 bg-slate-900 text-slate-400 text-sm font-bold uppercase tracking-widest border-l-4 border-r-4 border-purple-500">
                Additional Categories
              </span>
            </div>
          </div>

          {/* World News */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            id="world-news"
            className="scroll-mt-32"
          >
            <CategoryFeed category="world-news" title="World News" icon="🌍" />
          </motion.div>

          {/* Viral Claims */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            id="viral-claims"
            className="scroll-mt-32"
          >
            <CategoryFeed category="viral-claims" title="Viral Claims" icon="🔥" />
          </motion.div>

          {/* Military Claims */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            id="military-claims"
            className="scroll-mt-32"
          >
            <CategoryFeed category="military-claims" title="Military Claims" icon="⚔️" />
          </motion.div>

          {/* Indian Claims */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            id="indian-claims"
            className="scroll-mt-32"
          >
            <CategoryFeed category="indian-claims" title="Indian Claims" icon="" />
          </motion.div>

          {/* Afghan Claims */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            id="afghan-claims"
            className="scroll-mt-32"
            style={{ marginBottom: '150px' }}
          >
            <CategoryFeed category="afghan-claims" title="Afghan Claims" icon="" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsDashboard;
