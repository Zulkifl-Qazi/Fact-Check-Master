import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaRss, FaClock, FaUser } from 'react-icons/fa';

const PostView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('/api/posts');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const posts = await response.json();
                const foundPost = posts.find(p => p.id.toString() === id);
                
                if (!foundPost) {
                    setError('Post not found');
                    return;
                }
                
                setPost(foundPost);
                
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
            'verified': 'bg-green-100 text-green-800 border-green-200',
            'false': 'bg-red-100 text-red-800 border-red-200',
            'misleading': 'bg-orange-100 text-orange-800 border-orange-200',
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
        
        return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const handleGoBack = () => {
        navigate('/#live-feed');
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #334155',
                        borderTop: '4px solid #8b5cf6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <p style={{ color: '#9ca3af' }}>Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <div style={{
                    textAlign: 'center',
                    backgroundColor: '#1e293b',
                    padding: '40px',
                    borderRadius: '12px',
                    border: '1px solid #334155'
                }}>
                    <FaExclamationTriangle style={{ fontSize: '48px', color: '#ef4444', marginBottom: '16px' }} />
                    <h2 style={{ color: 'white', marginBottom: '8px' }}>Post Not Found</h2>
                    <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
                        {error || 'The post you\'re looking for doesn\'t exist.'}
                    </p>
                    <button
                        onClick={handleGoBack}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '10px 20px',
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                    >
                        <FaArrowLeft style={{ marginRight: '8px' }} />
                        Back to Latest News
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            paddingTop: '80px'
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '20px'
            }}>
                {/* Back button */}
                <button
                    onClick={handleGoBack}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#9ca3af',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '32px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#1e293b';
                        e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#9ca3af';
                    }}
                >
                    <FaArrowLeft style={{ marginRight: '8px' }} />
                    Back to Latest News
                </button>

                {/* Post content */}
                <article style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '16px',
                    border: '1px solid #334155',
                    overflow: 'hidden'
                }}>
                    {/* Status badge */}
                    <div style={{ padding: '24px 32px 0' }}>
                        <span 
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(post.fact_check_status)}`}
                        >
                            {getStatusIcon(post.fact_check_status)}
                            <span style={{ marginLeft: '8px', textTransform: 'capitalize' }}>{post.fact_check_status}</span>
                        </span>
                    </div>

                    {/* Image */}
                    {post.image_url && (
                        <div style={{ padding: '24px 32px 0' }}>
                            <img
                                src={post.image_url}
                                alt={post.title}
                                style={{
                                    width: '100%',
                                    maxHeight: '400px',
                                    objectFit: 'cover',
                                    borderRadius: '12px'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ padding: '32px' }}>
                        {/* Title */}
                        <h1 style={{
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '24px',
                            lineHeight: '1.2'
                        }}>
                            {post.title}
                        </h1>

                        {/* Meta info */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '16px',
                            marginBottom: '32px',
                            paddingBottom: '24px',
                            borderBottom: '1px solid #334155'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#9ca3af',
                                fontSize: '14px'
                            }}>
                                <FaUser style={{ marginRight: '8px', color: '#8b5cf6' }} />
                                <span style={{ fontWeight: '500' }}>{post.author || 'Admin'}</span>
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#9ca3af',
                                fontSize: '14px'
                            }}>
                                <FaClock style={{ marginRight: '8px', color: '#8b5cf6' }} />
                                <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{
                            color: '#e2e8f0',
                            lineHeight: '1.7',
                            fontSize: '18px',
                            marginBottom: '40px',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {post.content}
                        </div>

                        {/* Source link */}
                        {post.source_url && (
                            <div style={{
                                paddingTop: '32px',
                                borderTop: '1px solid #334155'
                            }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: 'white',
                                    marginBottom: '16px'
                                }}>Original Source</h3>
                                <a
                                    href={post.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '12px 24px',
                                        backgroundColor: '#2563eb',
                                        color: 'white',
                                        fontWeight: '500',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#1d4ed8';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#2563eb';
                                        e.target.style.transform = 'translateY(0px)';
                                    }}
                                >
                                    Visit Original Source
                                    <svg style={{ marginLeft: '8px', width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1a1 1 0 10-2 0v1H5V7h1a1 1 0 000-2H5z" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                </article>
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