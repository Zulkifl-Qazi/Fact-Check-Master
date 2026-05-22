import React, { useEffect, useState } from 'react';
import EditorialCard from './EditorialCard';

const DEMO_POSTS = [
  { id: 1, title: "Election Security Audit Complete: All Systems Verified", content: "Comprehensive security review confirms integrity of voting infrastructure across all jurisdictions.", image_url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=800", category: "latest-news", fact_check_status: "verified", author: "Security Team", created_at: new Date().toISOString() },
  { id: 2, title: "Health Officials Address Viral Supplement Claims", content: "Medical authorities issue statement regarding unverified health product claims circulating online.", image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400", category: "viral-claims", fact_check_status: "false", author: "Medical Review", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, title: "Border Operations Status Update Released", content: "Official military spokesperson provides clarification on recent border activity reports.", image_url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=400", category: "military-claims", fact_check_status: "verified", author: "Defense Desk", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, title: "Climate Summit: Key Commitments Fact Checked", content: "Analysis of climate pledges made at international summit reveals progress and gaps.", image_url: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400", category: "world-news", fact_check_status: "misleading", author: "Climate Unit", created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: 5, title: "Technology Regulation Bill: Claims Examined", content: "Fact check analysis of statements regarding proposed technology regulation legislation.", image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400", category: "political", fact_check_status: "verified", author: "Policy Team", created_at: new Date(Date.now() - 14400000).toISOString() }
];

/**
 * LiveUpdatesSection - Two-column layout with bullet list + featured article
 */

const LiveUpdatesSection = () => {
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveUpdates();
  }, []);

  const fetchLiveUpdates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?limit=6');
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.log('Using demo live updates - API not available');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2" />
                  <div className="flex-1 h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            <div className="bg-gray-200 rounded-lg h-64 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const featuredPost = posts[0];
  const updates = posts.slice(1, 5);

  return (
    <section className="w-full bg-gray-50 section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Live Updates</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wide">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Bullet List Updates */}
          <div className="space-y-4">
            {updates.map((post) => (
              <div key={post.id} className="flex gap-3 group cursor-pointer" onClick={() => window.location.href = `/post/${post.id}`}>
                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2 group-hover:bg-orange-600 transition-colors" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(post.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right: Featured Article */}
          <div>
            <EditorialCard
              post={featuredPost}
              variant="compact"
              showImage={true}
              showExcerpt={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveUpdatesSection;
