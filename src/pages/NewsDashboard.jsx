import React from 'react';
import { motion } from 'framer-motion';
import LiveFeed from '../components/LiveFeed';
import CategoryFeed from '../components/CategoryFeed';

const NewsDashboard = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-gray-200 font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Live News Updates
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                📰 News Dashboard
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Your comprehensive hub for fact-checked news across all categories. 
              <span className="block mt-2 text-purple-300 font-semibold">Stay informed with verified information.</span>
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-6 md:gap-8 mt-12"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 min-w-[140px]">
                <div className="text-3xl font-bold text-white">5</div>
                <div className="text-sm text-gray-400 mt-1">Categories</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 min-w-[140px]">
                <div className="text-3xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-gray-400 mt-1">Monitoring</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-4 min-w-[140px]">
                <div className="text-3xl font-bold text-indigo-400">100%</div>
                <div className="text-sm text-gray-400 mt-1">Verified</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation Pills */}
      <div className="sticky top-16 z-40 bg-gradient-to-r from-slate-950/98 via-slate-900/98 to-slate-950/98 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Latest News', icon: '📱', href: '#live-feed', color: 'from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 border-purple-500/30' },
              { name: 'World News', icon: '🌍', href: '#world-news', color: 'from-blue-600/20 to-cyan-600/20 hover:from-blue-600/40 hover:to-cyan-600/40 border-blue-500/30' },
              { name: 'Viral Claims', icon: '🔥', href: '#viral-claims', color: 'from-orange-600/20 to-red-600/20 hover:from-orange-600/40 hover:to-red-600/40 border-orange-500/30' },
              { name: 'Military Claims', icon: '⚔️', href: '#military-claims', color: 'from-slate-600/20 to-zinc-600/20 hover:from-slate-600/40 hover:to-zinc-600/40 border-slate-500/30' },
              { name: 'Sports News', icon: '⚽', href: '#sports-news', color: 'from-green-600/20 to-emerald-600/20 hover:from-green-600/40 hover:to-emerald-600/40 border-green-500/30' }
            ].map((category, idx) => (
              <motion.a
                key={category.name}
                href={category.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`group relative px-5 py-2.5 bg-gradient-to-r ${category.color} backdrop-blur-sm border rounded-xl text-sm font-semibold text-white transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg shadow-black/20`}
              >
                <span className="text-lg mr-2 inline-block group-hover:scale-110 transition-transform">{category.icon}</span>
                <span className="relative z-10">{category.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* All News Categories */}
      <div className="w-full">
        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Section Dividers with Enhanced Styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="live-feed"
            className="scroll-mt-32"
          >
            <LiveFeed />
          </motion.div>

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-slate-950 text-slate-600 text-sm font-medium">More Categories</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="world-news"
            className="scroll-mt-32"
          >
            <CategoryFeed category="world-news" title="World News" icon="🌍" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="viral-claims"
            className="scroll-mt-32"
          >
            <CategoryFeed category="viral-claims" title="Viral Claims" icon="🔥" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="military-claims"
            className="scroll-mt-32"
          >
            <CategoryFeed category="military-claims" title="Military Claims" icon="⚔️" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            id="sports-news"
            className="scroll-mt-32"
          >
            <CategoryFeed category="sports-news" title="Sports News" icon="⚽" />
          </motion.div>

          {/* Back to Top Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center pt-16 pb-8"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 overflow-hidden"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              
              <div className="relative flex items-center gap-3">
                <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-base">Back to Top</span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewsDashboard;
