// src/components/Navbar.jsx
import React, { useState } from 'react';
import { FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-purple-950/90 border-b border-purple-400/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-purple-400 font-bold text-lg transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg shadow-md" />
                <div className="absolute -top-1 -right-1">
                  <FaShieldAlt className="text-purple-400 text-xs" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Fact Check Master</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="nav-link text-sm font-medium">Home</Link>
            <a href="#fact-checks" className="nav-link text-sm font-medium">Live Feed</a>
            <a href="#about" className="nav-link text-sm font-medium">About</a>
            <Link to="/contact" className="nav-link text-sm font-medium">Contact</Link>
            <Link to="/admin/tweets" className="nav-link text-sm font-medium">Admin</Link>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <FaTimes className="text-base" /> : <FaBars className="text-base" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <div className={`md:hidden transition-all duration-300 ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-2 py-2 space-y-1 bg-purple-900/90 backdrop-blur-md border-t border-purple-400/20">
          <Link 
            to="/" 
            className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-purple-500/20 transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <a 
            href="#fact-checks" 
            className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-purple-500/20 transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            Live Feed
          </a>
          <a 
            href="#about" 
            className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-purple-500/20 transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          <Link 
            to="/contact" 
            className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-purple-500/20 transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link 
            to="/admin/tweets" 
            className="block px-3 py-2 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-purple-500/20 transition-all duration-200"
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;