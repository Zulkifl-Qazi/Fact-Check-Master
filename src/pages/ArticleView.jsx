import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaClock, FaEye, FaCalendarAlt, FaUser, FaArrowLeft, FaBookOpen, FaShareAlt, FaLock, FaCommentDots, FaGoogle, FaFacebook, FaInstagram, FaEnvelope, FaApple, FaTwitter, FaWhatsapp, FaLink, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const stripHtml = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').trim();
};

const ArticleView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comments State
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
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error('Article not found');
        const data = await res.json();
        setArticle(data);
        loadComments(data.title);

        // Update document title and description dynamically for SEO
        if (data?.title) {
          document.title = `${data.title} - Fact Check Master`;
          let metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.content = data.excerpt || stripHtml(data.content).substring(0, 150) + '...';
          }
        }

        // Increment view count
        if (data?.id) {
          fetch(`/api/articles?id=${data.id}&action=view`, { method: 'PATCH' }).catch(() => {});
        }

        // Fetch related articles
        const relatedRes = await fetch('/api/articles');
        if (relatedRes.ok) {
          const allArticles = await relatedRes.json();
          setRelated(allArticles.filter((a) => a.id !== data.id).slice(0, 3));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = async (platform) => {
    const url = window.location.href;
    const text = `Check out this article: "${article?.title}"`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url).catch(() => {});
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
        break;
      default:
        if (navigator.share) {
          navigator.share({ title: article.title, url }).catch(() => {});
        }
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
          post_title: article.title,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 dark:border-slate-800 border-t-blue-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white px-4">
        <FaBookOpen className="text-4xl text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
        >
          <FaArrowLeft /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero / Cover Image */}
      {article.cover_image && (
        <div className="relative w-full max-h-[480px] overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full max-h-[480px] object-cover opacity-80"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <FaArrowLeft className="text-xs" /> Back
        </button>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 dark:text-white leading-tight mb-5">
          {article.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <FaUser className="text-xs text-blue-500" />
            {article.author || 'Fact Check Master'}
          </span>
          <span className="flex items-center gap-1.5">
            <FaCalendarAlt className="text-xs text-blue-500" />
            {new Date(article.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <FaClock className="text-xs text-blue-500" />
            {article.read_time || 5} min read
          </span>
          {article.views > 0 && (
            <span className="flex items-center gap-1.5">
              <FaEye className="text-xs text-blue-500" />
              {article.views.toLocaleString()} views
            </span>
          )}
          
          {/* Flat Inline Share Buttons */}
          <div className="ml-auto flex items-center gap-2.5">
            <span className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Share:</span>
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

        {/* Article Body */}
        <div
          className="article-content prose prose-slate dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-ul:text-slate-700 dark:prose-ul:text-slate-300
            prose-ol:text-slate-700 dark:prose-ol:text-slate-300
            prose-li:text-slate-700 dark:prose-li:text-slate-300
            prose-img:rounded-xl prose-img:shadow-lg
            prose-blockquote:border-blue-500 prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400
            text-[16.5px] leading-[1.85]"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags / Category if present */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Published by</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{article.author || 'Fact Check Master'}</span>
          </div>
        </div>

        {/* Discussion / Comments Section */}
        <div className="mt-12 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 md:p-8 shadow-sm transition-colors duration-300">
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
                    placeholder="Add to the article. What is your perspective?"
                    className="w-full text-sm p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition focus:border-blue-500 focus:outline-none"
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
            <div className="p-6 md:p-8 bg-white dark:bg-slate-950/30 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-center mb-8 flex flex-col items-center justify-center">
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
                        <span className="capitalize text-[10px] bg-white dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
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

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/50 py-12 mt-4">
          <div className="max-w-[900px] mx-auto px-4 md:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/articles/${r.slug}`}
                  className="group block rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300"
                >
                  <div className="w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-900 to-slate-900">
                    {r.cover_image ? (
                      <img
                        src={r.cover_image}
                        alt={r.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBookOpen className="text-3xl text-blue-400/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                      <FaClock className="text-[9px]" /> {r.read_time || 5} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleView;
