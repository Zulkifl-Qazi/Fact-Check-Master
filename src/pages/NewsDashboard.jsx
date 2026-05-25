import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import CategoryFeed from '../components/CategoryFeed';
import worldNewsImg from '../assets/latest-news.jpeg';
import viralNewsImg from '../assets/viral-news.jpeg';
import militaryNewsImg from '../assets/military-news.jpeg';
import indianClaimsImg from '../assets/indian-claims.jpeg';
import afghanClaimsImg from '../assets/afghan-claims.jpeg';

const NEWS_DASHBOARD_CATEGORIES = [
  {
    id: 'breaking-news',
    label: 'Featured / Breaking',
    description: 'Lead stories shown on the home hero; assign posts here for the big headline slot',
    image: militaryNewsImg,
    icon: '⚡'
  },
  {
    id: 'trending-news',
    label: 'Trending',
    description: 'Editorial picks and topics getting attention right now',
    image: viralNewsImg,
    icon: '🔥'
  },
  {
    id: 'latest-news',
    label: 'Latest News',
    description: 'Recent fact-checks and verified updates across the desk',
    image: worldNewsImg,
    icon: '📰'
  },
  {
    id: 'world-news',
    label: 'World News',
    description: 'Global events and international breaking news',
    image: worldNewsImg,
    icon: '🌍'
  },
  {
    id: 'viral-claims',
    label: 'Viral Claims',
    description: 'Fact-checking trending stories and social media claims',
    image: viralNewsImg,
    icon: '📱'
  },
  {
    id: 'military-claims',
    label: 'Military Claims',
    description: 'Defense updates and military operations verification',
    image: militaryNewsImg,
    icon: '⚔️'
  },
  {
    id: 'political',
    label: 'Politics',
    description: 'Political speeches, policy claims, and election-related fact-checks',
    image: indianClaimsImg,
    icon: '🏛️'
  },
  {
    id: 'technology',
    label: 'Technology',
    description: 'Latest updates from the world of science and technology',
    image: worldNewsImg,
    icon: '💻'
  },
  {
    id: 'health',
    label: 'Health',
    description: 'Medical news, healthcare analysis, and verified wellness claims',
    image: worldNewsImg,
    icon: '🏥'
  },
  {
    id: 'sports',
    label: 'Sports',
    description: 'Sports updates, athletic events, and claim verifications',
    image: worldNewsImg,
    icon: '⚽'
  },
  {
    id: 'international',
    label: 'International',
    description: 'Global news analysis and international claim verifications',
    image: worldNewsImg,
    icon: '🌐'
  },
  {
    id: 'indian-claims',
    label: 'Indian Claims',
    description: 'News and fact-checks from India region',
    image: indianClaimsImg,
    icon: '🇮🇳'
  },
  {
    id: 'afghan-claims',
    label: 'Afghan Claims',
    description: 'Afghanistan news and claim verification updates',
    image: afghanClaimsImg,
    icon: '🇦🇫'
  }
];

const NewsDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(null);

  const validIds = useMemo(() => new Set(NEWS_DASHBOARD_CATEGORIES.map((c) => c.id)), []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && validIds.has(cat)) {
      setActiveCategory(cat);
    } else {
      setActiveCategory(null);
    }
  }, [searchParams, validIds]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchParams({ category: categoryId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearCategory = () => {
    setActiveCategory(null);
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-32">
      {/* Spacer for navbar */}
      <div className="h-28 md:h-32"></div>

      {/* Professional Header Section - Only show when no category is selected */}
      {!activeCategory && (
        <div className="w-full relative overflow-hidden mb-12 md:mb-16 lg:mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-blue-600/5 to-cyan-500/5 dark:from-blue-900/10 dark:via-slate-950/20 dark:to-cyan-950/10"></div>
          <div className="absolute inset-0 opacity-40 dark:opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(29, 78, 216, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          }}></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 dark:text-slate-100 mb-3 md:mb-4 drop-shadow-sm px-2">
                News Dashboard
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mt-4 md:mt-6 font-light px-4"
              >
                Explore curated news categories and fact-checked information
              </motion.p>
            </motion.div>
          </div>
        </div>
      )}

      {/* Category Blocks Grid - Only show when no category is selected */}
      {!activeCategory && (
        <div className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
            >
            {NEWS_DASHBOARD_CATEGORIES.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-300 flex flex-col group h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg min-h-[380px] cursor-pointer"
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.5), rgba(59, 130, 246, 0.5))',
                    padding: '2px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                {/* Image Section */}
                <div className="w-full relative overflow-hidden flex-shrink-0 h-[180px]">
                  {/* Vibrant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img 
                    src={category.image} 
                    alt={category.label}
                    className="w-full h-full object-cover block transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-125"
                  />
                </div>

                {/* Content Section with Enhanced Styling */}
                <div className="p-5 md:p-7 flex flex-col items-center justify-center gap-3 md:gap-4 flex-grow relative bg-white dark:bg-slate-900">
                  {/* Decorative line with glow */}
                  <div className="w-14 h-1 md:w-16 md:h-1.5 rounded-full mb-1 md:mb-2 transition-all duration-500 group-hover:w-24 md:group-hover:w-28 group-hover:h-1.5 md:group-hover:h-2 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 shadow-md shadow-blue-500/30" />
                  
                  {/* Label */}
                  <h3 className="font-black text-center transition-all duration-300 group-hover:scale-105 md:group-hover:scale-110 text-xl md:text-2xl text-slate-900 dark:text-slate-100 tracking-wide">
                    {category.label}
                  </h3>

                  {/* Description */}
                  <p className="text-center text-sm md:text-base leading-relaxed transition-all duration-300 px-2 text-slate-600 dark:text-slate-400 max-w-[280px]">
                    {category.description}
                  </p>
                  
                  {/* Arrow indicator with glow */}
                  <motion.div 
                    className="mt-2 md:mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-600 shadow-lg shadow-blue-500/50">
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
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 40px rgba(29, 78, 216, 0.4), 0 0 40px rgba(29, 78, 216, 0.2)',
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
        <div className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Compact navigation breadcrumb bar with Back button */}
            <div className="max-w-7xl mx-auto flex items-center justify-between py-4 mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-5 transition-colors duration-300">
              <button
                onClick={handleClearCategory}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                News Dashboard / {NEWS_DASHBOARD_CATEGORIES.find((c) => c.id === activeCategory)?.label}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6 md:p-8 lg:p-10 transition-colors duration-300"
            >
              <CategoryFeed
                category={activeCategory}
                title={NEWS_DASHBOARD_CATEGORIES.find((c) => c.id === activeCategory)?.label}
                icon={NEWS_DASHBOARD_CATEGORIES.find((c) => c.id === activeCategory)?.icon}
              />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDashboard;
