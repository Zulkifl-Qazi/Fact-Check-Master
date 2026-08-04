import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaRss, FaClock, FaUser, FaFacebook, FaTwitter, FaWhatsapp, FaLink, FaShareAlt, FaHeart, FaLock, FaGlobe, FaGoogle, FaApple, FaInstagram, FaCommentDots } from 'react-icons/fa';
import MediaCarousel from '../components/MediaCarousel';
import { useAuth } from '../hooks/useAuth';

const stripHtml = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]+>/g, '').trim();
};

const PostView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [shareCopied, setShareCopied] = useState(false);

    const { user, openAuthModal } = useAuth();

    const loadComments = async (title) => {
        try {
            const response = await fetch(`/api/comments?post_title=${encodeURIComponent(title)}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (e) {
            console.error('Failed to load comments:', e);
        }
    };

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
        
        const loadPost = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let foundPost = null;

                // Preferred path: fetch only the requested post
                const singleResponse = await fetch(`/api/posts?id=${encodeURIComponent(id)}`);
                if (singleResponse.ok) {
                    foundPost = await singleResponse.json();
                } else if (singleResponse.status === 404) {
                    setError('Post not found');
                    return;
                } else {
                    // Backward-compatible fallback path
                    const response = await fetch('/api/posts');
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const posts = await response.json();
                    foundPost = posts.find(p => p.id.toString() === id);
                }
                
                if (!foundPost) {
                    setError('Post not found');
                    return;
                }
                
                // Parse media field if it's a string
                if (foundPost.media && typeof foundPost.media === 'string') {
                    try {
                        foundPost.media = JSON.parse(foundPost.media);
                    } catch (e) {
                        console.error('Failed to parse media:', e);
                        foundPost.media = { images: [], videos: [] };
                    }
                }
                
                // Ensure media has correct structure
                if (!foundPost.media || typeof foundPost.media !== 'object') {
                    foundPost.media = { images: [], videos: [] };
                }
                
                // Backward compatibility - if no media but has image_url
                if (foundPost.image_url && (!foundPost.media.images || foundPost.media.images.length === 0)) {
                    foundPost.media = {
                        images: [foundPost.image_url],
                        videos: []
                    };
                }
                
                setPost(foundPost);
                loadComments(foundPost.title);
                
                // Increment view count
                fetch(`/api/posts?id=${encodeURIComponent(foundPost.id)}&action=view`, {
                    method: 'PATCH'
                }).catch(err => console.error('Failed to increment view count:', err));
                
                // Update document title
                document.title = `${foundPost.title} - Fact Check Master`;
                
            } catch (err) {
                console.error('Failed to load post:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadPost();
        }

        // Cleanup title on unmount
        return () => {
            document.title = 'Fact Check Master';
        };
    }, [id]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Check out this fact check: "${post?.title}"`;
        const excerpt = post?.content ? stripHtml(post.content).substring(0, 120) + '...' : '';
        
        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + excerpt + '\n\n' + url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
                break;
            case 'native':
                if (navigator.share) {
                    navigator.share({
                        title: post.title,
                        text: text + '\n\n' + excerpt,
                        url: url
                    }).catch(console.error);
                }
                break;
            default:
                break;
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            setIsSubmittingComment(true);
            setCommentError('');

            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_title: post.title,
                    username: user.name,
                    email: user.email,
                    avatar_url: user.avatar,
                    provider: user.provider,
                    content: newCommentText.trim()
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to post comment');
            }

            const newComment = await response.json();
            setComments(prev => [...prev, newComment]);
            setNewCommentText('');
        } catch (err) {
            setCommentError(err.message || 'Failed to submit comment. Please try again.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

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
            'pending': 'bg-yellow-100/10 text-yellow-700 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-900/30'
        };
        
        return badges[status] || 'bg-gray-100/10 text-gray-700 dark:text-gray-400 border-gray-200/50 dark:border-gray-800/30';
    };

    const handleGoBack = () => {
        // Use window.location to navigate with hash
        window.location.href = '/#live-feed';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-semibold">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-5 transition-colors duration-300">
                <div className="text-center bg-white dark:bg-slate-900 p-10 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg max-w-md w-full">
                    <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-slate-900 dark:text-slate-100 mb-2 font-bold text-2xl">Post Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                        {error || "The post you're looking for doesn't exist."}
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-none cursor-pointer font-semibold transition duration-200 shadow-md shadow-blue-500/20"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Latest News
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-4 md:pt-10 pb-16 transition-colors duration-300">
            <div className="max-w-[900px] mx-auto px-4 md:px-6">
                {/* Back button */}
                <button
                    onClick={handleGoBack}
                    className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-transparent text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg cursor-pointer mb-4 md:mb-8 transition duration-200 text-sm md:text-base font-semibold"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Latest News
                </button>

                {/* Post content */}
                <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm transition-colors duration-300">
                    {/* Status badge */}
                    <div className="p-4 md:p-6 pb-0 md:pb-0">
                        <span 
                            className={`inline-flex items-center px-4 py-2 rounded-full text-xs md:text-sm font-semibold border ${getStatusBadge(post.fact_check_status)}`}
                        >
                            {getStatusIcon(post.fact_check_status)}
                            <span className="ml-2 capitalize">{post.fact_check_status}</span>
                        </span>
                    </div>

                    {/* Media Gallery */}
                    {((post.media?.images?.length > 0 || post.media?.videos?.length > 0) || post.image_url) && (
                        <div className="p-4 md:p-6 pb-0 md:pb-0">
                            <MediaCarousel media={post.media || { images: post.image_url ? [post.image_url] : [], videos: [] }} />
                        </div>
                    )}

                    <div className="p-4 md:p-8">
                        {/* Title */}
                        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta info */}
                        <div className="flex items-center justify-between gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-slate-200/60 dark:border-slate-800/60 w-full relative">
                            {/* Author & Date Group */}
                            <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                                    <FaUser className="mr-1.5 md:mr-2 text-blue-600 dark:text-blue-500" />
                                    <span className="font-semibold">{post.author || 'Admin'}</span>
                                </div>
                                
                                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                                    <FaClock className="mr-1.5 md:mr-2 text-blue-600 dark:text-blue-500" />
                                    <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                            </div>

                            {/* Flat Inline Share Buttons */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="hidden sm:inline text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Share:</span>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <button
                                        onClick={() => handleShare('facebook')}
                                        className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-[#1877F2]/10 dark:bg-slate-800 dark:hover:bg-[#1877F2]/20 text-[#1877F2] transition duration-200 cursor-pointer border-none"
                                        title="Share on Facebook"
                                    >
                                        <FaFacebook className="text-xs md:text-sm" />
                                    </button>
                                    <button
                                        onClick={() => handleShare('twitter')}
                                        className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition duration-200 cursor-pointer border-none"
                                        title="Share on X"
                                    >
                                        <FaTwitter className="text-xs md:text-sm" />
                                    </button>
                                    <button
                                        onClick={() => handleShare('whatsapp')}
                                        className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-[#25D366]/10 dark:bg-slate-800 dark:hover:bg-[#25D366]/20 text-[#25D366] transition duration-200 cursor-pointer border-none"
                                        title="Share on WhatsApp"
                                    >
                                        <FaWhatsapp className="text-xs md:text-sm" />
                                    </button>
                                    <button
                                        onClick={() => handleShare('copy')}
                                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition duration-200 cursor-pointer border-none ${
                                            shareCopied 
                                                ? 'bg-green-500/10 dark:bg-green-500/20 text-green-500' 
                                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                                        }`}
                                        title={shareCopied ? 'Link Copied!' : 'Copy Link'}
                                    >
                                        <FaLink className="text-xs md:text-sm" />
                                    </button>
                                    {navigator.share && (
                                        <button
                                            onClick={() => handleShare('native')}
                                            className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition duration-200 cursor-pointer border-none"
                                            title="More Options"
                                        >
                                            <FaGlobe className="text-xs md:text-sm" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div 
                            className="text-slate-800 dark:text-slate-200 leading-relaxed text-base md:text-lg mb-10 editorial-rich-text"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Source link */}
                        {post.source_url && (
                            <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Original Source</h3>
                                <a
                                    href={post.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-decoration-none shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition duration-200"
                                >
                                    Visit Original Source
                                    <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                </article>

                {/* Comments Section */}
                <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 shadow-sm transition-colors duration-300">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3">
                        <FaCommentDots className="text-blue-600 dark:text-blue-500 text-xl" />
                        Discussion ({comments.length})
                    </h3>

                    {/* Write Comment Box */}
                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <div className="flex gap-4 items-start">
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200/50 dark:border-slate-700" />
                                <div className="flex-grow">
                                    <textarea
                                        rows="3"
                                        required
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        placeholder="Add to the story. What is your perspective?"
                                        className="w-full text-sm p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 focus:outline-none"
                                    />
                                    {commentError && <p className="text-red-500 text-xs font-semibold mt-1">{commentError}</p>}
                                    <div className="flex justify-end mt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmittingComment || !newCommentText.trim()}
                                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl border-none cursor-pointer transition shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
                                        >
                                            {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-center mb-8 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                                <FaLock className="text-lg" />
                            </div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Join the discussion</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 max-w-sm">
                                To ensure high quality debates, only logged in users can publish comments. Connect with social login or email securely.
                            </p>
                            <button
                                onClick={openAuthModal}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl border-none cursor-pointer transition shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
                            >
                                Log In to Comment
                            </button>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={comment.id || index} className="flex gap-4 items-start group">
                                    <img 
                                        src={comment.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'} 
                                        alt={comment.username} 
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200/50 dark:border-slate-700" 
                                    />
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center flex-wrap gap-2 mb-1">
                                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                                {comment.username}
                                                <span className="capitalize text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                                                    {comment.provider === 'google' && <FaGoogle className="text-red-500 text-[8px]" />}
                                                    {comment.provider === 'facebook' && <FaFacebook className="text-blue-600 text-[8px]" />}
                                                    {comment.provider === 'instagram' && <FaInstagram className="text-pink-500 text-[8px]" />}
                                                    {comment.provider === 'apple' && <FaApple className="text-slate-850 dark:text-slate-200 text-[8px]" />}
                                                    {comment.provider === 'email' && <FaEnvelope className="text-[8px]" />}
                                                    {comment.provider}
                                                </span>
                                            </span>
                                            <span className="text-[11px] text-slate-400">
                                                {new Date(comment.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pr-4">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                                <FaCommentDots className="text-4xl text-slate-200 dark:text-slate-800 mb-2 mx-auto" />
                                <p className="text-sm font-semibold">No comments yet</p>
                                <p className="text-xs">Be the first to share your perspective!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add CSS for spinner animation */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default PostView;