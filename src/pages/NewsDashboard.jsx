import React from 'react';
import { motion } from 'framer-motion';
import LiveFeed from '../components/LiveFeed';
import CategoryFeed from '../components/CategoryFeed';

const NewsDashboard = () => {
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950">
      {/* Hero Section - AFP Style with Image */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 bg-slate-900">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop')`
            }}
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-slate-950"></div>
        </div>

        {/* Hero Content - Positioned at bottom like AFP */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-gradient-to-t from-slate-950 via-slate-950/98 to-transparent pt-32 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Live Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-purple-600 rounded-md"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                  </span>
                  <span className="text-xs font-bold text-white tracking-wider uppercase">Live Updates</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight max-w-5xl"
                >
                  News Dashboard
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-base md:text-lg text-gray-300 max-w-3xl mb-6"
                >
                  Comprehensive fact-checking and verification across all news categories
                </motion.p>

                {/* Stats Row - Compact Design */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex flex-wrap gap-6 md:gap-8"
                >
                  {[
                    { value: '6', label: 'News Categories Tracked' },
                    { value: '24/7', label: 'Active Monitoring Real-time' },
                    { value: '100%', label: 'Verified Sources Accuracy' }
                  ].map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
                      className="flex items-baseline gap-2"
                    >
                      <span className="text-2xl md:text-3xl font-bold text-purple-400">
                        {stat.value}
                      </span>
                      <span className="text-xs md:text-sm text-gray-400 font-medium">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation - Professional Design */}
      <div className="sticky top-16 z-40 bg-slate-900/98 backdrop-blur-xl border-b border-slate-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            {/* First Row - 3 categories */}
            <div className="flex flex-wrap justify-center items-center gap-4">
              {[
                { name: 'Latest News', href: '#live-feed' },
                { name: 'World News', href: '#world-news' },
                { name: 'Viral Claims', href: '#viral-claims' }
              ].map((category, idx) => (
                <motion.button
                  key={category.name}
                  onClick={() => scrollToSection(category.href)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  style={{ backgroundColor: '#9333ea', borderColor: '#a855f7' }}
                  className="px-6 py-3 hover:brightness-110 border-2 rounded-lg text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg shadow-purple-500/50"
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
            {/* Second Row - 3 categories */}
            <div className="flex flex-wrap justify-center items-center gap-4">
              {[
                { name: 'Military Updates', href: '#military-claims' },
                { name: 'Indian Claims', href: '#indian-claims' },
                { name: 'Afghan Claims', href: '#afghan-claims' }
              ].map((category, idx) => (
                <motion.button
                  key={category.name}
                  onClick={() => scrollToSection(category.href)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx + 3) * 0.08, duration: 0.4 }}
                  style={{ backgroundColor: '#9333ea', borderColor: '#a855f7' }}
                  className="px-6 py-3 hover:brightness-110 border-2 rounded-lg text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg shadow-purple-500/50"
                >
                  {category.name}
                </motion.button>
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
