// src/components/Footer.jsx
import React from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaGithub, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <footer style={{ 
      background: 'rgb(88, 28, 135)',
      borderTop: '2px solid rgba(168, 85, 247, 0.4)',
      boxShadow: '0 -10px 15px rgba(0, 0, 0, 0.3)',
      color: 'white'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '80px', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Logo Section - Similar to Navbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(244, 114, 182, 0.6))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
              }}>
                <FaShieldAlt style={{ color: 'white', fontSize: '20px' }} />
              </div>
            </div>
            <div>
              <h3 style={{ 
                background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(244, 114, 182))', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                margin: '0'
              }}>Fact Check Master</h3>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'rgba(255, 255, 255, 0.7)', 
                margin: '0',
                fontWeight: '500'
              }}>Fighting misinformation since 2024</p>
            </div>
          </div>

          {/* Navigation Links - Working Version */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <a 
              href="#home"
              onClick={(e) => handleLinkClick(e, 'home')}
              style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: 'rgba(255, 255, 255, 0.7)', 
                textDecoration: 'none', 
                transition: 'all 200ms',
                cursor: 'pointer'
              }} 
              onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} 
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Home
            </a>
            <a 
              href="#fact-checks"
              onClick={(e) => handleLinkClick(e, 'fact-checks')}
              style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: 'rgba(255, 255, 255, 0.7)', 
                textDecoration: 'none', 
                transition: 'all 200ms',
                cursor: 'pointer'
              }} 
              onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} 
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Live Feed
            </a>
            <a 
              href="#about"
              onClick={(e) => handleLinkClick(e, 'about')}
              style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: 'rgba(255, 255, 255, 0.7)', 
                textDecoration: 'none', 
                transition: 'all 200ms',
                cursor: 'pointer'
              }} 
              onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} 
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              About
            </a>
            <a 
              href="/contact"
              style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: 'rgba(255, 255, 255, 0.7)', 
                textDecoration: 'none', 
                transition: 'all 200ms' 
              }} 
              onMouseEnter={(e) => e.target.style.color = 'rgb(168, 85, 247)'} 
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
            >
              Contact
            </a>
          </div>

          {/* Social Media - Styled like Navbar buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a 
              href="https://twitter.com/fcheckmaster" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'all 200ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(29, 161, 242, 0.15)'; 
                e.currentTarget.style.color = 'rgb(29, 161, 242)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; 
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; 
              }}
            >
              <FaTwitter style={{ fontSize: '1rem' }} />
            </a>

            <a 
              href="https://www.facebook.com/share/14MbJJKH8mD/?mibextid=wwXIfr" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'all 200ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(24, 119, 242, 0.15)'; 
                e.currentTarget.style.color = 'rgb(24, 119, 242)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; 
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; 
              }}
            >
              <FaFacebook style={{ fontSize: '1rem' }} />
            </a>

            <a 
              href="https://linkedin.com/company/fact-check-master" 
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'all 200ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(0, 119, 181, 0.15)'; 
                e.currentTarget.style.color = 'rgb(0, 119, 181)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; 
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; 
              }}
            >
              <FaLinkedin style={{ fontSize: '1rem' }} />
            </a>

            <a 
              href="https://github.com/Zulkifl-Qazi/fact-check-master" 
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 0.65rem',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'all 200ms',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; 
                e.currentTarget.style.color = 'white'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; 
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; 
              }}
            >
              <FaGithub style={{ fontSize: '1rem' }} />
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div style={{ 
          borderTop: '1px solid rgba(168, 85, 247, 0.2)', 
          paddingTop: '1rem', 
          paddingBottom: '1rem', 
          textAlign: 'center' 
        }}>
          <p style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.6)', 
            margin: '0',
            fontWeight: '500'
          }}>
            © {new Date().getFullYear()} Fact Check Master. All rights reserved. • Fighting misinformation one fact at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;