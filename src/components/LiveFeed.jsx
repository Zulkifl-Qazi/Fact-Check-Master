import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRss, FaCheckCircle, FaExclamationTriangle, FaEye, FaTimes } from 'react-icons/fa';
import { vercelImg } from '../utils/vercelImage';

const stripHtml = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]+>/g, '').trim();
};

const LiveFeed = ({ searchQuery = '', showOnly }) => {
    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const postsRes = await fetch('/api/posts?chronological=true');
            
            if (!postsRes.ok) {
                throw new Error(`HTTP ${postsRes.status}: ${postsRes.statusText}`);
            }
            
            const postsData = await postsRes.json();
            
            // Frontend fallback deduplication by title
            const uniquePosts = [];
            const seenTitles = new Set();
            if (Array.isArray(postsData)) {
                for (const post of postsData) {
                    const titleTrimmed = post.title ? post.title.trim().toLowerCase() : '';
                    if (titleTrimmed && !seenTitles.has(titleTrimmed)) {
                        seenTitles.add(titleTrimmed);
                        uniquePosts.push(post);
                    } else if (!titleTrimmed) {
                        uniquePosts.push(post);
                    }
                }
            }
            
            const latestNewsPosts = uniquePosts.slice(0, 24);
            setPosts(latestNewsPosts);

            // Compute popular posts locally by mimicking backend sort logic:
            // 1. pinned_popular descending
            // 2. views descending
            // 3. created_at descending
            const sortedPopular = [...uniquePosts].sort((a, b) => {
                const pinA = a.pinned_popular ? 1 : 0;
                const pinB = b.pinned_popular ? 1 : 0;
                if (pinB !== pinA) return pinB - pinA;
                
                const viewsA = a.views || 0;
                const viewsB = b.views || 0;
                if (viewsB !== viewsA) return viewsB - viewsA;
                
                return new Date(b.created_at) - new Date(a.created_at);
            });
            setPopularPosts(sortedPopular.slice(0, 7));
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
                return <FaCheckCircle className="text-green-500 dark:text-green-400" />;
            case 'false':
                return <FaExclamationTriangle className="text-red-500 dark:text-red-400" />;
            case 'misleading':
                return <FaExclamationTriangle className="text-orange-500 dark:text-orange-400" />;
            default:
                return <FaRss className="text-blue-500 dark:text-blue-400" />;
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'verified': 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-800/30',
            'false': 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/30',
            'misleading': 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200/50 dark:border-orange-800/30',
            'pending': 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-800/30'
        };
        
        return badges[status] || 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-800/30';
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
            <section 
                id="live-feed"
                className="w-full pt-4 md:pt-12 pb-12 bg-white dark:bg-slate-950 transition-colors duration-300"
            >
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    {showOnly !== 'more' && (
                        <div className="mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                            <div className="h-8 w-48 rounded skeleton mb-1" />
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.9fr] lg:grid-cols-[6fr_2.9fr_2.9fr] gap-8 items-start">
                        {/* Column 1 Skeleton */}
                        <div className="flex flex-col gap-6 lg:border-r lg:border-slate-200/50 lg:dark:border-slate-800/50 lg:pr-8">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-5 items-start pb-6 border-b border-slate-200/50 dark:border-slate-800/50 last:border-none">
                                    <div className="w-full sm:w-[240px] aspect-[16/10] rounded-lg skeleton flex-shrink-0" />
                                    <div className="flex-grow flex flex-col justify-between w-full h-auto sm:h-[150px] gap-2">
                                        <div className="h-5 w-5/6 rounded skeleton" />
                                        <div className="h-4 w-full rounded skeleton" />
                                        <div className="h-4 w-2/3 rounded skeleton" />
                                        <div className="h-3 w-1/3 rounded skeleton mt-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Column 2 Skeleton */}
                        <div className="flex flex-col gap-5 lg:border-r lg:border-slate-200/50 lg:dark:border-slate-800/50 lg:pr-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/50 last:border-none">
                                    <div className="w-24 h-16 rounded-md skeleton flex-shrink-0" />
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="h-3 w-1/4 rounded skeleton" />
                                        <div className="h-4 w-5/6 rounded skeleton" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Column 3 Skeleton */}
                        <div className="flex flex-col gap-4">
                            <div className="h-6 w-36 rounded skeleton mb-2" />
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="py-2.5 border-b border-slate-100 dark:border-slate-800/50 flex flex-col gap-2">
                                    <div className="h-4 w-full rounded skeleton" />
                                    <div className="h-3 w-1/3 rounded skeleton" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <div 
                id="live-feed"
                className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 hero-fade-in"
            >
            <div className="text-center p-8 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 max-w-md mx-auto">
                <FaExclamationTriangle className="text-red-500 dark:text-red-400 text-2xl mx-auto mb-4" />
                <h3 className="text-base font-bold text-red-800 dark:text-red-400 mb-2">Failed to load posts</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">{error}</p>
                <button 
                    onClick={loadPosts}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors duration-150 shadow-sm"
                >
                    Retry
                </button>
            </div>
        </div>
        );
    }

    // Split for layout if NOT searching
    const isSearchActive = !!searchQuery;
    const leadPosts = filteredPosts.slice(0, 2);
    const recentPosts = filteredPosts.slice(2, 6);
    const remainingPosts = filteredPosts.slice(6, 18); // 12 posts max = 4 rows × 3 cols

    return (
        <section 
            className="w-full pt-4 md:pt-12 pb-12 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300" 
            id={showOnly === 'more' ? 'more-latest-news' : 'live-feed'}
        >
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                {/* Header Section */}
                {showOnly !== 'more' && (
                    <div className="mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight m-0">
                            {isSearchActive ? `Search Results for "${searchQuery}"` : 'Latest News'}
                        </h2>
                        {isSearchActive && (
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Found {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
                                </p>
                                <button
                                    onClick={clearSearch}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-150 shadow-sm"
                                >
                                    <FaTimes /> Clear Search
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {filteredPosts.length === 0 ? (
                    showOnly !== 'more' ? (
                        <div 
                            className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-8 max-w-md mx-auto"
                        >
                            <FaRss className="text-slate-400 dark:text-slate-600 text-3xl mx-auto mb-4" />
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                                {isSearchActive ? `No posts found matching "${searchQuery}"` : 'No posts available at the moment.'}
                            </p>
                            {isSearchActive && (
                                <button
                                    onClick={clearSearch}
                                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors duration-150"
                                >
                                    View All Posts
                                </button>
                            )}
                        </div>
                    ) : null
                ) : isSearchActive ? (
                    /* Simple Grid for Search Results */
                    showOnly !== 'more' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPosts.map((post) => (
                                <article 
                                    key={post.id} 
                                    className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500/80 transition-all duration-300 overflow-hidden cursor-pointer"
                                    onClick={() => handleViewMore(post)}
                                >
                                    {post.image_url && (
                                        <div className="relative w-full aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
                                            <img 
                                                src={vercelImg(post.image_url, 800, 75)} 
                                                alt={post.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" 
                                                loading="lazy"
                                                decoding="async"
                                                width="800"
                                                height="450"
                                            />
                                            <div className="absolute top-3 right-3 z-10">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${getStatusBadge(post.fact_check_status)}`}>
                                                    {getStatusIcon(post.fact_check_status)}
                                                    <span>{post.fact_check_status}</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-5 flex flex-col flex-grow bg-white dark:bg-slate-900">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-snug">
                                            {post.title}
                                        </h3>
                                        <div className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
                                        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 font-semibold tracking-wide uppercase">
                                            <span>By {post.author || 'Admin'}</span>
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : null
                ) : (
                    /* AL JAZEERA STYLE ASYMMETRIC GRID WITH BOTTOM GRID */
                    <div>
                        {/* Top Grid */}
                        {showOnly !== 'more' && (
                            <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.9fr] lg:grid-cols-[6fr_2.9fr_2.9fr] gap-8 items-start">
                                
                                {/* COLUMN 1: Two Stacked Lead Stories (Large Horizontal Layout) */}
                                <div className="flex flex-col gap-6 lg:border-r lg:border-slate-200/50 lg:dark:border-slate-800/50 lg:pr-8">
                                    {leadPosts.map((post, idx) => (
                                        <article 
                                            key={post.id} 
                                            className="group flex flex-col sm:flex-row gap-5 items-start cursor-pointer pb-6 border-b border-slate-200/50 dark:border-slate-800/50 last:border-none last:pb-0" 
                                            onClick={() => handleViewMore(post)}
                                        >
                                            <div className="relative w-full sm:w-[240px] aspect-[16/10] overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-slate-950 flex-shrink-0">
                                                {post.image_url ? (
                                                    <img 
                                                        src={vercelImg(post.image_url, 480, 70)} 
                                                        alt={post.title} 
                                                        loading={idx === 0 ? undefined : "lazy"}
                                                        fetchPriority={idx === 0 ? "high" : "low"}
                                                        decoding={idx === 0 ? "sync" : "async"}
                                                        width="480"
                                                        height="300"
                                                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FaRss className="text-slate-700 dark:text-slate-500 text-2xl" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow flex flex-col justify-between h-auto sm:h-[150px]">
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                                                        {stripHtml(post.content)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-wide uppercase mt-3">
                                                    <span className="flex items-center gap-1.5">
                                                        {getStatusIcon(post.fact_check_status)}
                                                        <span>{post.fact_check_status || 'Update'}</span>
                                                    </span>
                                                    <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* COLUMN 2: Recent Updates (Stacked Thumbnails) */}
                                <div className="flex flex-col gap-5 lg:border-r lg:border-slate-200/50 lg:dark:border-slate-800/50 lg:pr-8">
                                    {recentPosts.map((post) => (
                                        <article 
                                            key={post.id} 
                                            className="group flex gap-4 cursor-pointer pb-5 border-b border-slate-100 dark:border-slate-800/50 last:border-none last:pb-0"
                                            onClick={() => handleViewMore(post)}
                                        >
                                            <div className="w-24 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-slate-900 to-slate-950 relative">
                                                {post.image_url ? (
                                                    <img 
                                                        src={vercelImg(post.image_url, 96, 60)} 
                                                        alt={post.title} 
                                                        loading="lazy"
                                                        decoding="async"
                                                        width="96"
                                                        height="64"
                                                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FaRss className="text-slate-700 dark:text-slate-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-start">
                                                <div className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                                                    {post.category ? post.category.replace('-', ' ') : 'News'}
                                                </div>
                                                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                                                    {post.title}
                                                </h3>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* COLUMN 3: Most Popular / Trending */}
                                <div className="flex flex-col md:col-span-2 lg:col-span-1 mt-6 md:mt-0">
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b-2 border-blue-600 dark:border-blue-500 pb-2 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" />
                                        Most Popular
                                    </h3>
                                    <div className="flex flex-col">
                                        {popularPosts.map((post, idx) => (
                                            <article 
                                                key={post.id} 
                                                className="group flex items-start gap-4 py-3 border-b border-slate-100 dark:border-slate-800/40 last:border-none cursor-pointer"
                                                onClick={() => handleViewMore(post)}
                                            >
                                                <span className="text-2xl font-light text-slate-300 dark:text-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-none min-w-[24px]">
                                                    {idx + 1}
                                                </span>
                                                <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                                                    {post.title}
                                                </h3>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BOTTOM SECTION: Remaining Posts in 3 per row grid */}
                        {showOnly !== 'latest' && remainingPosts.length > 0 && (
                            <div className={showOnly !== 'more' ? "mt-12 border-t border-slate-200 dark:border-slate-800/80 pt-12" : ""}>
                                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide border-l-4 border-blue-600 dark:border-blue-500 pl-3 mb-8">
                                    More Latest News
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {remainingPosts.map((post) => (
                                        <article 
                                            key={post.id} 
                                            className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500/80 transition-all duration-300 overflow-hidden cursor-pointer"
                                            onClick={() => handleViewMore(post)}
                                        >
                                            {post.image_url && (
                                                <div className="relative w-full aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
                                                    <img 
                                                        src={vercelImg(post.image_url, 640, 75)} 
                                                        alt={post.title} 
                                                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" 
                                                        loading="lazy" 
                                                        decoding="async"
                                                        width="640"
                                                        height="360"
                                                    />
                                                    <div className="absolute top-3 right-3 z-10">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${getStatusBadge(post.fact_check_status)}`}>
                                                            {getStatusIcon(post.fact_check_status)}
                                                            <span>{post.fact_check_status}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="p-5 flex flex-col flex-grow bg-white dark:bg-slate-900">
                                                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-200 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-snug">
                                                    {post.title}
                                                </h3>
                                                <div className="text-slate-500 dark:text-slate-400 text-xs mb-4 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
                                                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 font-semibold tracking-wide uppercase">
                                                    <span>By {post.author || 'Admin'}</span>
                                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LiveFeed;