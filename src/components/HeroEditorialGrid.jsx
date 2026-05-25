import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BREAKING_CATEGORY = 'breaking-news';
const LATEST_FALLBACK = 'latest-news';

async function fetchPostsList(params) {
  const q = new URLSearchParams();
  if (params.category) q.set('category', params.category);
  if (params.limit != null) q.set('limit', String(params.limit));
  if (params.offset != null) q.set('offset', String(params.offset));
  const res = await fetch(`/api/posts?${q.toString()}`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function dedupeByTitle(posts) {
  const seenTitles = new Set();
  const seenIds = new Set();
  return posts.filter((p) => {
    if (!p) return false;
    if (p.id && seenIds.has(p.id)) return false;
    const titleKey = p.title ? p.title.trim().toLowerCase() : null;
    if (titleKey && seenTitles.has(titleKey)) return false;
    if (p.id) seenIds.add(p.id);
    if (titleKey) seenTitles.add(titleKey);
    return true;
  });
}

function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').trim();
}

/** Resolve the best image URL from a post object */
function getPostImage(post) {
  if (!post) return null;
  // Direct image_url takes priority
  if (post.image_url) return post.image_url;
  // Try media object (could be object or JSON string)
  let media = post.media;
  if (media && typeof media === 'string') {
    try { media = JSON.parse(media); } catch { return null; }
  }
  if (media && media.images && media.images.length > 0) return media.images[0];
  return null;
}

const HeroEditorialGrid = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mainStory, setMainStory] = useState(null);
  const [secondaryStories, setSecondaryStories] = useState([]);
  const [bottomRowPosts, setBottomRowPosts] = useState([]);
  const [mustReadPosts, setMustReadPosts] = useState([]);
  const [moreHeadlines, setMoreHeadlines] = useState([]);
  const [heroUsedFallback, setHeroUsedFallback] = useState(false);

  const loadHero = useCallback(async () => {
    setLoading(true);
    try {
      // Single fetch to get the latest posts (utilizes the cached endpoint)
      const allPosts = await fetchPostsList({});

      const breakingRes = allPosts
        .filter((p) => p.category === BREAKING_CATEGORY || p.category === 'featured-news')
        .slice(0, 8);
      const fallbackRes = allPosts
        .filter((p) => p.category === LATEST_FALLBACK)
        .slice(0, 8);
      const latestPoolRes = allPosts
        .filter((p) => p.category === LATEST_FALLBACK)
        .slice(0, 16);
      const generalRes = allPosts.slice(0, 24);

      let breaking = dedupeByTitle(breakingRes);
      let usedFallback = false;

      if (breaking.length === 0) {
        breaking = dedupeByTitle(fallbackRes);
        usedFallback = true;
      }

      // Check if any post is pinned_hero — it becomes the lead
      const pinnedIdx = breaking.findIndex((p) => p.pinned_hero);
      let lead;
      let secondary;
      if (pinnedIdx >= 0) {
        lead = breaking[pinnedIdx];
        secondary = [...breaking.slice(0, pinnedIdx), ...breaking.slice(pinnedIdx + 1)].slice(0, 3);
      } else {
        lead = breaking[0] || null;
        secondary = breaking.slice(1, 4); // max 3 secondary
      }

      // Collect already used posts to avoid duplicates
      const usedIds = new Set();
      const usedTitles = new Set();
      if (lead) {
        usedIds.add(lead.id);
        if (lead.title) usedTitles.add(lead.title.trim().toLowerCase());
      }
      secondary.forEach((p) => {
        usedIds.add(p.id);
        if (p.title) usedTitles.add(p.title.trim().toLowerCase());
      });

      // Find breaking posts for the bottom row
      let bottomRow = breaking.filter(
        (p) => !usedIds.has(p.id) && !usedTitles.has(p.title?.trim().toLowerCase())
      ).slice(0, 2);

      bottomRow.forEach((p) => {
        usedIds.add(p.id);
        if (p.title) usedTitles.add(p.title.trim().toLowerCase());
      });

      let latestPool = dedupeByTitle(latestPoolRes).filter(
        (p) => !usedIds.has(p.id) && !usedTitles.has(p.title?.trim().toLowerCase())
      );

      // If bottomRow still needs posts, fill from latestPool
      while (bottomRow.length < 2 && latestPool.length > 0) {
        const fillPost = latestPool.shift();
        bottomRow.push(fillPost);
        usedIds.add(fillPost.id);
        if (fillPost.title) usedTitles.add(fillPost.title.trim().toLowerCase());
      }

      const mustRead = latestPool.slice(0, 3);
      mustRead.forEach((p) => {
        usedIds.add(p.id);
        if (p.title) usedTitles.add(p.title.trim().toLowerCase());
      });

      let general = dedupeByTitle(generalRes).filter(
        (p) => !usedIds.has(p.id) && !usedTitles.has(p.title?.trim().toLowerCase())
      );
      const more = general.slice(0, 4);

      setMainStory(lead);
      setSecondaryStories(secondary);
      setBottomRowPosts(bottomRow);
      setMustReadPosts(mustRead);
      setMoreHeadlines(more);
      setHeroUsedFallback(usedFallback);
    } catch (e) {
      console.error('Hero load failed', e);
      setMainStory(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHero();
  }, [loadHero]);

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="w-9 h-9 border-3 border-slate-200 dark:border-slate-800 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!mainStory) {
    return (
      <div className="w-full py-16 text-center bg-white dark:bg-slate-950 transition-colors duration-300">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          No stories to show yet. Create a post with the "Featured / Breaking" category to populate this hero!
        </p>
      </div>
    );
  }

  const mainImage = getPostImage(mainStory);

  return (
    <section className="w-full py-6 pb-7 border-b border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[6.8fr_2.6fr_2fr] gap-8">

          {/* ── COL 1: MAIN STORY ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-6"
          >
            <div
              className="hero-lead hero-link cursor-pointer relative overflow-hidden rounded-lg group"
              onClick={() => navigate(`/post/${mainStory.id}`)}
            >
              {/* Image container — always present, image overlaid */}
              <div className="hero-img-wrap relative w-full aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                {mainImage && (
                  <>
                    {/* Blurred background for letterboxing effect */}
                    <div
                      className="absolute inset-[-20px] bg-cover bg-center blur-xl brightness-50 z-0"
                      style={{ backgroundImage: `url(${mainImage})` }}
                    />
                    {/* Contained image so it doesn't zoom/crop */}
                    <img
                      src={mainImage}
                      alt={mainStory.title}
                      className="hero-lead-img absolute inset-0 w-full h-full object-contain block z-10 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </>
                )}
                {/* Always-on gradient overlay */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30 flex flex-col justify-end">
                  <span className="inline-block px-3 py-1 text-[11px] font-extrabold tracking-wider uppercase text-white bg-red-600 mb-3 w-fit rounded-sm shadow-sm">
                    {heroUsedFallback ? 'Featured' : 'Breaking'}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight m-0 drop-shadow-md transition-colors duration-200">
                    {mainStory.title}
                  </h2>
                  {mainStory.content && (
                    <p className="text-sm text-slate-200/90 mt-2.5 leading-relaxed max-w-2xl line-clamp-2 drop-shadow-sm">
                      {stripHtml(mainStory.content)}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-3 m-0 tracking-wide font-medium">
                    {mainStory.author && `${mainStory.author} · `}
                    {mainStory.created_at && new Date(mainStory.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-grid for 2 more posts under the big lead image */}
            {bottomRowPosts && bottomRowPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bottomRowPosts.map((post) => {
                  const img = getPostImage(post);
                  return (
                    <div
                      key={post.id}
                      className="hero-mid-card hero-link cursor-pointer group"
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      <div className="hero-img-wrap relative w-full aspect-video overflow-hidden rounded-md bg-gradient-to-br from-slate-900 to-slate-950 mb-3">
                        {img && (
                          <>
                            <div
                              className="absolute inset-[-10px] bg-cover bg-center blur-lg brightness-50 z-0"
                              style={{ backgroundImage: `url(${img})` }}
                            />
                            <img
                              src={img}
                              alt={post.title}
                              className="hero-mid-card-img absolute inset-0 w-full h-full object-contain block z-10 transition-transform duration-500 group-hover:scale-[1.04]"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </>
                        )}
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-200 leading-snug m-0 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 m-0">
                        {post.created_at && new Date(post.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* ── COL 2: SECONDARY STORIES — each with image ── */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            {secondaryStories.length === 0 && (
              <p className="text-slate-400 dark:text-slate-600 text-sm py-4 italic">
                Add more "Breaking" posts to populate this column.
              </p>
            )}
            {secondaryStories.map((post, idx) => {
              const img = getPostImage(post);
              return (
                <div
                  key={post.id}
                  className="hero-mid-card hero-link cursor-pointer group pb-4 border-b border-slate-200/60 dark:border-slate-800/60 last:border-none last:pb-0"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {/* Image card with overlay */}
                  <div className="hero-img-wrap relative w-full aspect-video overflow-hidden rounded-md bg-gradient-to-br from-slate-900 to-slate-950 mb-3">
                    {img && (
                      <>
                        <div
                          className="absolute inset-[-10px] bg-cover bg-center blur-lg brightness-50 z-0"
                          style={{ backgroundImage: `url(${img})` }}
                        />
                        <img
                          src={img}
                          alt={post.title}
                          className="hero-mid-card-img absolute inset-0 w-full h-full object-contain block z-10 transition-transform duration-500 group-hover:scale-[1.04]"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    {/* Live dot badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-30">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
                      <span className="text-[10px] font-bold tracking-wider uppercase text-white drop-shadow-md">Live</span>
                    </div>
                  </div>
                  {/* Title below image */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-200 leading-snug m-0 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 m-0">
                    {post.created_at && new Date(post.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
                  </p>
                </div>
              );
            })}
          </motion.div>

          {/* ── COL 3: MUST READ + MORE HEADLINES (text-only) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* Must Read */}
            <div>
              <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b-2 border-amber-500">
                <span className="w-0.5 h-4 bg-amber-500 rounded-sm flex-shrink-0" />
                <h3 className="text-[13px] font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-300 m-0">
                  Must Read
                </h3>
              </div>
              {mustReadPosts.length === 0 && (
                <p className="text-slate-400 dark:text-slate-600 text-sm py-2">No picks yet.</p>
              )}
              {mustReadPosts.map((post) => (
                <div
                  key={post.id}
                  className="hero-link cursor-pointer py-2.5 border-b border-slate-200/50 dark:border-slate-800/30 group"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-200 leading-snug m-0 line-clamp-3">
                    {post.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 m-0">
                    {post.created_at && new Date(post.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short' })}
                  </p>
                </div>
              ))}
            </div>

            {/* More Headlines */}
            <div>
              <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-slate-200 dark:border-slate-800">
                <span className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700 rounded-sm flex-shrink-0" />
                <h3 className="text-[13px] font-extrabold tracking-wider uppercase text-slate-600 dark:text-slate-400 m-0">
                  More Headlines
                </h3>
              </div>
              {moreHeadlines.length === 0 && (
                <p className="text-slate-400 dark:text-slate-600 text-sm py-2">No more headlines.</p>
              )}
              {moreHeadlines.map((post) => (
                <div
                  key={post.id}
                  className="hero-link cursor-pointer py-2 border-b border-slate-200/30 dark:border-slate-800/10 last:border-none group"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <h4 className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-200 leading-relaxed m-0 line-clamp-2">
                    {post.title}
                  </h4>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroEditorialGrid;
