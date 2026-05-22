import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const DEMO_BREAKING = [
  { id: 1, title: "BREAKING: Independent Audit Confirms Election Security Measures" },
  { id: 2, title: "URGENT: Viral Health Claims Debunked by Medical Experts" },
  { id: 3, title: "LIVE: Military Operations Update from Official Sources" },
  { id: 4, title: "UPDATE: Climate Data Verified by International Scientists" },
  { id: 5, title: "ALERT: AI Misinformation Campaign Exposed by Researchers" }
];

/**
 * BreakingNewsBar - Full-width breaking news ticker with pulsing live indicator
 */

const BreakingNewsBar = () => {
  const navigate = useNavigate();
  const [breakingPost, setBreakingPost] = useState(DEMO_BREAKING);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBreakingNews();
  }, []);

  const fetchBreakingNews = async () => {
    try {
      const response = await fetch('/api/posts?limit=5');
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setBreakingPost(data);
      }
    } catch (err) {
      console.log('Using demo breaking news - API not available');
    }
  };

  useEffect(() => {
    if (!breakingPost || breakingPost.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingPost.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingPost]);

  if (!breakingPost || breakingPost.length === 0) return null;

  const currentPost = breakingPost[currentIndex];

  return (
    <div className="w-full breaking-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-3">
          {/* Breaking Badge */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="breaking-pulse inline-block w-2 h-2 bg-white rounded-full"></span>
            <span className="font-bold text-sm uppercase tracking-wide">Breaking</span>
          </div>

          {/* Headline */}
          <div 
            className="flex-1 text-sm md:text-base font-medium cursor-pointer hover:underline truncate"
            onClick={() => currentPost && navigate(`/post/${currentPost.id}`)}
          >
            {currentPost ? currentPost.title : 'Loading...'}
          </div>

          {/* Arrow */}
          <button 
            onClick={() => currentPost && navigate(`/post/${currentPost.id}`)}
            className="flex-shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsBar;
