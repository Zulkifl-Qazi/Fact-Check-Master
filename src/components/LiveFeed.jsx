import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTwitter, FaRss, FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const LiveFeed = () => {
    const twitterContainerRef = useRef(null);
    const sectionRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [widgetLoaded, setWidgetLoaded] = useState(false);

    // Small sample fallback tweets to show when widget is blocked or unavailable
    const [sampleTweets, setSampleTweets] = useState([]);

    useEffect(() => {
        let data = [];
        try {
            const raw = localStorage.getItem('lf_sampleTweets');
            if (raw) {
                data = JSON.parse(raw);
                setSampleTweets(data);
                return;
            }
        } catch (e) {
            // fall through to fetch
        }

        fetch('/data/sample-tweets.json').then(r => r.json()).then(d => setSampleTweets(d)).catch(() => setSampleTweets([]));
    }, []);

    // UI settings (client-side only)
    const [showCount, setShowCount] = useState(() => {
        try {
            const v = Number(localStorage.getItem('lf_showCount'));
            return isNaN(v) || v <= 0 ? 3 : v;
        } catch (e) {
            return 3;
        }
    });
    const [widgetTheme, setWidgetTheme] = useState(() => {
        try {
            return localStorage.getItem('lf_widgetTheme') || 'auto';
        } catch (e) {
            return 'auto';
        }
    }); // 'auto'|'light'|'dark'
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        let observer;
        let script;
        let didCancel = false;

        const isDarkMode = () => document.documentElement.classList.contains('dark');

        const renderWidget = () => {
            if (didCancel) return;
            if (twitterContainerRef.current && window.twttr) {
                try {
                    twitterContainerRef.current.innerHTML = '';
                    window.twttr.widgets.createTimeline(
                        {
                            sourceType: 'profile',
                            screenName: 'fcheckmaster'
                        },
                        twitterContainerRef.current,
                        {
                            height: 600,
                            theme: isDarkMode() ? 'dark' : 'light',
                            chrome: 'noheader nofooter noborders transparent',
                            borderColor: '#e1e8ed',
                            limit: 5
                        }
                    ).then(() => {
                        if (!didCancel) {
                            setIsLoading(false);
                            setWidgetLoaded(true);
                        }
                    }).catch(() => {
                        if (!didCancel) {
                            setError(true);
                            setIsLoading(false);
                        }
                    });
                } catch (e) {
                    setError(true);
                    setIsLoading(false);
                }
            }
        };

        const loadScriptAndRender = () => {
            if (window.twttr) {
                renderWidget();
                return;
            }

            setIsLoading(true);
            script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.onload = () => renderWidget();
            script.onerror = () => {
                if (!didCancel) {
                    setError(true);
                    setIsLoading(false);
                }
            };
            document.body.appendChild(script);
        };

        // Lazy-load when section is visible
        if (sectionRef.current && 'IntersectionObserver' in window) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadScriptAndRender();
                        if (observer) observer.disconnect();
                    }
                });
            }, { rootMargin: '200px' });

            observer.observe(sectionRef.current);
        } else {
            // Fallback: load immediately
            loadScriptAndRender();
        }

        // Give the widget up to 6s to load, then show fallback
        const timeout = setTimeout(() => {
            if (!widgetLoaded && !error) {
                setError(true);
                setIsLoading(false);
            }
        }, 6000);

        return () => {
            didCancel = true;
            if (observer) observer.disconnect();
            if (script && document.body.contains(script)) document.body.removeChild(script);
            clearTimeout(timeout);
        };
    }, [widgetLoaded]);

    // Persist settings to localStorage when they change
    useEffect(() => {
        try {
            localStorage.setItem('lf_showCount', String(showCount));
        } catch (e) {}
    }, [showCount]);

    useEffect(() => {
        try {
            localStorage.setItem('lf_widgetTheme', widgetTheme);
        } catch (e) {}
    }, [widgetTheme]);

    // Re-create the widget when the widgetTheme changes (or when user toggles)
    useEffect(() => {
        if (!twitterContainerRef.current) return;
        const recreate = async () => {
            // If twttr not loaded yet, skip — the main loader will handle it
            if (!window.twttr) return;
            try {
                setIsLoading(true);
                setError(false);
                setWidgetLoaded(false);
                twitterContainerRef.current.innerHTML = '';

                const isDark = document.documentElement.classList.contains('dark');
                const theme = widgetTheme === 'auto' ? (isDark ? 'dark' : 'light') : widgetTheme;

                await window.twttr.widgets.createTimeline(
                    { sourceType: 'profile', screenName: 'fcheckmaster' },
                    twitterContainerRef.current,
                    { height: 600, theme, chrome: 'noheader nofooter noborders transparent', borderColor: '#e1e8ed', limit: 5 }
                );
                setIsLoading(false);
                setWidgetLoaded(true);
            } catch (err) {
                setIsLoading(false);
                setError(true);
            }
        };

        recreate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [widgetTheme]);

    // Motion variants
    const listVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    const itemVariant = {
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
        hover: { scale: 1.02, y: -4, transition: { duration: 0.18 } }
    };

    const settingsVariant = {
        hidden: { opacity: 0, y: -6, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } }
    };

    return (
        <section id="fact-checks" className="py-20 bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 -left-1/4 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/6 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-900/50 rounded-full px-4 py-2 mb-4 border border-purple-500/40">
                        <FaRss className="text-purple-400" />
                        <span className="text-white/90 font-semibold text-sm">Live Updates</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                        Live <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Fact Checks</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto">
                        Stay informed with real-time fact-checking updates and verified information from our expert team.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div
                        style={{
                            backgroundColor: '#0f172a',
                            border: '1px solid rgba(168,85,247,0.35)',
                            borderRadius: 16,
                            boxShadow: '0 22px 44px rgba(0,0,0,0.5)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-700 to-purple-800 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaTwitter className="text-white text-lg" />
                                <h3 className="text-white font-bold text-lg">Twitter Feed</h3>
                                <span
                                    className="ml-2 px-3 py-1 text-xs font-semibold rounded-full text-white/95"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.28)' }}
                                >
                                    @fcheckmaster
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className="text-white text-sm hidden md:flex items-center gap-2 px-3 py-1 rounded-lg"
                                    style={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.18)' }}
                                >
                                    <FaCheckCircle className="text-green-300 text-base" />
                                    <span className="font-semibold">Verified</span>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setSettingsOpen(!settingsOpen)}
                                        className="text-sm font-bold"
                                        style={{
                                            color: '#ffffff',
                                            background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)',
                                            padding: '8px 16px',
                                            border: 'none',
                                            borderRadius: 10,
                                            boxShadow: '0 10px 20px rgba(139,92,246,0.35)',
                                            transition: 'filter 150ms ease-in-out'
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
                                    >
                                        Settings
                                    </button>
                                    <AnimatePresence>
                                    {settingsOpen && (
                                        <motion.div initial="hidden" animate="visible" exit="hidden" variants={settingsVariant} className="absolute right-0 mt-2 w-56 rounded-md shadow-2xl p-4 z-50" style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)' }}>
                                            <label className="block text-xs text-white/80 font-semibold mb-2">Items to show</label>
                                            <input type="range" min="1" max="5" value={showCount} onChange={(e) => setShowCount(Number(e.target.value))} className="w-full accent-purple-500" />
                                            <div className="flex items-center justify-between text-xs text-white/60 mt-2">
                                                <span>1</span>
                                                <span className="font-bold text-white">{showCount}</span>
                                                <span>5</span>
                                            </div>

                                            <label className="block text-xs text-white/80 font-semibold mt-4 mb-2">Theme</label>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setWidgetTheme('auto')} className={`px-3 py-1 rounded text-xs font-semibold transition-all ${widgetTheme==='auto' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>Auto</button>
                                                <button onClick={() => setWidgetTheme('light')} className={`px-3 py-1 rounded text-xs font-semibold transition-all ${widgetTheme==='light' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>Light</button>
                                                <button onClick={() => setWidgetTheme('dark')} className={`px-3 py-1 rounded text-xs font-semibold transition-all ${widgetTheme==='dark' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>Dark</button>
                                            </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <a href="https://x.com/fcheckmaster" target="_blank" rel="noopener noreferrer" className="text-white text-sm font-semibold underline hover:text-purple-300 transition-colors">Open</a>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-8" role="status" aria-live="polite">
                                    <div className="w-full max-w-4xl space-y-4">
                                        {[1,2,3].map((i) => (
                                            <div key={i} className="h-20 rounded-lg animate-pulse" style={{ backgroundColor: '#0b1220', border: '1px solid rgba(168,85,247,0.25)' }} />
                                        ))}
                                    </div>
                                    <p className="sr-only">Loading latest fact checks</p>
                                </div>
                            )}

                            {/* If widget loaded successfully, render the widget container */}
                            {!error && widgetLoaded && (
                                <div ref={twitterContainerRef} className="min-h-[600px] w-full">
                                    {/* Twitter widget will be rendered here */}
                                </div>
                            )}

                            {/* Error or blocked - show animated fallback tweets */}
                            {(error || !widgetLoaded) && (
                                <div className="space-y-4">
                                    <p className="text-center text-white/70 mb-4 font-semibold">Latest updates from @fcheckmaster</p>
                                    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={listVariant} initial="hidden" animate="visible">
                                        {sampleTweets.slice(0, showCount).map((t, i) => {
                                            const initials = t.author.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
                                            return (
                                                <motion.a
                                                    className="block"
                                                    key={t.id}
                                                    href={t.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    variants={itemVariant}
                                                    whileHover="hover"
                                                    style={{
                                                        backgroundColor: '#111827',
                                                        border: '1px solid rgba(168,85,247,0.28)',
                                                        borderRadius: 14,
                                                        boxShadow: '0 14px 28px rgba(0,0,0,0.45)',
                                                        padding: 20,
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{initials}</div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-sm text-white font-bold">{t.author}</div>
                                                            <div className="text-xs text-white/60">{t.date}</div>
                                                            <div className="mt-2 text-white/80 text-sm leading-relaxed">{t.text}</div>
                                                        </div>
                                                    </div>
                                                </motion.a>
                                            )
                                        })}
                                    </motion.div>

                                    <div className="mt-6 text-center">
                                        <div
                                            style={{
                                                display: 'inline-block',
                                                backgroundColor: '#0f172a',
                                                border: '1px solid rgba(168,85,247,0.35)',
                                                borderRadius: 12,
                                                boxShadow: '0 16px 32px rgba(0,0,0,0.5)',
                                                padding: 12
                                            }}
                                        >
                                            <button
                                                disabled
                                                title="Upgrade to API integration to enable richer content"
                                                style={{
                                                    background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)',
                                                    color: '#ffffff',
                                                    padding: '12px 20px',
                                                    border: 'none',
                                                    borderRadius: 10,
                                                    fontWeight: 700,
                                                    cursor: 'not-allowed',
                                                    opacity: 0.85,
                                                    boxShadow: '0 10px 22px rgba(139,92,246,0.4)'
                                                }}
                                            >
                                                Enable API (coming soon)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-white/[0.05] px-6 py-4 border-t border-white/[0.1]">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/70 font-medium">
                                    Follow us for real-time updates
                                </span>
                                <a 
                                    href="https://twitter.com/fcheckmaster" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-purple-300 hover:text-purple-200 font-bold transition-colors duration-200"
                                >
                                    @fcheckmaster
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Feature cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        {
                            icon: FaCheckCircle,
                            title: "Verified Sources",
                            desc: "Cross-referenced with reliable sources",
                            color: "text-green-400"
                        },
                        {
                            icon: FaRss,
                            title: "Real-time Updates",
                            desc: "Instant misinformation alerts",
                            color: "text-purple-300"
                        },
                        {
                            icon: FaExclamationTriangle,
                            title: "Threat Detection",
                            desc: "Early warning system for propaganda",
                            color: "text-orange-400"
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                            viewport={{ once: true }}
                            className="transition-all duration-300 transform hover:-translate-y-1"
                            style={{
                                backgroundColor: '#111827',
                                border: '1px solid rgba(168,85,247,0.28)',
                                borderRadius: 14,
                                boxShadow: '0 14px 28px rgba(0,0,0,0.45)',
                                padding: 24
                            }}
                        >
                            <feature.icon className={`${feature.color} text-3xl mb-4`} />
                            <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                            <p className="text-sm text-white/70">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default LiveFeed;