import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';

/**
 * SectionHeader - Reusable section header with title, optional link, and divider
 * 
 * Props:
 * - title: string (required) - Section title
 * - link: string (optional) - URL for "View All" link
 * - linkText: string (optional) - Custom text for link (default: "View All")
 * - showStar: boolean (optional) - Show star icon (for "Most Popular" style)
 * - accentColor: string (optional) - 'orange' | 'red' | 'blue' (default: 'orange')
 * - className: string (optional) - Additional CSS classes
 */

const SectionHeader = ({ 
  title, 
  link = null, 
  linkText = 'View All',
  showStar = false,
  accentColor = 'orange',
  className = '' 
}) => {
  const accentClasses = {
    orange: 'text-orange-600',
    red: 'text-red-600',
    blue: 'text-blue-600'
  };

  const borderClasses = {
    orange: 'border-orange-500',
    red: 'border-red-500',
    blue: 'border-blue-500'
  };

  return (
    <div className={`flex items-center justify-between pb-3 mb-6 border-b border-gray-200 ${className}`}>
      {/* Left: Title with optional star */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h2>
        {showStar && (
          <FaStar className={`w-4 h-4 ${accentClasses[accentColor]}`} />
        )}
      </div>
      
      {/* Right: View All link */}
      {link && (
        <Link 
          to={link}
          className={`group flex items-center gap-1 text-sm font-medium ${accentClasses[accentColor]} hover:opacity-80 transition-opacity`}
        >
          <span>{linkText}</span>
          <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
