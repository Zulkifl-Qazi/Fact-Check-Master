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
              className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-full shadow-lg shadow-purple-500/20"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-400"></span>
              </span>
              <span className="text-sm font-semibold text-white tracking-wide">Live News Updates</span>
            </motion.div>

            {/* Main Heading with Enhanced Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-6xl md:text-7xl lg:text-8xl">📰</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
                News Dashboard
              </h1>
            </motion.div>
            
            {/* Subheading with Better Styling */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-4 leading-relaxed font-light"
            >
              Your comprehensive hub for fact-checked news across all categories.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base md:text-lg text-purple-300 font-medium"
            >
              ✓ Stay informed with verified information
            </motion.p>

            {/* Stats Cards - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4 md:gap-6 mt-14 max-w-4xl mx-auto"
            >
              {[
                { value: '5', label: 'Categories', icon: '📊', gradient: 'from-purple-500 to-pink-500' },
                { value: '24/7', label: 'Monitoring', icon: '🔍', gradient: 'from-blue-500 to-cyan-500' },
                { value: '100%', label: 'Verified', icon: '✓', gradient: 'from-green-500 to-emerald-500' }
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                  className="flex-1 min-w-[150px] max-w-[200px] bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform duration-300"
                >
                  <div className={`text-3xl mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent font-black`}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation - Completely Redesigned */}
      <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-2xl border-y border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
            {[
              { name: 'Latest News', icon: '📱', href: '#live-feed', gradient: 'from-purple-600 to-pink-600', shadow: 'shadow-purple-500/50' },
              { name: 'World News', icon: '🌍', href: '#world-news', gradient: 'from-blue-600 to-cyan-600', shadow: 'shadow-blue-500/50' },
              { name: 'Viral Claims', icon: '🔥', href: '#viral-claims', gradient: 'from-orange-600 to-red-600', shadow: 'shadow-orange-500/50' },
              { name: 'Military Claims', icon: '⚔️', href: '#military-claims', gradient: 'from-slate-600 to-zinc-700', shadow: 'shadow-slate-500/50' },
              { name: 'Sports News', icon: '⚽', href: '#sports-news', gradient: 'from-green-600 to-emerald-600', shadow: 'shadow-green-500/50' }
            ].map((category, idx) => (
              <motion.button
                key={category.name}
                onClick={() => scrollToSection(category.href)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className={`group relative px-6 py-3 bg-gradient-to-r ${category.gradient} rounded-xl text-sm font-bold text-white transition-all duration-300 hover:scale-110 hover:shadow-xl ${category.shadow} active:scale-95 overflow-hidden`}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <span className="relative flex items-center gap-2">
                  <span className="text-xl group-hover:scale-125 transition-transform duration-300">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section with Better Spacing */}
      <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-16 space-y-20">
          
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
          <div className="relative py-10">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-slate-400 text-sm font-semibold uppercase tracking-widest rounded-full border border-slate-700">
                More Categories
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
            className="scroll-mt-32"
          >
            <CategoryFeed category="sports-news" title="Sports News" icon="⚽" />
          </motion.div>

          {/* Back to Top - Premium Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center pt-20 pb-12"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group relative"
            >
              {/* Outer Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
              
              {/* Button Content */}
              <div className="relative px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl leading-none flex items-center">
                <div className="flex items-center gap-3 text-white">
                  <svg 
                    className="w-6 h-6 group-hover:-translate-y-2 transition-transform duration-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span className="text-lg font-bold tracking-wide">Back to Top</span>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsDashboard;
