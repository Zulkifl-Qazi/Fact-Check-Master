import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaClock, FaArrowRight, FaEye } from 'react-icons/fa';

const stripHtml = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').trim();
};

const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        if (!res.ok) throw new Error('Failed to fetch articles');
        const data = await res.json();
        setArticles(data.slice(0, 6)); // Show up to 6 on homepage
      } catch (err) {
        console.error('Articles fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3 mb-8">
          <FaBookOpen className="text-blue-600 dark:text-blue-400 text-xl" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Articles & Guides</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60">
              <div className="w-full aspect-[16/9] skeleton" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded skeleton" />
                <div className="h-3 w-full rounded skeleton" />
                <div className="h-3 w-2/3 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section id="articles" className="max-w-[1600px] mx-auto px-4 md:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 dark:bg-blue-500/15 flex items-center justify-center">
            <FaBookOpen className="text-blue-600 dark:text-blue-400 text-lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Articles & Guides</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">In-depth analysis and educational resources</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/articles')}
          className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          View All <FaArrowRight className="text-xs" />
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            onClick={() => navigate(`/articles/${article.slug}`)}
            className="group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10"
          >
            {/* Cover Image */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-900 to-slate-900">
              {article.cover_image ? (
                <img
                  src={article.cover_image}
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaBookOpen className="text-4xl text-blue-400/30" />
                </div>
              )}
              {/* Read time badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-sm text-white border border-white/10">
                  <FaClock className="text-[9px]" />
                  {article.read_time || 5} min read
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                {article.excerpt || stripHtml(article.content).substring(0, 150) + '...'}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>{article.author || 'Fact Check Master'}</span>
                <div className="flex items-center gap-3">
                  {article.views > 0 && (
                    <span className="flex items-center gap-1">
                      <FaEye className="text-[10px]" /> {article.views.toLocaleString()}
                    </span>
                  )}
                  <span>
                    {new Date(article.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Mobile "View All" button */}
      <div className="flex sm:hidden justify-center mt-6">
        <button
          onClick={() => navigate('/articles')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
        >
          View All Articles <FaArrowRight className="text-xs" />
        </button>
      </div>
    </section>
  );
};

export default ArticlesSection;
