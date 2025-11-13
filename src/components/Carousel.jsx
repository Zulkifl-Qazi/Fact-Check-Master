import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import backImage from '../assets/back.jpg';

const Carousel = () => {
  const slides = [
    {
      id: 1,
      title: "Breaking Misinformation",
      description: "Real-time analysis of viral claims and false narratives spreading across social media platforms. We monitor thousands of sources simultaneously to catch and debunk misinformation before it spreads further.",
      fullDetails: "Our advanced algorithms detect emerging false claims within minutes. Expert analysts then provide comprehensive fact-checks with citations and sources.",
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      icon: "🔍",
      stat: "10,000+ Claims Verified",
      color: "blue"
    },
    {
      id: 2,
      title: "Collaborative Verification",
      description: "Expert community of journalists, researchers, and fact-checkers working together to identify and debunk false narratives with precision and accountability.",
      fullDetails: "Our global network of certified fact-checkers collaborates in real-time using our platform to cross-verify information and reach consensus on complex claims.",
      gradient: "from-purple-600 via-purple-500 to-pink-500",
      icon: "👥",
      stat: "5,000+ Active Fact Checkers",
      color: "purple"
    },
    {
      id: 3,
      title: "Evidence-Based Reporting",
      description: "Every fact-check is backed by detailed research, peer-reviewed sources, and transparent methodology. We provide comprehensive citations for complete transparency.",
      fullDetails: "Our reports include original research, academic sources, government data, and expert opinions. Each claim is verified through multiple independent sources.",
      gradient: "from-green-600 via-green-500 to-emerald-500",
      icon: "📊",
      stat: "99.9% Accuracy Rate",
      color: "green"
    },
    {
      id: 4,
      title: "Transparent & Trustworthy",
      description: "Our methodology, sources, and decision-making process are fully transparent. We maintain editorial independence and publish corrections promptly when errors occur.",
      fullDetails: "We publish our funding sources, conflict-of-interest policies, and correction procedures. Every fact-check is auditable and traceable.",
      gradient: "from-orange-600 via-red-500 to-red-600",
      icon: "✓",
      stat: "24/7 Monitoring & Updates",
      color: "red"
    }
  ];

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, slides.length]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <section 
      id="carousel"
      className="w-full"
      style={{
        background: 'linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(30,27,50,0.7) 50%, rgba(15,23,42,0.9) 100%)',
        paddingBottom: '3rem',
        position: 'relative',
        zIndex: '15',
        marginTop: 0,
      }}
    >
      {/* Image Section - Full Width, No Gap */}
      <div
        className="w-full relative"
        style={{
          backgroundImage: `url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          position: 'relative',
        }}
      >
        {/* Dark overlay ONLY for image - using pseudo-element strategy */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.70) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Content with HIGHER z-index - bypasses overlay completely */}
        <div 
          className="relative max-w-7xl mx-auto text-center"
          style={{
            zIndex: 20,
            position: 'relative',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight" 
              style={{ 
                textShadow: '0 0 20px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.95)',
                color: '#ffffff',
                fontWeight: '900',
                textDecoration: 'none',
              }}
            >
              Why Choose <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Fact Check Master</span>
            </h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-bold"
              style={{ 
                textShadow: '0 0 18px rgba(0,0,0,0.95), 0 2px 5px rgba(0,0,0,0.95)',
                color: '#ffffff'
              }}
            >
              Our comprehensive platform combines cutting-edge technology with expert analysis to combat misinformation and protect the integrity of public discourse.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* CAROUSEL BOX - LARGER & PREMIUM */}
        <div className="relative group mt-12">
          {/* Main Carousel Slide Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-500/50" 
            style={{ 
              minHeight: '480px',
              background: 'linear-gradient(135deg, rgba(20,30,60,0.9), rgba(40,20,60,0.9))',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(168, 85, 247, 0.2)'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slides[current].gradient}`}
              >
                {/* Premium animated overlay */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.2),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_50%)]"></div>
                </div>

                {/* Animated background orbs */}
                <motion.div 
                  className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl opacity-40"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.6), transparent)',
                  }}
                  animate={{ x: [0, 30, 0], y: [0, 15, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-35"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent)',
                  }}
                  animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
                  transition={{ duration: 7, repeat: Infinity }}
                />

                {/* Content - Centered */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center text-white px-8 py-16 md:px-12 md:py-20">
                  {/* Icon - Larger */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 100 }}
                    className="text-7xl md:text-8xl mb-6 drop-shadow-lg"
                  >
                    {slides[current].icon}
                  </motion.div>

                  {/* Title - Larger */}
                  <motion.h3
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-3xl md:text-5xl font-black mb-4 drop-shadow-lg leading-tight max-w-2xl"
                  >
                    {slides[current].title}
                  </motion.h3>

                  {/* Description - Longer with more details */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base md:text-lg text-white/95 mb-6 leading-relaxed drop-shadow max-w-2xl"
                  >
                    {slides[current].description}
                  </motion.p>

                  {/* Additional Details */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="text-sm md:text-base text-white/80 mb-8 leading-relaxed drop-shadow max-w-2xl italic"
                  >
                    {slides[current].fullDetails}
                  </motion.p>

                  {/* Stat Badge - Larger */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="px-8 py-3 bg-white/25 backdrop-blur-xl border-2 border-white/60 rounded-full text-white font-bold text-base md:text-lg drop-shadow-lg shadow-2xl hover:bg-white/35 transition-all"
                  >
                    ✨ {slides[current].stat}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Left Arrow - Simple < symbol */}
            <motion.button
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white text-4xl font-bold transition-all duration-300"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0 8px',
              }}
              aria-label="Previous slide"
            >
              &lt;
            </motion.button>

            {/* Right Arrow - Simple > symbol */}
            <motion.button
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white text-4xl font-bold transition-all duration-300"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0 8px',
              }}
              aria-label="Next slide"
            >
              &gt;
            </motion.button>
          </motion.div>
        </div>

        {/* Navigation Dots - Below Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-4 mt-10"
        >
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.8 }}
              className={`transition-all duration-400 rounded-full ${
                index === current
                  ? 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 w-12 h-3 shadow-lg shadow-purple-500/60 ring-2 ring-white/30'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-pink-500 w-3 h-3 shadow-md hover:shadow-lg hover:shadow-purple-500/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Carousel;
