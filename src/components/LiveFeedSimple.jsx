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
            <section className="py-20 bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-purple-900/50 rounded-full px-4 py-2 mb-4 border border-purple-500/40">
                            <FaRss className="text-purple-400" />
                            <span className="text-white/90 font-semibold text-sm">Live Updates</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                            Live <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Fact Checks</span>
                        </h2>
                        <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-8">
                            Stay informed with real-time fact-checking updates and verified information from our expert team.
                        </p>
                        
                        <div className="text-white/70">Loading latest fact checks...</div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center">
                        <FaExclamationTriangle className="text-yellow-400 text-4xl mb-4 mx-auto" />
                        <h3 className="text-xl text-white mb-4">Unable to load fact checks</h3>
                        <p className="text-white/70 mb-6">{error}</p>
                        <button 
                            onClick={loadPosts}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-900/50 rounded-full px-4 py-2 mb-4 border border-purple-500/40">
                        <FaRss className="text-purple-400" />
                        <span className="text-white/90 font-semibold text-sm">Live Updates</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                        Live <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Fact Checks</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto">
                        Stay informed with real-time fact-checking updates and verified information from our expert team.
                    </p>
                </motion.div>

                {/* Posts Display */}
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <FaExclamationTriangle className="text-yellow-400 text-4xl mb-4 mx-auto" />
                        <p className="text-white/70 text-lg font-semibold mb-6">No fact-checks available at the moment</p>
                        <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
                            Our team is working around the clock to bring you the latest verified information.
                            Check back soon for updates!
                        </p>
                        <button 
                            onClick={loadPosts}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
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
                                className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                            >
                                {/* Author Info */}
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {(post.author || 'F')[0]}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-white font-semibold">{post.author || 'Fact Check Master'}</div>
                                        <div className="text-purple-300 text-sm">@fcheckmaster</div>
                                    </div>
                                    <div className="ml-auto">
                                        <FaCheckCircle className="text-green-400" title="Verified" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-white font-bold text-lg mb-3">{post.title}</h3>
                                <div 
                                    className="text-white/80 mb-4 leading-relaxed"
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
                                            className="text-purple-300 hover:text-purple-200 text-sm font-medium underline"
                                        >
                                            View Source →
                                        </a>
                                    </div>
                                )}

                                {/* Meta */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="text-xs text-white/50">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-green-400 font-semibold">
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