import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaClock, FaEye, FaCalendarAlt, FaUser, FaArrowLeft, FaBookOpen, FaShareAlt } from 'react-icons/fa';

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

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error('Article not found');
        const data = await res.json();
        setArticle(data);

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

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
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
          <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <FaShareAlt className="text-[10px]" /> Share
          </button>
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
