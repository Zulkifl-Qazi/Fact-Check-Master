import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRss, FaCheckCircle, FaExclamationTriangle, FaEye, FaTimes } from 'react-icons/fa';

const LiveFeed = ({ searchQuery = '' }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Loading posts from /api/posts...');
            const response = await fetch('/api/posts');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Posts loaded:', data);
            
            // Filter only latest-news category posts (or posts without category for backward compatibility)
            const latestNewsPosts = Array.isArray(data) 
                ? data.filter(post => !post.category || post.category === 'latest-news')
                : [];
            
            setPosts(latestNewsPosts);
        } catch (err) {
            console.error('Failed to load posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
        
        // Refresh posts every 30 seconds
        const interval = setInterval(loadPosts, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'verified':
                return <FaCheckCircle className="text-green-500" />;
            case 'false':
                return <FaExclamationTriangle className="text-red-500" />;
            case 'misleading':
                return <FaExclamationTriangle className="text-orange-500" />;
            default:
                return <FaRss className="text-blue-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'verified': 'bg-green-100 text-green-800 border-green-200',
            'false': 'bg-red-100 text-red-800 border-red-200',
            'misleading': 'bg-orange-100 text-orange-800 border-orange-200',
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
        
        return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const handleViewMore = (post) => {
        navigate(`/post/${post.id}`);
    };

    // Filter posts based on search query
    const filteredPosts = posts.filter(post => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            post.title.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query) ||
            (post.author && post.author.toLowerCase().includes(query))
        );
    });

    const clearSearch = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800 rounded-lg shadow-lg p-6 text-center border border-slate-700"
            >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading latest news...</p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800 rounded-lg shadow-lg p-6 text-center border border-slate-700"
            >
                <FaExclamationTriangle className="text-red-500 text-2xl mx-auto mb-4" />
                <p className="text-red-600 mb-2">Failed to load posts</p>
                <p className="text-gray-400 text-sm">{error}</p>
                <button 
                    onClick={loadPosts}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </motion.div>
        );
    }

    return (
        <section className="py-16 bg-slate-900" id="live-feed">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest News'}
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        {searchQuery ? `Found ${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''}` : 'Real-time updates on the latest fact-checks and verified information'}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <FaTimes />
                            Clear Search
                        </button>
                    )}
                </motion.div>

                {filteredPosts.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <FaRss className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-400">
                            {searchQuery ? `No posts found matching "${searchQuery}"` : 'No posts available at the moment.'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                View All Posts
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-sm mx-auto border border-slate-700"
                            >
                                {post.image_url && (
                                    <div className="relative">
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            className="w-full h-32 object-cover"
                                            loading="lazy"
                                        />
                                        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(post.fact_check_status)}`}>
                                                {getStatusIcon(post.fact_check_status)}
                                                <span className="ml-1 capitalize">{post.fact_check_status}</span>
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    
                                    <div 
                                        className="text-gray-300 text-sm mb-3 line-clamp-3"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                        <span>By {post.author || 'Admin'}</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => handleViewMore(post)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '10px 16px',
                                                backgroundColor: '#8b5cf6',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                outline: 'none',
                                                boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#7c3aed';
                                                e.target.style.transform = 'translateY(-1px)';
                                                e.target.style.boxShadow = '0 4px 8px rgba(139, 92, 246, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#8b5cf6';
                                                e.target.style.transform = 'translateY(0px)';
                                                e.target.style.boxShadow = '0 2px 4px rgba(139, 92, 246, 0.3)';
                                            }}
                                        >
                                            <FaEye style={{ marginRight: '8px', width: '14px', height: '14px' }} />
                                            View More
                                        </button>
                                        
                                        {post.source_url && (
                                            <a
                                                href={post.source_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    color: '#60a5fa',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    textDecoration: 'none',
                                                    transition: 'color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.color = '#93c5fd'}
                                                onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
                                            >
                                                Source
                                                <svg style={{ marginLeft: '4px', width: '12px', height: '12px' }} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LiveFeed;