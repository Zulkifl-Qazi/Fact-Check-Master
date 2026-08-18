import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaRss, FaCheckCircle, FaExclamationTriangle, FaEye } from 'react-icons/fa';
import { vercelImg } from '../utils/vercelImage';

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

    const renderLeadCard = (post) => {
        if (!post) return null;
        return (
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2 relative overflow-hidden rounded-2xl group cursor-pointer shadow-sm hover:shadow-lg border border-slate-100 dark:border-slate-800/60 transition-all duration-300 bg-slate-950 min-h-[340px] md:min-h-[380px] lg:min-h-[440px] w-full"
                onClick={() => handleViewMore(post.id)}
            >
                {post.image_url && (
                    <>
                        {/* Blurred background */}
                        <img
                            src={vercelImg(post.image_url, 640, 75)}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-[-20px] w-full h-full object-cover blur-xl brightness-50 z-0 pointer-events-none select-none"
                            loading="lazy"
                            decoding="async"
                        />
                        {/* Contained image */}
                        <img
                            src={vercelImg(post.image_url, 640, 75)}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-contain block z-10 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </>
                )}
                {/* Always-on gradient overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                
                {/* Fact Check Badge */}
                <div className="absolute top-4 right-4 z-30">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-slate-900/80 backdrop-blur-sm ${getStatusBadge(post.fact_check_status)}`}>
                        {getStatusIcon(post.fact_check_status)}
                        <span className="ml-1.5 capitalize">{post.fact_check_status}</span>
                    </span>
                </div>

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30 flex flex-col justify-end">
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase text-white bg-blue-600 mb-3 w-fit rounded-sm shadow-sm">
                        Featured
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight m-0 drop-shadow-md transition-colors duration-200">
                        {post.title}
                    </h2>
                    {post.content && (
                        <div 
                            className="text-xs sm:text-sm text-slate-200/90 mt-2.5 leading-relaxed max-w-2xl line-clamp-2 drop-shadow-sm"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    )}
                    <p className="text-[11px] text-slate-400 mt-4 m-0 tracking-wide font-medium">
                        By {post.author || 'Admin'} · {new Date(post.created_at).toLocaleDateString()}
                    </p>
                </div>
            </motion.div>
        );
    };

    const renderFeaturedSecondaryCard = (post, index) => {
        if (!post) return null;
        return (
            <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between h-[160px] md:h-[180px] lg:h-[210px] w-full"
                onClick={() => handleViewMore(post.id)}
            >
                <div className="flex h-full w-full">
                    {/* Image left */}
                    {post.image_url && (
                        <div className="w-[40%] relative overflow-hidden flex-shrink-0 bg-slate-950">
                            <img
                                src={vercelImg(post.image_url, 480, 75)}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-[-10px] w-full h-full object-cover blur-lg brightness-50 z-0 pointer-events-none select-none"
                                loading="lazy"
                                decoding="async"
                            />
                            <img
                                src={vercelImg(post.image_url, 480, 75)}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-contain block z-10 transition-transform duration-500 group-hover:scale-[1.04]"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        </div>
                    )}
                    
                    {/* Text right */}
                    <div className="p-4 flex flex-col justify-between flex-grow min-w-0">
                        <div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border mb-2 ${getStatusBadge(post.fact_check_status)}`}>
                                {getStatusIcon(post.fact_check_status)}
                                <span className="ml-1 capitalize">{post.fact_check_status}</span>
                            </span>
                            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-snug m-0 line-clamp-3">
                                {post.title}
                            </h3>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 m-0">
                            {new Date(post.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
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
                    {icon && <span className="text-3xl">{icon}</span>}
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                        {title || category}
                    </h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">No posts available in this category yet.</p>
            </div>
        );
    }

    const hasFeaturedLayout = posts.length >= 3;
    const featuredLead = hasFeaturedLayout ? posts[0] : null;
    const featuredSecondary = hasFeaturedLayout ? posts.slice(1, 3) : [];
    const gridPosts = hasFeaturedLayout ? posts.slice(3) : posts;

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
                        {icon && <span className="text-4xl">{icon}</span>}
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
                            {title || category}
                        </h2>
                    </div>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        Verified fact-checks and updates
                    </p>
                </motion.div>

                {/* Featured Top Layout (1 big, 2 stacked next to it) */}
                {hasFeaturedLayout && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto w-full">
                        {renderLeadCard(featuredLead)}
                        <div className="flex flex-col gap-6 lg:col-span-1 w-full justify-between">
                            {featuredSecondary.map((post, idx) => renderFeaturedSecondaryCard(post, idx))}
                        </div>
                    </div>
                )}

                {/* Posts Grid */}
                {gridPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden hover:shadow-lg border border-slate-100 dark:border-slate-800/60 transition-all duration-300 max-w-sm mx-auto w-full"
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
                )}
            </div>
        </div>
    );
};

export default CategoryFeed;
