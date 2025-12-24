import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRss, FaCheckCircle, FaExclamationTriangle, FaEye } from 'react-icons/fa';

const CategoryFeed = ({ category, title, icon }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/posts');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Filter posts by category
            const categoryPosts = Array.isArray(data) 
                ? data.filter(post => post.category === category)
                : [];
            
            setPosts(categoryPosts);
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
    }, [category]);

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
            'disputed': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'investigating': 'bg-blue-100 text-blue-800 border-blue-200'
        };
        return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const handleViewMore = (postId) => {
        navigate(`/post/${postId}`);
    };

    if (loading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p className="text-gray-300 ml-4">Loading {title.toLowerCase()}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-400">Error loading {title.toLowerCase()}: {error}</p>
                <button 
                    onClick={loadPosts}
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <section className="py-8" id={category}>
                <div className="max-w-7xl mx-auto">
                    <p className="text-gray-400 text-center py-8">No posts available in this category yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8" id={category}>
            <div className="max-w-7xl mx-auto">
                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-sm mx-auto border border-slate-700"
                        >
                            {/* Post Image */}
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

                            {/* Post Content */}
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
                                        onClick={() => handleViewMore(post.id)}
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
            </div>
        </section>
    );
};

export default CategoryFeed;
