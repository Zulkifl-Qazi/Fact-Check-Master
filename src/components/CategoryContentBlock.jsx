import React, { useEffect, useState } from 'react';
import EditorialCard from './EditorialCard';
import SectionHeader from './SectionHeader';

const DEMO_POSTS_BY_CATEGORY = {
  'latest-news': [
    { id: 101, title: "Election Security: Comprehensive Audit Results Released", content: "Official audit confirms all voting systems meet security standards.", image_url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=800", category: "latest-news", fact_check_status: "verified", author: "Security Team", created_at: new Date().toISOString() },
    { id: 102, title: "Health Advisory: New Study Findings", content: "Medical researchers publish comprehensive study results.", image_url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400", category: "latest-news", fact_check_status: "verified", author: "Health Desk", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 103, title: "Technology Update: AI Guidelines", content: "New framework for artificial intelligence development released.", image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400", category: "latest-news", fact_check_status: "verified", author: "Tech Team", created_at: new Date(Date.now() - 7200000).toISOString() }
  ],
  'viral-claims': [
    { id: 201, title: "Viral Photo Exposed as Manipulated", content: "Forensic analysis reveals digital manipulation in widely shared image.", image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800", category: "viral-claims", fact_check_status: "false", author: "Digital Forensics", created_at: new Date().toISOString() },
    { id: 202, title: "Social Media Health Claims Debunked", content: "Medical experts refute trending health misinformation.", image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400", category: "viral-claims", fact_check_status: "false", author: "Medical Team", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 203, title: "Celebrity Quote Fabricated", content: "Investigation shows viral quote attributed to public figure is fabricated.", image_url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400", category: "viral-claims", fact_check_status: "false", author: "Fact Check Team", created_at: new Date(Date.now() - 7200000).toISOString() }
  ],
  'world-news': [
    { id: 301, title: "International Summit: Key Agreements", content: "Diplomatic negotiations result in new international framework.", image_url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800", category: "world-news", fact_check_status: "verified", author: "International Desk", created_at: new Date().toISOString() },
    { id: 302, title: "Climate Report: Global Findings", content: "International panel releases comprehensive climate assessment.", image_url: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400", category: "world-news", fact_check_status: "verified", author: "Climate Unit", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 303, title: "Trade Agreement Analysis", content: "Economic experts evaluate new international trade provisions.", image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400", category: "world-news", fact_check_status: "misleading", author: "Economic Team", created_at: new Date(Date.now() - 7200000).toISOString() }
  ],
  'military-claims': [
    { id: 401, title: "Defense Budget: Official Figures", content: "Department of Defense releases verified budget allocation data.", image_url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=800", category: "military-claims", fact_check_status: "verified", author: "Defense Desk", created_at: new Date().toISOString() },
    { id: 402, title: "Military Operation Details Clarified", content: "Official statement addresses public questions about recent operations.", image_url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=400", category: "military-claims", fact_check_status: "verified", author: "Military Press", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 403, title: "Equipment Claims Investigated", content: "Analysis of military capability claims versus verified specifications.", image_url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400", category: "military-claims", fact_check_status: "misleading", author: "Defense Analysis", created_at: new Date(Date.now() - 7200000).toISOString() }
  ],
  'political': [
    { id: 501, title: "Campaign Claims: Fact Check Report", content: "Independent analysis of recent political campaign statements.", image_url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800", category: "political", fact_check_status: "misleading", author: "Political Desk", created_at: new Date().toISOString() },
    { id: 502, title: "Policy Proposal Analysis", content: "Economic impact assessment of proposed legislation.", image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400", category: "political", fact_check_status: "verified", author: "Policy Team", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 503, title: "Debate Fact Check: Key Moments", content: "Verification of claims made during recent political debate.", image_url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=400", category: "political", fact_check_status: "false", author: "Debate Analysis", created_at: new Date(Date.now() - 7200000).toISOString() }
  ]
};

/**
 * CategoryContentBlock - Reusable category section with featured article + grid
 */

const CategoryContentBlock = ({ title, category, limit = 6, linkText = 'View All' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryPosts();
  }, [category]);

  const fetchCategoryPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?limit=${limit}`);
      
      if (!response.ok) {
        // Use demo data if API fails
        const demoData = DEMO_POSTS_BY_CATEGORY[category] || DEMO_POSTS_BY_CATEGORY['latest-news'];
        setPosts(demoData);
        return;
      }
      
      const data = await response.json();
      const filtered = category && category !== 'all'
        ? (Array.isArray(data) ? data.filter(p => p.category === category) : [])
        : (Array.isArray(data) ? data : []);
      
      // Use demo data if no posts found
      const finalPosts = filtered.length > 0 ? filtered : (DEMO_POSTS_BY_CATEGORY[category] || DEMO_POSTS_BY_CATEGORY['latest-news']);
      setPosts(finalPosts);
    } catch (err) {
      console.log('Using demo data - API not available');
      const demoData = DEMO_POSTS_BY_CATEGORY[category] || DEMO_POSTS_BY_CATEGORY['latest-news'];
      setPosts(demoData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-white section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={title} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-200 rounded-lg h-80 animate-pulse" />
            <div className="lg:col-span-1 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-20 h-16 bg-gray-300 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 bg-gray-300 rounded" />
                    <div className="h-4 w-full bg-gray-300 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1);

  return (
    <section className="w-full bg-white section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title={title} 
          link={`/news-dashboard${category ? `?category=${category}` : ''}`}
          linkText={linkText}
          accentColor="orange"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <EditorialCard
              post={featuredPost}
              variant="compact"
              showImage={true}
              showExcerpt={true}
            />
          </div>
          
          {/* Secondary Articles */}
          <div className="lg:col-span-1 space-y-0">
            {secondaryPosts.map((post) => (
              <EditorialCard
                key={post.id}
                post={post}
                variant="secondary"
                showImage={true}
                showExcerpt={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryContentBlock;
