import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaYoutube, FaExternalLinkAlt, FaSyncAlt, FaBroadcastTower } from 'react-icons/fa';

export default function PressConference() {
  const [feed, setFeed] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    try {
      const res = await axios.get('/api/youtube-feed');
      setFeed(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch YouTube feed:', err);
      setError('Could not connect to the YouTube feed. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed();

    // Auto check status every 60 seconds
    const interval = setInterval(() => {
      loadFeed(false);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Update active video when feed is loaded or updated
  useEffect(() => {
    if (feed) {
      const videoList = feed.videos || [
        {
          videoId: feed.videoId,
          title: feed.title,
          publishedAt: feed.publishedAt,
          thumbnail: `https://i.ytimg.com/vi/${feed.videoId}/mqdefault.jpg`,
          description: "This desk connects directly to the official YouTube channel to check for live broadcasts. When the channel is live, the video theater above will automatically stream the live broadcast feed. Otherwise, it defaults to playing the channel's most recent uploaded press conference or media briefing."
        }
      ];

      const mainVid = videoList.find(v => v.videoId === feed.videoId) || videoList[0];
      if (!mainVid.description) {
        mainVid.description = "DG ISPR conducts a detailed press briefing at the General Headquarters (GHQ) highlighting state security operations, counter-terrorism highlights, and media questions.";
      }

      setActiveVideo(prev => {
        if (prev && videoList.some(v => v.videoId === prev.videoId)) {
          return videoList.find(v => v.videoId === prev.videoId);
        }
        return mainVid;
      });
    }
  }, [feed]);

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pt-20 pb-16 px-4 md:px-8">
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        
        {/* Header Section */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-600">
              <FaYoutube className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight m-0">
                Press Conference Desk
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold m-0 mt-1">
                Official statements and briefings in real-time
              </p>
            </div>
          </div>

          <button
            onClick={() => loadFeed(true)}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 cursor-pointer transition shadow-sm"
          >
            <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>

        {/* Main Body */}
        {loading || !activeVideo ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 dark:border-slate-800 border-t-red-600" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading broadcast stream...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <p className="text-red-500 font-semibold mb-4 text-sm">{error}</p>
            <button
              onClick={() => loadFeed(true)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer shadow-md transition"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Player Container Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xl relative transition-all duration-300">
              
              {/* Live Indicator Overlays */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {feed.isLive && activeVideo.videoId === feed.videoId ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white font-black text-[10px] uppercase tracking-wider rounded-full shadow-lg shadow-red-600/30 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-white block" />
                    🔴 LIVE BROADCAST
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 dark:bg-slate-950/80 text-slate-200 font-bold text-[10px] uppercase tracking-wider rounded-full backdrop-blur-md">
                    <FaBroadcastTower className="text-[10px] text-blue-400" />
                    {activeVideo.videoId === feed.videoId ? 'LATEST UPLOAD' : 'ARCHIVED BROADCAST'}
                  </span>
                )}
              </div>

              {/* Video Player (Aspect Ratio 16:9) */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&mute=0`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-none"
                />
              </div>

              {/* Video Details Information */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                      {activeVideo.title}
                    </h2>
                    
                    {activeVideo.publishedAt && (
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Published on {new Date(activeVideo.publishedAt).toLocaleDateString(undefined, {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  <a
                    href={`https://www.youtube.com/channel/${feed.channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl border-none cursor-pointer transition shadow-md shadow-red-600/10"
                    style={{ textDecoration: 'none' }}
                  >
                    <FaYoutube />
                    View Channel
                    <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    About this stream
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeVideo.description || "Official press conference statement and media briefing updates on national security and operational progress."}
                  </p>
                </div>
              </div>

            </div>

            {/* Previous Uploads / YouTube Grid */}
            <div className="mt-10">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <FaYoutube className="text-red-600 text-xl" />
                <span>Recent Press Briefings</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(feed.videos || [
                  {
                    videoId: feed.videoId,
                    title: feed.title,
                    publishedAt: feed.publishedAt,
                    thumbnail: `https://i.ytimg.com/vi/${feed.videoId}/mqdefault.jpg`
                  }
                ]).map((vid) => {
                  const isActive = activeVideo.videoId === vid.videoId;
                  return (
                    <div 
                      key={vid.videoId}
                      onClick={() => {
                        const targetVid = (feed.videos || []).find(v => v.videoId === vid.videoId) || vid;
                        if (!targetVid.description) {
                          targetVid.description = "Official press conference statement and media briefing updates on national security and operational progress.";
                        }
                        setActiveVideo(targetVid);
                        // Scroll to player smooth
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`group cursor-pointer bg-white dark:bg-slate-900 border rounded-xl overflow-hidden hover:shadow-md transition duration-200 ${
                        isActive 
                          ? 'border-red-500/50 dark:border-red-500/50 ring-1 ring-red-500/30 shadow-md' 
                          : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                        <img 
                          src={vid.thumbnail || `https://i.ytimg.com/vi/${vid.videoId}/mqdefault.jpg`} 
                          alt={vid.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition">
                          <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition duration-200">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        {isActive && (
                          <div className="absolute bottom-2 right-2 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded tracking-wide uppercase">
                            Now Playing
                          </div>
                        )}
                      </div>
                      
                      {/* Meta text content */}
                      <div className="p-3">
                        <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-1">
                          {vid.title}
                        </h4>
                        {vid.publishedAt && (
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold m-0">
                            {new Date(vid.publishedAt).toLocaleDateString(undefined, {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}
        
      </div>
    </section>
  );
}
