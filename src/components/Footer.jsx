// src/components/Footer.jsx
import React from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub, FaShieldAlt, FaHome, FaRss, FaInfoCircle, FaEnvelope, FaArrowRight } from 'react-icons/fa';
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
            <h4 className="text-sm font-bold mb-6 text-white uppercase tracking-wider flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></span>
              Quick Links
            </h4>
            <div className="flex flex-col space-y-3">
              {[
                { href: "#home", icon: FaHome, label: "Home" },
                { href: "#fact-checks", icon: FaRss, label: "Live Feed" },
                { href: "#about", icon: FaInfoCircle, label: "About Us" },
                { href: "#contact", icon: FaEnvelope, label: "Contact" }
              ].map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className="group flex items-center gap-3 text-rgba(255,255,255,0.7) hover:text-rgb(168,85,247) transition-all duration-200 text-sm font-medium"
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  <link.icon className="text-purple-400 group-hover:text-purple-300 transition-colors duration-200" />
                  {link.label}
                </motion.a>
              ))}
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