import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaArrowRight } from 'react-icons/fa';

/**
 * TrendingStrip - Horizontal trending topics strip below navbar
 * Al Jazeera style with orange left border and scrollable pills
 */

const TrendingStrip = () => {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState(null);

  // Trending topics mapped to your categories
  const topics = [
    { id: 'viral', label: 'Viral Claims', category: 'viral-claims' },
    { id: 'ai', label: 'AI Misinformation', category: 'latest-news' },
    { id: 'breaking', label: 'Breaking', category: 'latest-news' },
    { id: 'politics', label: 'Politics', category: 'political' },
    { id: 'world', label: 'World', category: 'world-news' },
    { id: 'military', label: 'Military', category: 'military-claims' },
    { id: 'health', label: 'Health', category: 'latest-news' },
    { id: 'tech', label: 'Technology', category: 'latest-news' }
  ];

  const handleTopicClick = (topic) => {
    setActiveTopic(topic.id);
    navigate(`/news-dashboard?category=${topic.category}`);
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3">
          {/* Trending Label */}
          <div className="flex-shrink-0 flex items-center gap-2 pr-4 border-r border-gray-200 mr-4">
            <FaFire className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-gray-900">Trending</span>
          </div>
          
          {/* Scrollable Topics */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicClick(topic)}
                  className={`trending-pill ${activeTopic === topic.id ? 'active' : ''}`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Optional: Live Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200 ml-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Live</span>
          </div>
        </div>
      </div>
      
      {/* Hide scrollbar styling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TrendingStrip;
