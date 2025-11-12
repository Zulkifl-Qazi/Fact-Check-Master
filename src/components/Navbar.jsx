// src/components/Navbar.jsx
import React, { useState } from 'react';
import { FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{ 
      position: 'sticky',
      top: '0',
      zIndex: '50',
      background: 'rgb(88, 28, 135)',
      borderBottom: '2px solid rgba(168, 85, 247, 0.4)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/#top" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'all 200ms' }} onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>Home</Link>
            <Link to="/#fact-checks" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'all 200ms' }} onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>Live Feed</Link>
            <Link to="/#about" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'all 200ms' }} onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>About</Link>
            <Link to="/contact" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'all 200ms' }} onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}>Contact</Link>
            <Link to="/admin/login" style={{ fontSize: '0.875rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', padding: '0.45rem 0.75rem', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = 'white'; }} onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.color = 'rgba(255, 255, 255, 0.8)'; }}>Admin</Link>
            
            {/* Search Bar */}
            <input 
              type="text" 
              placeholder="Search facts..." 
              style={{ 
                fontSize: '0.875rem', 
                padding: '0.5rem 0.75rem', 
                borderRadius: '6px', 
                border: '1px solid rgba(168, 85, 247, 0.4)', 
                background: 'rgba(0, 0, 0, 0.2)', 
                color: 'rgba(255, 255, 255, 0.8)',
                width: '200px',
                transition: 'all 200ms'
              }}
              onFocus={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; e.target.style.borderColor = 'rgb(168, 85, 247)'; e.target.style.boxShadow = '0 0 8px rgba(168, 85, 247, 0.3)'; }}
              onBlur={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.2)'; e.target.style.borderColor = 'rgba(168, 85, 247, 0.4)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          
          {/* Mobile Menu Button */}
          <div style={{ display: 'none' }}>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              style={{ padding: '0.5rem', borderRadius: '6px', background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', transition: 'all 200ms' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'; e.currentTarget.style.background = 'none'; }}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes style={{ fontSize: '1rem' }} /> : <FaBars style={{ fontSize: '1rem' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div style={{ 
        display: 'none',
        maxHeight: isOpen ? '256px' : '0',
        opacity: isOpen ? '1' : '0',
        overflow: 'hidden',
        transition: 'all 300ms'
      }}>
        <div style={{ padding: '0.5rem', paddingBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'rgb(76, 22, 120)', borderTop: '2px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)' }}>
          <Link 
            to="/#top" 
            style={{ display: 'block', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms' }}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/#fact-checks" 
            style={{ display: 'block', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms' }}
            onClick={() => setIsOpen(false)}
          >
            Live Feed
          </Link>
          <Link 
            to="/#about" 
            style={{ display: 'block', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms' }}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/admin/login" 
            style={{ display: 'block', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>
          <Link 
            to="/contact" 
            style={{ display: 'block', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', borderRadius: '6px', transition: 'all 200ms' }}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;