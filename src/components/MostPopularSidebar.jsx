import React, { useEffect, useState } from 'react';
import EditorialCard from './EditorialCard';
import SectionHeader from './SectionHeader';

const DEMO_POSTS = [
  { id: 1, title: "Independent Audit Confirms Election Security Measures", created_at: new Date().toISOString(), category: "latest-news", fact_check_status: "verified" },
  { id: 2, title: "Viral Health Claims Debunked by Medical Experts", created_at: new Date().toISOString(), category: "viral-claims", fact_check_status: "false" },
  { id: 3, title: "Military Operations Update from Official Sources", created_at: new Date().toISOString(), category: "military-claims", fact_check_status: "verified" },
  { id: 4, title: "Climate Data Verified by International Scientists", created_at: new Date().toISOString(), category: "world-news", fact_check_status: "verified" },
  { id: 5, title: "Political Speech Fact Check Analysis", created_at: new Date().toISOString(), category: "political", fact_check_status: "misleading" },
  { id: 6, title: "AI Misinformation Campaign Exposed", created_at: new Date().toISOString(), category: "viral-claims", fact_check_status: "false" },
  { id: 7, title: "Vaccine Safety Confirmed in Latest Study", created_at: new Date().toISOString(), category: "latest-news", fact_check_status: "verified" },
  { id: 8, title: "International Diplomatic Claims Verified", created_at: new Date().toISOString(), category: "world-news", fact_check_status: "verified" },
  { id: 9, title: "Economic Job Numbers Investigated", created_at: new Date().toISOString(), category: "political", fact_check_status: "misleading" },
  { id: 10, title: "Defense Budget Claims Fact Checked", created_at: new Date().toISOString(), category: "military-claims", fact_check_status: "verified" }
];

/**
 * MostPopularSidebar - Numbered sidebar with gold/silver/bronze rankings
 */

const MostPopularSidebar = () => {
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularPosts();
  }, []);

  const fetchPopularPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?popular=true&limit=10');
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.log('Using demo popular posts - API not available');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 space-y-3">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-7 h-7 bg-gray-200 rounded" />
            <div className="flex-1 h-5 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <SectionHeader 
        title="Most Popular" 
        showStar={true}
        accentColor="orange"
      />
      <div className="space-y-1">
        {posts.slice(0, 10).map((post, index) => (
          <EditorialCard
            key={post.id}
            post={post}
            variant="numbered"
            rank={index + 1}
            showImage={false}
            showExcerpt={false}
          />
        ))}
      </div>
    </div>
  );
};

export default MostPopularSidebar;
