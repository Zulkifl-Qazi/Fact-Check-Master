// src/components/Hero.jsx
import { motion } from 'framer-motion';
import { FaShieldAlt, FaSearch, FaChartLine, FaUsers } from 'react-icons/fa';

const Hero = () => {
  const features = [
    { icon: FaShieldAlt, title: "Verified Facts", desc: "Real-time fact checking" },
    { icon: FaSearch, title: "Deep Analysis", desc: "Comprehensive research" },
    { icon: FaChartLine, title: "Trend Tracking", desc: "Monitor misinformation" },
    { icon: FaUsers, title: "Community", desc: "Collaborative verification" }
  ];

  return (
    <section
      id="home"
      className="relative w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center overflow-hidden"
      style={{ minHeight: 'auto', height: 'auto', paddingBottom: '3rem' }}
    >
      {/* Solid Background - no transparency */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 z-0"></div>
      
      {/* Animated background elements - more subtle with purple */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: '8s' }}
        ></div>
        <div 
          className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '1s' }}
        ></div>
        <div 
          className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        ></div>
      </div>

      {/* Content container */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2.5 bg-purple-900/50 rounded-full px-5 py-2.5 border border-purple-500/40 shadow-lg">
            <FaShieldAlt className="text-purple-300 text-sm" />
            <span className="gradient-text text-sm font-semibold tracking-wide">Trusted Fact-Checking Platform</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-6 drop-shadow-xl"
        >
          <span className="block text-white/98">Fact Check</span>
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            Master
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-lg sm:text-xl text-white/85 leading-relaxed mb-12 drop-shadow-lg"
        >
          <span className="block mb-3 font-semibold">Countering Fake News, Propaganda, Post-Truth and Beyond The Truth Rhetoric.</span>
          <span className="block text-purple-300/95 font-medium">Your trusted source for verified information in the digital age.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16"
        >
          <button style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%)',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
          }} className="inline-flex items-center gap-2 text-white font-bold rounded-lg transition-all duration-300 px-5 py-2.5 text-sm hover:shadow-lg hover:scale-105" aria-label="Start Fact Checking">
            <span>Start Checking</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
          
          <button style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
          }} className="inline-flex items-center gap-2 text-white font-bold rounded-lg transition-all duration-300 px-5 py-2.5 text-sm hover:shadow-lg hover:scale-105" aria-label="Learn more">
            <span>Learn More</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="group bg-purple-900/40 border border-purple-500/30 rounded-xl p-5 text-center hover:bg-purple-900/60 transition-all duration-300 hover:border-purple-500/60 shadow-lg"
            >
              <feature.icon className="text-purple-300 text-2xl mx-auto mb-3 transition-transform duration-300 group-hover:scale-110 drop-shadow" />
              <h3 className="text-white/95 font-bold text-sm mb-2">{feature.title}</h3>
              <p className="text-white/70 text-xs">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center group">
            <div className="text-4xl font-black text-purple-400 mb-2 transition-all duration-300 group-hover:text-purple-300 drop-shadow-lg">10K+</div>
            <div className="text-white/70 text-sm font-semibold tracking-wider">Facts Checked</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-black text-pink-400 mb-2 transition-all duration-300 group-hover:text-pink-300 drop-shadow-lg">24/7</div>
            <div className="text-white/70 text-sm font-semibold tracking-wider">Monitoring</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-black text-purple-300 mb-2 transition-all duration-300 group-hover:text-purple-200 drop-shadow-lg">99.9%</div>
            <div className="text-white/70 text-sm font-semibold tracking-wider">Accuracy</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;