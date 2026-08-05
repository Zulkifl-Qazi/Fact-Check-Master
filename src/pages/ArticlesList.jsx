import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaClock, FaEye, FaArrowLeft } from 'react-icons/fa';
import { getArticleCover } from '../utils/articleImage';

const stripHtml = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').trim();
};

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Articles & Guides - Fact Check Master';
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 dark:border-slate-800 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors cursor-pointer border-none bg-transparent font-semibold"
        >
          <FaArrowLeft className="text-xs" /> Back to Home
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 dark:bg-blue-500/15 flex items-center justify-center">
            <FaBookOpen className="text-blue-600 dark:text-blue-400 text-lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Articles & Guides</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-10 ml-[52px]">
          In-depth analysis, educational resources, and fact-checking guides
        </p>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <FaBookOpen className="text-5xl text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">No articles published yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                onClick={() => navigate(`/articles/${article.slug}`)}
                className="group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-300 dark:hover:border-blue-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10"
              >
                {/* Cover Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-900 to-slate-900">
                  {getArticleCover(article) ? (
                    <img
                      src={getArticleCover(article)}
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
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-sm text-white border border-white/10">
                      <FaClock className="text-[9px]" />
                      {article.read_time || 5} min read
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h2>
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
        )}
      </div>
    </div>
  );
};

export default ArticlesList;
