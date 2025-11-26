import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRss, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const LiveFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            
            setPosts(Array.isArray(data) ? data : []);
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

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800 rounded-lg shadow-lg p-6 text-center border border-slate-700"
            >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading live feed...</p>
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
                        Live Fact Check Feed
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                        Real-time updates on the latest fact-checks and verified information
                    </p>
                </motion.div>

                {posts.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <FaRss className="text-gray-400 text-4xl mx-auto mb-4" />
                        <p className="text-gray-400">No posts available at the moment.</p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, index) => (
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
                                        <div className="absolute top-2 right-2">
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
                                    
                                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                                        {post.content}
                                    </p>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                        <span>By {post.author || 'Admin'}</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    
                                    {post.source_url && (
                                        <a
                                            href={post.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium"
                                        >
                                            View Source
                                            <svg className="ml-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z" />
                                            </svg>
                                        </a>
                                    )}
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