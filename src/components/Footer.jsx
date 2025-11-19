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

          {/* Social Media */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1 md:col-span-7"
          >
            <h4 className="text-sm font-bold mb-6 text-white uppercase tracking-wider flex items-center gap-2">
              <span className="inline-block w-1 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></span>
              Connect With Us
            </h4>
            <div className="flex gap-4 mb-6">
              <a href="https://twitter.com/fcheckmaster" target="_blank" rel="noopener noreferrer" className="group relative p-4 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 hover:from-cyan-500/30 hover:to-cyan-600/20 rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/25">
                <FaTwitter size={20} className="text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300" />
              </a>
              <a href="https://www.facebook.com/share/14MbJJKH8mD/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="group relative p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 hover:from-blue-500/30 hover:to-blue-600/20 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/25">
                <FaFacebook size={20} className="text-blue-300 group-hover:text-blue-200 transition-colors duration-300" />
              </a>
              <a href="#" className="group relative p-4 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 hover:from-indigo-500/30 hover:to-indigo-600/20 rounded-xl border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-indigo-500/25">
                <FaLinkedin size={20} className="text-indigo-300 group-hover:text-indigo-200 transition-colors duration-300" />
              </a>
              <a href="#" className="group relative p-4 bg-gradient-to-br from-gray-500/20 to-gray-600/10 hover:from-gray-500/30 hover:to-gray-600/20 rounded-xl border border-gray-500/20 hover:border-gray-400/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-gray-500/25">
                <FaGithub size={20} className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300" />
              </a>
            </div>
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg p-4 border border-purple-500/20">
              <p className="text-sm text-gray-300 leading-relaxed flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                Stay updated with our latest fact-checks and fight misinformation together
              </p>
            </div>
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