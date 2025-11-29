import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRss, FaCheckCircle, FaExclamationTriangle, FaTimes, FaEye } from 'react-icons/fa';

const LiveFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

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

    const openModal = (post) => {
        console.log('Opening modal for post:', post);
        setSelectedPost(post);
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const closeModal = () => {
        setSelectedPost(null);
        document.body.style.overflow = 'unset'; // Restore scroll
    };

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        
        if (selectedPost) {
            document.addEventListener('keydown', handleEscape);
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [selectedPost]);

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
                        Latest News
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
                                    
                                    <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                                        {post.content}
                                    </p>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                        <span>By {post.author || 'Admin'}</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => openModal(post)}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                backgroundColor: '#9333ea',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                outline: 'none'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#9333ea'}
                                        >
                                            <FaEye style={{ marginRight: '6px', width: '12px', height: '12px' }} />
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

            {/* Modal for full post view */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-10 p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <FaTimes className="w-5 h-5 text-white" />
                            </button>

                            {/* Modal content */}
                            <div className="p-6 sm:p-8">
                                {/* Status badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusBadge(selectedPost.fact_check_status)}`}>
                                        {getStatusIcon(selectedPost.fact_check_status)}
                                        <span className="ml-2 capitalize">{selectedPost.fact_check_status}</span>
                                    </span>
                                </div>

                                {/* Image */}
                                {selectedPost.image_url && (
                                    <div className="mb-6">
                                        <img
                                            src={selectedPost.image_url}
                                            alt={selectedPost.title}
                                            className="w-full max-h-80 object-cover rounded-lg"
                                        />
                                    </div>
                                )}

                                {/* Title */}
                                <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                                    {selectedPost.title}
                                </h1>

                                {/* Meta info */}
                                <div className="flex items-center text-gray-400 text-sm mb-6 space-x-4">
                                    <span className="flex items-center">
                                        <span className="font-medium">By {selectedPost.author || 'Admin'}</span>
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(selectedPost.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                    {selectedPost.updated_at && selectedPost.updated_at !== selectedPost.created_at && (
                                        <>
                                            <span>•</span>
                                            <span className="text-yellow-400">Updated {new Date(selectedPost.updated_at).toLocaleDateString()}</span>
                                        </>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="prose prose-invert prose-slate max-w-none mb-8">
                                    <div className="text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
                                        {selectedPost.content}
                                    </div>
                                </div>

                                {/* Source link */}
                                {selectedPost.source_url && (
                                    <div className="pt-6 border-t border-slate-700">
                                        <h3 className="text-lg font-semibold text-white mb-3">Source</h3>
                                        <a
                                            href={selectedPost.source_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                                        >
                                            Visit Original Source
                                            <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z" />
                                            </svg>
                                        </a>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex justify-end pt-6 border-t border-slate-700 mt-8">
                                    <button
                                        onClick={closeModal}
                                        className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default LiveFeed;