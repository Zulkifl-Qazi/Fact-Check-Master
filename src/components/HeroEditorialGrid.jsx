import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { vercelImg } from '../utils/vercelImage';

const BREAKING_CATEGORY = 'breaking-news';
const LATEST_FALLBACK = 'latest-news';

async function fetchPostsList(params) {
  const q = new URLSearchParams();
  if (params.category) q.set('category', params.category);
  if (params.limit != null) q.set('limit', String(params.limit));
  if (params.offset != null) q.set('offset', String(params.offset));
  const queryString = q.toString();
  const url = queryString ? `/api/posts?${queryString}` : '/api/posts';
  const res = await fetch(url);
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

      // Check if any post in the entire feed is explicitly pinned to the hero
      const pinnedPost = allPosts.find((p) => p.pinned_hero);
      let lead = null;
      let usedFallback = false;
      let postsPool = allPosts;

      if (pinnedPost) {
        lead = pinnedPost;
        postsPool = allPosts.filter((p) => p.id !== pinnedPost.id);
      }

      const breakingRes = postsPool
        .filter((p) => p.category === BREAKING_CATEGORY || p.category === 'featured-news')
        .slice(0, 8);
      const fallbackRes = postsPool
        .filter((p) => p.category === LATEST_FALLBACK)
        .slice(0, 8);
      const latestPoolRes = postsPool
        .filter((p) => p.category === LATEST_FALLBACK)
        .slice(0, 16);
      const generalRes = postsPool.slice(0, 24);

      let breaking = dedupeByTitle(breakingRes);

      if (breaking.length === 0) {
        breaking = dedupeByTitle(fallbackRes);
        usedFallback = true;
      }

      let secondary = [];
      if (pinnedPost) {
        secondary = breaking.slice(0, 3);
      } else {
        lead = breaking[0] || null;
        secondary = breaking.slice(1, 4);
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

      let latestPool = dedupeByTitle(latestPoolRes).filter(
        (p) => !usedIds.has(p.id) && !usedTitles.has(p.title?.trim().toLowerCase())
      );

      // Fill secondary stories if we have fewer than 3 to prevent empty space
      while (secondary.length < 3 && latestPool.length > 0) {
        const fillPost = latestPool.shift();
        secondary.push(fillPost);
        usedIds.add(fillPost.id);
        if (fillPost.title) usedTitles.add(fillPost.title.trim().toLowerCase());
      }

      // Find breaking posts for the bottom row
      let bottomRow = breaking.filter(
        (p) => !usedIds.has(p.id) && !usedTitles.has(p.title?.trim().toLowerCase())
      ).slice(0, 2);

      bottomRow.forEach((p) => {
        usedIds.add(p.id);
        if (p.title) usedTitles.add(p.title.trim().toLowerCase());
      });

      // Re-filter latestPool to exclude any bottomRow additions
      latestPool = latestPool.filter(
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

      // Cache hero image URL for next-visit LCP preload (see index.html inline script)
      try {
        const heroImg = lead ? getPostImage(lead) : null;
        if (heroImg) localStorage.setItem('fcm_hero_img', heroImg);
      } catch (e) { /* ignore private browsing / storage full */ }
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
      <section className="w-full py-6 pb-7 border-b border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[6.8fr_2.6fr_2fr] gap-8">
            
            {/* Column 1 Skeleton */}
            <div className="flex flex-col justify-between h-full gap-6">
              <div className="w-full aspect-video rounded-lg skeleton min-h-[250px] sm:min-h-[350px] lg:min-h-[400px]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <div className="w-full aspect-video rounded-md skeleton" />
                  <div className="h-4 w-3/4 rounded skeleton" />
                  <div className="h-3 w-1/4 rounded skeleton" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-full aspect-video rounded-md skeleton" />
                  <div className="h-4 w-3/4 rounded skeleton" />
                  <div className="h-3 w-1/4 rounded skeleton" />
                </div>
              </div>
            </div>

            {/* Column 2 Skeleton */}
            <div className="flex flex-col justify-between h-full gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2 pb-4 border-b border-slate-200/60 dark:border-slate-800/60 last:border-none last:pb-0">
                  <div className="w-full aspect-video rounded-md skeleton" />
                  <div className="h-4 w-5/6 rounded skeleton" />
                  <div className="h-3 w-1/3 rounded skeleton" />
                </div>
              ))}
            </div>

            {/* Column 3 Skeleton */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="h-5 w-1/3 rounded skeleton mb-4" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="py-2.5 border-b border-slate-200/50 dark:border-slate-800/30 flex flex-col gap-2">
                    <div className="h-4 w-full rounded skeleton" />
                    <div className="h-3 w-1/4 rounded skeleton" />
                  </div>
                ))}
              </div>
              <div>
                <div className="h-5 w-1/3 rounded skeleton mb-4" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="py-2 border-b border-slate-200/30 dark:border-slate-800/10 flex flex-col gap-2">
                    <div className="h-3.5 w-5/6 rounded skeleton" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
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
          <div className="flex flex-col justify-between h-full gap-6 hero-fade-in">
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
                      style={{ backgroundImage: `url(${vercelImg(mainImage, 1200, 80)})` }}
                    />
                    {/* LCP image — fetchPriority=high, no lazy loading */}
                    <img
                      src={vercelImg(mainImage, 1200, 80)}
                      alt={mainStory.title}
                      fetchPriority="high"
                      decoding="sync"
                      width="1200"
                      height="675"
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
                              style={{ backgroundImage: `url(${vercelImg(img, 640, 60)})` }}
                            />
                            <img
                              src={vercelImg(img, 640, 75)}
                              alt={post.title}
                              loading="lazy"
                              decoding="async"
                              width="640"
                              height="360"
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
          </div>

          {/* ── COL 2: SECONDARY STORIES — each with image ── */}
          <div className="flex flex-col justify-between h-full gap-6 hero-fade-in" style={{ animationDelay: '80ms' }}>
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
                          style={{ backgroundImage: `url(${vercelImg(img, 640, 60)})` }}
                        />
                        <img
                          src={vercelImg(img, 640, 75)}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          width="640"
                          height="360"
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
          </div>

          {/* ── COL 3: MUST READ + MORE HEADLINES (text-only) ── */}
          <div className="flex flex-col gap-6 hero-fade-in" style={{ animationDelay: '150ms' }}>
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
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroEditorialGrid;
