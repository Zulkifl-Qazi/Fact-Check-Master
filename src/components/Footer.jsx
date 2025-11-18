// src/components/Footer.jsx
import React from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub, FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white border-t border-white/5">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -top-32 -right-24 h-64 w-64 bg-gradient-to-br from-purple-500/40 to-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 bg-gradient-to-br from-indigo-500/30 to-purple-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </div>
      <div className="container relative mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/20">
                <FaShieldAlt className="text-2xl text-purple-300" />
              </div>
              <h3 className="text-xl font-bold text-white">Fact Check Master</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Dedicated to countering fake news and promoting media literacy for a well-informed society.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1 md:col-span-3"
          >
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6 hover:border-purple-400/30 transition-all duration-300">
              <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                  </svg>
                </div>
                Quick Links
              </h4>
              <nav className="space-y-3">
                <a href="#home" className="group flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-transparent to-transparent hover:from-purple-600/10 hover:to-purple-500/5 border border-transparent hover:border-purple-500/20 transition-all duration-300">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-lg transition-all duration-300 group-hover:scale-110">
                    <svg className="w-4 h-4 text-purple-300 group-hover:text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300">Home</span>
                  <svg className="w-4 h-4 text-purple-400/50 group-hover:text-purple-300 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                
                <a href="#fact-checks" className="group flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-transparent to-transparent hover:from-purple-600/10 hover:to-purple-500/5 border border-transparent hover:border-purple-500/20 transition-all duration-300">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-lg transition-all duration-300 group-hover:scale-110">
                    <svg className="w-4 h-4 text-purple-300 group-hover:text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300">Live Feed</span>
                  <svg className="w-4 h-4 text-purple-400/50 group-hover:text-purple-300 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                
                <a href="#about" className="group flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-transparent to-transparent hover:from-purple-600/10 hover:to-purple-500/5 border border-transparent hover:border-purple-500/20 transition-all duration-300">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-lg transition-all duration-300 group-hover:scale-110">
                    <svg className="w-4 h-4 text-purple-300 group-hover:text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300">About Us</span>
                  <svg className="w-4 h-4 text-purple-400/50 group-hover:text-purple-300 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                
                <a href="#contact" className="group flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-transparent to-transparent hover:from-purple-600/10 hover:to-purple-500/5 border border-transparent hover:border-purple-500/20 transition-all duration-300">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-lg transition-all duration-300 group-hover:scale-110">
                    <svg className="w-4 h-4 text-purple-300 group-hover:text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300">Contact</span>
                  <svg className="w-4 h-4 text-purple-400/50 group-hover:text-purple-300 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </nav>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1 md:col-span-4"
          >
            <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></span>
              Connect With Us
            </h4>
            <div className="flex gap-3">
              <a href="https://twitter.com/fcheckmaster" target="_blank" rel="noopener noreferrer" className="group relative p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 hover:to-purple-600/20 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20">
                <FaTwitter size={18} className="text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </a>
              <a href="#" className="group relative p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 hover:to-purple-600/20 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20">
                <FaFacebook size={18} className="text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </a>
              <a href="#" className="group relative p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 hover:to-purple-600/20 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20">
                <FaLinkedin size={18} className="text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </a>
              <a href="#" className="group relative p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 hover:to-purple-600/20 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20">
                <FaGithub size={18} className="text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
              </a>
            </div>
            <p className="text-sm text-gray-300 mt-4 leading-relaxed">
              Stay updated with our latest fact-checks
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-white/5 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400 text-xs font-medium">
            © {new Date().getFullYear()} Fact Check Master. All rights reserved.
            <span className="mx-2 text-purple-400/40">•</span>
            Fighting misinformation one fact at a time.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;