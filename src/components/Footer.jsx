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
            <div className="grid grid-cols-1 gap-3">
              {[
                { href: "#home", icon: FaHome, label: "Home", desc: "Return to homepage" },
                { href: "#fact-checks", icon: FaRss, label: "Live Feed", desc: "Real-time fact checks" },
                { href: "#about", icon: FaInfoCircle, label: "About Us", desc: "Learn our mission" },
                { href: "#contact", icon: FaEnvelope, label: "Contact", desc: "Get in touch" }
              ].map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className="group relative flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/5 to-purple-600/5 border border-purple-500/10 hover:from-purple-500/20 hover:to-purple-600/15 hover:border-purple-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 group-hover:from-purple-500/30 group-hover:to-purple-600/20 group-hover:border-purple-400/40 transition-all duration-300">
                    <link.icon className="text-sm text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                        {link.label}
                      </span>
                      <FaArrowRight className="text-xs text-purple-400/60 group-hover:text-purple-300 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <p className="text-xs text-gray-400/80 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                      {link.desc}
                    </p>
                  </div>
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