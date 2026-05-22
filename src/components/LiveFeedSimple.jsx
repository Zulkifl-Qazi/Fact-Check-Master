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

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-4 border border-blue-200">
                            <FaRss className="text-blue-600" />
                            <span className="text-gray-800 font-semibold text-sm">Live Updates</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 drop-shadow-sm">
                            Live <span className="text-blue-600">Fact Checks</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Stay informed with real-time fact-checking updates and verified information from our expert team.
                        </p>
                        
                        <div className="text-gray-500">Loading latest fact checks...</div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center">
                        <FaExclamationTriangle className="text-red-500 text-4xl mb-4 mx-auto" />
                        <h3 className="text-xl text-gray-900 mb-4">Unable to load fact checks</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button 
                            onClick={loadPosts}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-4 border border-blue-200">
                        <FaRss className="text-blue-600" />
                        <span className="text-gray-800 font-semibold text-sm">Live Updates</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 drop-shadow-sm">
                        Live <span className="text-blue-600">Fact Checks</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Stay informed with real-time fact-checking updates and verified information from our expert team.
                    </p>
                </motion.div>

                {/* Posts Display */}
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <FaExclamationTriangle className="text-gray-400 text-4xl mb-4 mx-auto" />
                        <p className="text-gray-600 text-lg font-semibold mb-6">No fact-checks available at the moment</p>
                        <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                            Our team is working around the clock to bring you the latest verified information.
                            Check back soon for updates!
                        </p>
                        <button 
                            onClick={loadPosts}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 hover:shadow-md transition-all duration-300"
                            >
                                {/* Author Info */}
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {(post.author || 'F')[0]}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-gray-900 font-semibold">{post.author || 'Fact Check Master'}</div>
                                        <div className="text-gray-500 text-sm">@fcheckmaster</div>
                                    </div>
                                    <div className="ml-auto">
                                        <FaCheckCircle className="text-green-500" title="Verified" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-gray-900 font-bold text-lg mb-3">{post.title}</h3>
                                <div 
                                    className="text-gray-700 mb-4 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />

                                {/* Image */}
                                {post.image_url && (
                                    <div className="mb-4">
                                        <img 
                                            src={post.image_url} 
                                            alt="Post image" 
                                            className="w-full h-48 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Source Link */}
                                {post.source_url && post.source_url !== '#' && (
                                    <div className="mb-4">
                                        <a 
                                            href={post.source_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                                        >
                                            View Source →
                                        </a>
                                    </div>
                                )}

                                {/* Meta */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="text-xs text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-green-600 font-semibold">
                                        {post.fact_check_status || 'Verified'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LiveFeed;