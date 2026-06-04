// src/components/Footer.jsx - Updated Nov 24, 2025 - Footer navigation working with useNavigate
import React from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 shadow-sm text-slate-900 dark:text-slate-100 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between min-h-[80px] py-6 gap-6 flex-wrap">
          
          {/* Logo Section - Similar to Navbar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
                <FaShieldAlt className="text-white text-xl" />
              </div>
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg leading-tight m-0">Fact Check Master</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium m-0">Fighting misinformation since 2024</p>
            </div>
          </div>

          {/* Navigation Links - Mobile Responsive */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 order-2 md:order-none w-full md:w-auto">
            {[
              { path: '/#top', label: 'Home' },
              { path: '/#live-feed', label: 'Latest News' },
              { path: '/about', label: 'About' },
              { path: '/contact', label: 'Contact' },
              { path: '/privacy-policy', label: 'Privacy Policy' },
              { path: '/terms-of-service', label: 'Terms' }
            ].map((link, idx) => (
              <button 
                key={idx}
                onClick={() => handleNavigation(link.path)}
                className="text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1.5 md:px-3 md:py-2 rounded-md transition-all duration-200 bg-transparent border-none cursor-pointer whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Social Media - Mobile Optimized */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <a 
              href="https://twitter.com/fcheckmaster" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on Twitter"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center"
            >
              <FaTwitter className="text-base" />
            </a>

            <a 
              href="https://www.facebook.com/share/14MbJJKH8mD/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center"
            >
              <FaFacebook className="text-base" />
            </a>

            <a 
              href="https://linkedin.com/company/fact-check-master" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on LinkedIn"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center"
            >
              <FaLinkedin className="text-base" />
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/50 py-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium m-0">
            © {new Date().getFullYear()} Fact Check Master. All rights reserved. • Fighting misinformation one fact at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;