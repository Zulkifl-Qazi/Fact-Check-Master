import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaCircle } from 'react-icons/fa';
import backImage from '../assets/back.jpg';

/**
 * EditorialCard - Reusable article card component with 5 variants
 * 
 * Variants:
 * - 'hero': Large featured story with full image and overlay
 * - 'secondary': Compact card with thumbnail + headline (for middle column)
 * - 'compact': Small card for grids
 * - 'sidebar': Text-only compact card for sidebars
 * - 'numbered': Card with ranking number for Most Popular
 */

const EditorialCard = memo(({ 
  post, 
  variant = 'compact', 
  rank = null,
  showExcerpt = true,
  showImage = true,
  className = ''
}) => {
  const navigate = useNavigate();

  if (!post) return null;

  const {
    id,
    title,
    content,
    image_url,
    category,
    fact_check_status,
    author,
    created_at
  } = post;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get category display name
  const getCategoryLabel = (cat) => {
    if (!cat) return 'News';
    return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Get status badge configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'verified':
        return { 
          class: 'badge-verified', 
          icon: FaCheckCircle,
          label: 'Verified'
        };
      case 'false':
        return { 
          class: 'badge-false', 
          icon: FaTimesCircle,
          label: 'False'
        };
      case 'misleading':
        return { 
          class: 'badge-misleading', 
          icon: FaExclamationTriangle,
          label: 'Misleading'
        };
      default:
        return { 
          class: 'badge-pending', 
          icon: FaCircle,
          label: 'Pending'
        };
    }
  };

  // Strip HTML from content
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const statusConfig = getStatusConfig(fact_check_status);
  const StatusIcon = statusConfig.icon;
  const excerpt = stripHtml(content).substring(0, 120) + '...';

  // HERO VARIANT - Large featured story
  if (variant === 'hero') {
    return (
      <article 
        className={`group cursor-pointer relative rounded-xl overflow-hidden ${className}`}
        onClick={() => navigate(`/post/${id}`)}
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image_url || backImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 hero-gradient-overlay" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="badge badge-breaking text-xs">
              BREAKING
            </span>
            <span className={`badge ${statusConfig.class} text-xs`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </span>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-3 text-white/80 text-sm">
              <span className="editorial-label-accent text-white">{getCategoryLabel(category)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FaClock className="w-3 h-3" />
                {formatDate(created_at)}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-orange-300 transition-colors">
              {title}
            </h2>
            {showExcerpt && (
              <p className="text-white/80 text-base line-clamp-2 max-w-2xl">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      </article>
    );
  }

  // SECONDARY VARIANT - Compact with thumbnail (for middle column)
  if (variant === 'secondary') {
    return (
      <article 
        className={`group cursor-pointer flex gap-3 py-3 border-b border-gray-200 last:border-0 ${className}`}
        onClick={() => navigate(`/post/${id}`)}
      >
        {/* Thumbnail */}
        {showImage && (
          <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
            <img
              src={image_url || backImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${
              fact_check_status === 'verified' ? 'bg-green-500' :
              fact_check_status === 'false' ? 'bg-red-500' :
              fact_check_status === 'misleading' ? 'bg-orange-500' :
              'bg-blue-500'
            }`} />
            <span className="text-xs text-gray-500 uppercase tracking-wide">{getCategoryLabel(category)}</span>
          </div>
          <h3 className="editorial-headline-sm text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <FaClock className="w-3 h-3" />
            {formatDate(created_at)}
          </div>
        </div>
      </article>
    );
  }

  // SIDEBAR VARIANT - Text-only compact
  if (variant === 'sidebar') {
    return (
      <article 
        className={`group cursor-pointer py-3 border-b border-gray-100 last:border-0 ${className}`}
        onClick={() => navigate(`/post/${id}`)}
      >
        <div className="flex items-start gap-3">
          {rank && (
            <span className={`rank-badge flex-shrink-0 ${
              rank === 1 ? 'rank-gold' :
              rank === 2 ? 'rank-silver' :
              rank === 3 ? 'rank-bronze' :
              'rank-default'
            }`}>
              {rank}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                fact_check_status === 'verified' ? 'bg-green-500' :
                fact_check_status === 'false' ? 'bg-red-500' :
                fact_check_status === 'misleading' ? 'bg-orange-500' :
                'bg-blue-500'
              }`} />
              <span className="text-xs text-gray-400">{getCategoryLabel(category)}</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
              {title}
            </h4>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
              <FaClock className="w-3 h-3" />
              {formatDate(created_at)}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // NUMBERED VARIANT - For Most Popular with rank
  if (variant === 'numbered') {
    return (
      <article 
        className={`group cursor-pointer py-3 border-b border-gray-100 last:border-0 ${className}`}
        onClick={() => navigate(`/post/${id}`)}
      >
        <div className="flex items-center gap-3">
          <span className={`rank-badge flex-shrink-0 ${
            rank === 1 ? 'rank-gold' :
            rank === 2 ? 'rank-silver' :
            rank === 3 ? 'rank-bronze' :
            'rank-default'
          }`}>
            {rank}
          </span>
          <h4 className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug flex-1">
            {title}
          </h4>
        </div>
      </article>
    );
  }

  // COMPACT VARIANT (default) - Standard card for grids
  return (
    <article 
      className={`card-editorial group cursor-pointer ${className}`}
      onClick={() => navigate(`/post/${id}`)}
    >
      {/* Image */}
      {showImage && (
        <div className="card-image-wrapper">
          <img
            src={image_url || backImage}
            alt={title}
            className="card-image"
            loading="lazy"
          />
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`badge ${statusConfig.class}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="editorial-label-accent">{getCategoryLabel(category)}</span>
        </div>
        <h3 className="editorial-headline-md mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {title}
        </h3>
        {showExcerpt && (
          <p className="editorial-body-sm line-clamp-2 mb-3">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>By {author || 'Admin'}</span>
          <span className="flex items-center gap-1">
            <FaClock className="w-3 h-3" />
            {formatDate(created_at)}
          </span>
        </div>
      </div>
    </article>
  );
});

EditorialCard.displayName = 'EditorialCard';

export default EditorialCard;
