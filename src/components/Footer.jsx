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
            <div className="flex items-center gap-2 mb-3">
              <FaShieldAlt className="text-2xl text-purple-300" />
              <h3 className="text-xl font-bold">Fact Check Master</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
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
            <h4 className="text-sm font-semibold mb-3 text-purple-200 uppercase tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-1.5 text-sm">
              <li><a href="#home" className="text-gray-300 hover:text-purple-300 transition-colors duration-200">Home</a></li>
              <li><a href="#fact-checks" className="text-gray-300 hover:text-purple-300 transition-colors duration-200">Live Feed</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-purple-300 transition-colors duration-200">About Us</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-purple-300 transition-colors duration-200">Contact</a></li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1 md:col-span-4"
          >
            <h4 className="text-sm font-semibold mb-3 text-purple-200 uppercase tracking-[0.2em]">Connect With Us</h4>
            <div className="flex gap-3">
              <a href="https://twitter.com/fcheckmaster" target="_blank" rel="noopener noreferrer" className="social-button">
                <FaTwitter size={16} />
              </a>
              <a href="#" className="social-button"><FaFacebook size={16} /></a>
              <a href="#" className="social-button"><FaLinkedin size={16} /></a>
              <a href="#" className="social-button"><FaGithub size={16} /></a>
            </div>
            <p className="text-xs text-gray-400 mt-3">
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