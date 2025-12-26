// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaShieldAlt, FaSearch } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState('');
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
    <nav style={{ 
      position: 'sticky',
      top: '0',
      zIndex: '50',
      background: 'rgb(88, 28, 135)',
      borderBottom: '2px solid rgba(168, 85, 247, 0.4)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)',
      overflow: 'visible'
    }}>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgb(168, 85, 247)', fontWeight: 'bold', fontSize: '1.125rem', transition: 'all 300ms', textDecoration: 'none' }}>
              <div style={{ position: 'relative' }}>
                <img src={logo} alt="Logo" style={{ height: '32px', width: '32px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)' }} />
                <div style={{ position: 'absolute', top: '-4px', right: '-4px' }}>
                  <FaShieldAlt style={{ color: 'rgb(168, 85, 247)', fontSize: '12px' }} />
                </div>
              </div>
              <span style={{ background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(244, 114, 182))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fact Check Master</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="navbar-desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/#top" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'all 200ms' }} onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>Home</Link>
            <Link to="/#live-feed" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'all 200ms' }} onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>Latest News</Link>
            <Link to="/news-dashboard" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'all 200ms' }} onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>News Dashboard</Link>
            <Link to="/#about" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'all 200ms' }} onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>About</Link>
            <Link to="/contact" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'all 200ms' }} onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>Contact</Link>
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              style={{
                padding: '0.5rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                transition: 'all 200ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
              aria-label="Search"
            >
              <FaSearch style={{ fontSize: '1rem' }} />
            </button>

            {/* Animated Search Bar */}
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '1rem',
              marginTop: '0.5rem',
              width: '250px',
              maxWidth: 'calc(100% - 2rem)',
              transform: isSearchOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
              opacity: isSearchOpen ? 1 : 0,
              pointerEvents: isSearchOpen ? 'auto' : 'none',
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              transformOrigin: 'top right',
              zIndex: 40
            }}>
              <input
                type="text"
                placeholder="Search facts..."
                autoFocus={isSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                style={{
                  width: '100%',
                  fontSize: '0.875rem',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(168, 85, 247, 0.6)',
                  background: 'rgb(30, 30, 50)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 12px rgba(168, 85, 247, 0.2)',
                  transition: 'all 200ms'
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgb(40, 40, 60)';
                  e.target.style.borderColor = 'rgb(168, 85, 247)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 16px rgba(168, 85, 247, 0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgb(30, 30, 50)';
                  e.target.style.borderColor = 'rgba(168, 85, 247, 0.6)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 12px rgba(168, 85, 247, 0.2)';
                }}
              />
            </div>
          </div>
          
          {/* Mobile Menu Button (3 lines hamburger) */}
          <div className="navbar-mobile-button" style={{ display: 'none' }}>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              style={{ 
                padding: '0.5rem 0.65rem', 
                borderRadius: '6px', 
                background: 'none', 
                border: 'none', 
                color: 'rgba(255, 255, 255, 0.6)', 
                cursor: 'pointer', 
                transition: 'all 200ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.background = 'none'; }}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes style={{ fontSize: '1.5rem' }} /> : <FaBars style={{ fontSize: '1.5rem' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slides down from top */}
      <div className="navbar-mobile-menu" style={{ 
        display: 'none',
        maxHeight: isOpen ? '400px' : '0',
        opacity: isOpen ? '1' : '0',
        overflow: 'hidden',
        transition: 'all 300ms ease-in-out'
      }}>
        <div style={{ 
          padding: '1rem', 
          paddingBottom: '1rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem', 
          background: 'rgb(76, 22, 120)', 
          borderTop: '2px solid rgba(168, 85, 247, 0.4)', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)' 
        }}>
          <Link 
            to="/#top" 
            style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
            onClick={handleLinkClick}
          >
            🏠 Home
          </Link>
          <Link 
            to="/#live-feed" 
            style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
            onClick={handleLinkClick}
          >
            📱 Latest News
          </Link>
          <Link 
            to="/news-dashboard" 
            style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
            onClick={handleLinkClick}
          >
            📊 News Dashboard
          </Link>
          <Link 
            to="/#about" 
            style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
            onClick={handleLinkClick}
          >
            ℹ️ About
          </Link>
          <Link 
            to="/contact" 
            style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
            onClick={handleLinkClick}
          >
            ✉️ Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;