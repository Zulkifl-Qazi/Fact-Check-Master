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
      {/* Hero Section - Redesigned */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-900/40"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Gradient Mesh Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Live Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 mb-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-xs font-semibold text-gray-300 tracking-widest uppercase">Live Updates</span>
            </motion.div>

            {/* Main Heading with Enhanced Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                News Dashboard
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-8"></div>
            </motion.div>
            
            {/* Subheading with Better Styling */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              Comprehensive fact-checking and verification across all news categories
            </motion.p>

            {/* Stats Cards - Professional Design */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-6 md:gap-8 mt-16 max-w-5xl mx-auto"
            >
              {[
                { value: '5', label: 'News Categories', sublabel: 'Tracked', gradient: 'from-purple-500 to-purple-600' },
                { value: '24/7', label: 'Active Monitoring', sublabel: 'Real-time', gradient: 'from-blue-500 to-blue-600' },
                { value: '100%', label: 'Verified Sources', sublabel: 'Accuracy', gradient: 'from-green-500 to-green-600' }
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                  className="flex-1 min-w-[180px] max-w-[220px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className={`text-5xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-3`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-white font-semibold mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.sublabel}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation - Professional Design */}
      <div className="sticky top-16 z-40 bg-slate-900/98 backdrop-blur-xl border-b border-slate-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center items-center gap-4">
            {[
              { name: 'Latest News', href: '#live-feed' },
              { name: 'World News', href: '#world-news' },
              { name: 'Viral Claims', href: '#viral-claims' },
              { name: 'Military Updates', href: '#military-claims' },
              { name: 'Sports News', href: '#sports-news' }
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
        </div>
      </div>

      {/* Content Section with Better Spacing */}
      <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-16 pb-32 space-y-20">
          
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

          {/* Sports News */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            id="sports-news"
            className="scroll-mt-32 mb-24"
          >
            <CategoryFeed category="sports-news" title="Sports News" icon="⚽" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsDashboard;
