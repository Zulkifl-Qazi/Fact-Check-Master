import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRss, FaCheckCircle, FaExclamationTriangle, FaEye } from 'react-icons/fa';

const CategoryFeed = ({ category, title, icon = '📰' }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const q = new URLSearchParams();
            q.set('category', category);
            q.set('limit', '200');
            const response = await fetch(`/api/posts?${q.toString()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            const categoryPosts = Array.isArray(data) ? data : [];
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
            'verified': 'bg-green-100/10 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-900/30',
            'false': 'bg-red-100/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-900/30',
            'misleading': 'bg-orange-100/10 text-orange-700 dark:text-orange-400 border-orange-200/50 dark:border-orange-900/30',
            'disputed': 'bg-yellow-100/10 text-yellow-700 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-900/30',
            'investigating': 'bg-blue-100/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30',
            'pending': 'bg-yellow-100/10 text-yellow-700 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-900/30'
        };
        return badges[status] || 'bg-gray-100/10 text-gray-700 dark:text-gray-400 border-gray-200/50 dark:border-slate-800/30';
    };

    const handleViewMore = (postId) => {
        navigate(`/post/${postId}`);
    };

    if (loading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-slate-600 dark:text-slate-400 ml-4">Loading {(title || 'posts').toLowerCase()}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-400">Error loading {(title || 'posts').toLowerCase()}: {error}</p>
                <button 
                    onClick={loadPosts}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div id={category} className="w-full">
                <div className="flex items-center gap-3 mb-10">
                    <span className="text-3xl">{icon}</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                        {title || category}
                    </h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">No posts available in this category yet.</p>
            </div>
        );
    }

    return (
        <div id={category} className="w-full">
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-4xl">{icon}</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
                            {title || category}
                        </h2>
                    </div>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        Verified fact-checks and updates
                    </p>
                </motion.div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden hover:shadow-lg border border-slate-100 dark:border-slate-800/60 transition-all duration-300 max-w-sm mx-auto"
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
                                    <div className="absolute top-2 right-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(post.fact_check_status)}`}>
                                            {getStatusIcon(post.fact_check_status)}
                                            <span className="ml-1 capitalize">{post.fact_check_status}</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Post Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                                    {post.title}
                                </h3>

                                <div 
                                    className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />

                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                                    <span>By {post.author || 'Admin'}</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => handleViewMore(post.id)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        <FaEye style={{ marginRight: '8px', width: '14px', height: '14px' }} />
                                        View More
                                    </button>
                                    
                                    {post.source_url && (
                                        <a
                                            href={post.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm transition-colors duration-200"
                                        >
                                            Source
                                            <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
        </div>
    );
};

export default CategoryFeed;
