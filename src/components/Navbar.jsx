// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaShieldAlt, FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import useDarkMode from '../hooks/useDarkMode';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileDashboardOpen, setIsMobileDashboardOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState('');
  const [colorTheme, setTheme] = useDarkMode();
  const navigate = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Close mobile menu on resize to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Handle search submission
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-800/50 shadow-sm transition-colors duration-300 overflow-visible">
      <style>{`
        @media (max-width: 767px) {
          .navbar-desktop-menu {
            display: none !important;
          }
          .navbar-mobile-button {
            display: block !important;
          }
          .navbar-mobile-menu {
            display: block !important;
          }
        }
        @media (min-width: 768px) {
          .navbar-desktop-menu {
            display: flex !important;
          }
          .navbar-mobile-button {
            display: none !important;
          }
          .navbar-mobile-menu {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-slate-100 transition-colors duration-200" style={{ textDecoration: 'none' }}>
              <div className="relative">
                <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg shadow-md" />
                <div className="absolute -top-1 -right-1">
                  <FaShieldAlt className="text-blue-600 dark:text-blue-500 text-[10px]" />
                </div>
              </div>
              <span>Fact Check Master</span>
            </Link>
          </div>
          
          {/* Desktop Menu - Modern Glassmorphism Navigation */}
          <div className="navbar-desktop-menu items-center gap-6">
            <Link to="/#top" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" style={{ textDecoration: 'none' }}>Home</Link>
            <Link to="/#live-feed" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" style={{ textDecoration: 'none' }}>Latest News</Link>
            
            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <Link to="/news-dashboard" className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" style={{ textDecoration: 'none', padding: '0.5rem 0' }}>
                News Dashboard
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms', transform: isCategoriesOpen ? 'rotate(180deg)' : 'rotate(0)' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </Link>
              
              {/* Dropdown Menu */}
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200/50 dark:border-slate-800/50 rounded-xl shadow-xl p-3 min-w-[220px] z-50 flex flex-col gap-1 transition-all duration-200"
                style={{
                  transform: `translateX(-50%) ${isCategoriesOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)'}`,
                  opacity: isCategoriesOpen ? 1 : 0,
                  pointerEvents: isCategoriesOpen ? 'auto' : 'none',
                }}
              >
                {[
                  { path: '/news-dashboard?category=breaking-news', label: 'Featured / Breaking' },
                  { path: '/news-dashboard?category=trending-news', label: 'Trending' },
                  { path: '/news-dashboard?category=latest-news', label: 'Latest News' },
                  { path: '/news-dashboard?category=world-news', label: 'World News' },
                  { path: '/news-dashboard?category=military-claims', label: 'Military Claims' },
                  { path: '/news-dashboard?category=indian-claims', label: 'Indian Claims' },
                  { path: '/news-dashboard?category=afghan-claims', label: 'Afghan Claims' }
                ].map((cat, i) => (
                  <Link 
                    key={i} 
                    to={cat.path} 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                    style={{ textDecoration: 'none' }}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/about" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" style={{ textDecoration: 'none' }}>About</Link>
            <Link to="/contact" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" style={{ textDecoration: 'none' }}>Contact</Link>
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg border-none bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center justify-center cursor-pointer"
              aria-label="Search"
            >
              <FaSearch className="text-sm" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(colorTheme)}
              className="p-2 rounded-lg border-none bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center justify-center cursor-pointer"
              title={colorTheme === 'dark' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {colorTheme === 'dark' ? <FaMoon className="text-sm" /> : <FaSun className="text-sm" />}
            </button>

            {/* Animated Search Bar */}
            <div 
              className="absolute top-full right-4 mt-2 w-64 max-w-[calc(100%-2rem)] z-50 origin-top-right transition-all duration-300"
              style={{
                transform: isSearchOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
                opacity: isSearchOpen ? 1 : 0,
                pointerEvents: isSearchOpen ? 'auto' : 'none',
              }}
            >
              <input
                type="text"
                placeholder="Search facts..."
                autoFocus={isSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full text-sm px-3 py-2 rounded-lg border border-blue-200/50 dark:border-blue-800/50 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-lg transition-all duration-200 focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          {/* Mobile Menu Button (3 lines hamburger) */}
          <div className="navbar-mobile-button" style={{ display: 'none' }}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(colorTheme)}
                className="p-2 rounded-lg border-none bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center justify-center cursor-pointer"
                title={colorTheme === 'dark' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {colorTheme === 'dark' ? <FaMoon className="text-sm" /> : <FaSun className="text-sm" />}
              </button>
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 rounded-lg bg-transparent border-none text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200 flex items-center justify-center cursor-pointer"
                aria-label="Toggle menu"
              >
                {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navbar */}
      <div className="border-t border-b border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-start md:justify-center gap-5 overflow-x-auto scrollbar-none subnav-container">
          <style>{`
            .subnav-container::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Bold Label */}
          <div className="flex items-center gap-1 font-bold text-xs text-red-500 uppercase tracking-wider flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
              <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            <span>Trending</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5">
            {[
              { path: '/news-dashboard?category=political', label: 'Politics' },
              { path: '/news-dashboard?category=technology', label: 'Technology' },
              { path: '/news-dashboard?category=health', label: 'Health' },
              { path: '/news-dashboard?category=sports', label: 'Sports' },
              { path: '/news-dashboard?category=world-news', label: 'World News' },
              { path: '/news-dashboard?category=viral-claims', label: 'Viral Claims' }
            ].map((cat, i) => (
              <Link
                key={i}
                to={cat.path}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                style={{
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slides down from top */}
      <div 
        className="navbar-mobile-menu transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: isOpen ? '650px' : '0',
          opacity: isOpen ? '1' : '0',
          overflow: 'hidden',
        }}
      >
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 shadow-lg flex flex-col gap-1 transition-colors duration-300">
          <Link 
            to="/#top" 
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            style={{ textDecoration: 'none' }}
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link 
            to="/#live-feed" 
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            style={{ textDecoration: 'none' }}
            onClick={handleLinkClick}
          >
            Latest News
          </Link>
          <Link 
            to="/news-dashboard?category=trending-news" 
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            style={{ textDecoration: 'none' }}
            onClick={handleLinkClick}
          >
            Trending
          </Link>
          
          {/* Collapsible News Dashboard Menu */}
          <div>
            <div 
              className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              onClick={() => setIsMobileDashboardOpen(!isMobileDashboardOpen)}
            >
              <span>News Dashboard</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 200ms', transform: isMobileDashboardOpen ? 'rotate(180deg)' : 'rotate(0)' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
            {isMobileDashboardOpen && (
              <div className="pl-4 flex flex-col gap-1 mt-1 border-l-2 border-slate-200/50 dark:border-slate-800/50 ml-4">
                <Link 
                  to="/news-dashboard"
                  className="block px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                  style={{ textDecoration: 'none' }}
                  onClick={handleLinkClick}
                >
                  View Dashboard Overview
                </Link>
                {[
                  { path: '/news-dashboard?category=breaking-news', label: 'Featured / Breaking' },
                  { path: '/news-dashboard?category=trending-news', label: 'Trending' },
                  { path: '/news-dashboard?category=latest-news', label: 'Latest News' },
                  { path: '/news-dashboard?category=world-news', label: 'World News' },
                  { path: '/news-dashboard?category=military-claims', label: 'Military Claims' },
                  { path: '/news-dashboard?category=indian-claims', label: 'Indian Claims' },
                  { path: '/news-dashboard?category=afghan-claims', label: 'Afghan Claims' }
                ].map((cat, i) => (
                  <Link 
                    key={i} 
                    to={cat.path} 
                    className="block px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150"
                    style={{ textDecoration: 'none' }}
                    onClick={handleLinkClick}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link 
            to="/about" 
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            style={{ textDecoration: 'none' }}
            onClick={handleLinkClick}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            style={{ textDecoration: 'none' }}
            onClick={handleLinkClick}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;