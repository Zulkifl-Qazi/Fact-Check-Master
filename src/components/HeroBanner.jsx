import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import backImage from '../assets/back.jpg';

const HeroBanner = () => {
  return (
    <section
      id="hero-banner"
      className="relative w-full overflow-hidden"
      style={{ height: '500px' }}
    >
      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Multiple Layer Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-purple-900/40 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/30 to-black/80" />

      {/* Animated Orbs Background Effects */}
      <motion.div
        className="absolute top-10 left-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-pink-600/15 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -35, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl"
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Content Container */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Main Heading with Staggered Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-xl"
            style={{
              textShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(168,85,247,0.3)',
            }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Fact Check
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Master
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Subtitle with Fade In */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          style={{
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          Combat Misinformation. Verify Truth. Protect Democracy.
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          Your trusted platform for real-time fact-checking, comprehensive research, and verified information in the digital age.
        </motion.p>

        {/* CTA Buttons with Hover Effects */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Primary Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-bold text-white rounded-lg transition-all duration-300 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%)',
              boxShadow: '0 10px 30px rgba(168, 85, 247, 0.5)',
            }}
          >
            <FaPlay className="text-sm" />
            <span>Start Fact Checking</span>
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-bold text-white rounded-lg transition-all duration-300"
            style={{
              background: 'rgb(88, 28, 135)',
              boxShadow: '0 10px 30px rgba(88, 28, 135, 0.5)',
              border: '2px solid rgba(168, 85, 247, 0.25)',
            }}
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Animated Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-white/60 text-sm font-semibold">Scroll to explore</span>
            <svg
              className="w-6 h-6 text-purple-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Top Gradient Fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 to-transparent z-10" />

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-10" />
    </section>
  );
};

export default HeroBanner;
