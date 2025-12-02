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
            <section className="py-16 bg-slate-900" id={category}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="text-3xl">{icon}</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                            {title}
                        </h2>
                    </div>
                    <p className="text-gray-400 text-center py-8">No posts available in this category yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-slate-900" id={category}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-10">
                    <span className="text-3xl">{icon}</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                        {title}
                    </h2>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-700 hover:border-purple-500 transition-all duration-300"
                        >
                            {/* Post Image */}
                            {post.image_url && (
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={post.image_url} 
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(post.fact_check_status)}`}>
                                            {post.fact_check_status?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Post Content */}
                            <div className="p-6">
                                <div className="flex items-start gap-2 mb-3">
                                    {getStatusIcon(post.fact_check_status)}
                                    <h3 className="text-lg font-bold text-white flex-1 line-clamp-2">
                                        {post.title}
                                    </h3>
                                </div>

                                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                    {post.content}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">
                                        {post.author || 'Fact Check Master'}
                                    </span>
                                    <button
                                        onClick={() => handleViewMore(post.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                                    >
                                        <FaEye />
                                        View More
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryFeed;
