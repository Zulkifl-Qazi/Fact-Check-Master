import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaCommentDots, FaUser, FaGoogle, FaFacebook, FaApple, FaInstagram, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';

const box = {
  backgroundColor: '#0f172a',
  border: '1px solid rgba(37, 99, 235, 0.35)',
  borderRadius: 16,
  boxShadow: '0 22px 44px rgba(0,0,0,0.5)'
};

export default function AdminComments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('af_admin_key') || '');

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/comments');
      setComments(res.data || []);
    } catch (e) {
      console.error('Failed to load comments:', e);
      setError(e.response?.data?.error || 'Failed to load comments from the database. Make sure the database is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return comments;
    const q = query.toLowerCase();
    return comments.filter(c =>
      (c.username || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.content || '').toLowerCase().includes(q) ||
      (c.post_title || '').toLowerCase().includes(q)
    );
  }, [comments, query]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to permanently delete this comment?')) return;

    try {
      const deleteUrl = window.location.hostname === 'localhost'
        ? `/api/comments/${commentId}`
        : `/api/comments?id=${commentId}`;

      await axios.delete(deleteUrl, {
        headers: {
          'x-admin-key': adminKey
        }
      });

      alert('Comment deleted successfully!');
      if (selected?.id === commentId) {
        setSelected(null);
      }
      loadComments();
    } catch (e) {
      console.error('Failed to delete comment:', e);
      alert(e.response?.data?.error || 'Failed to delete comment.');
    }
  };

  return (
    <section className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300" style={{ 
      minHeight: '100vh', 
      paddingTop: '5rem', 
      paddingBottom: '5rem', 
      paddingLeft: 'clamp(0.5rem, 2vw, 1rem)', 
      paddingRight: 'clamp(0.5rem, 2vw, 1rem)' 
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* Header navigation tab */}
        <div style={{ 
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
          gap: '1rem',
          alignItems: window.innerWidth <= 768 ? 'center' : 'flex-start'
        }}>
          <h1 
            className="text-slate-900 dark:text-white"
            style={{ 
              fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', 
              fontWeight: 800,
              margin: '0',
              textAlign: 'center'
            }}
          >Comments Admin</h1>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '0.75rem',
            alignItems: 'stretch',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              width: '100%',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => navigate('/admin/posts')}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #059669, #10b981)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  flex: '1 1 120px'
                }}>
                Manage Posts
              </button>
              <button
                onClick={() => navigate('/admin/feedback')}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  flex: '1 1 120px'
                }}>
                Feedback
              </button>
              <button
                onClick={() => navigate('/admin/articles')}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #4f46e5, #6366f1)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  flex: '1 1 120px'
                }}>
                Articles
              </button>
              <button
                onClick={() => navigate('/admin/notifications')}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #d97706, #f59e0b)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  flex: '1 1 120px'
                }}>
                Notifications
              </button>
            </div>
            
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search comments by user, email, post..."
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-300"
              style={{ 
                padding: '12px 16px', 
                borderRadius: 10, 
                fontSize: '0.9rem',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{ ...box, padding: 16, color: '#fecaca', borderColor: 'rgba(239,68,68,0.5)', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '2fr 1.4fr', gap: 16 }}>
          {/* List panel */}
          <div style={{ ...box, overflow: 'hidden' }}>
            <div style={{ padding: 14, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>Published Comments ({filtered.length})</div>
            </div>
            <div style={{ maxHeight: 560, overflow: 'auto' }}>
              {loading ? (
                <div style={{ padding: 16, color: 'rgba(255,255,255,0.7)' }}>Loading comments...</div>
              ) : (
                filtered.length === 0 ? (
                  <div style={{ padding: 16, color: 'rgba(255,255,255,0.7)' }}>No comments found.</div>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left', padding: 14,
                        border: 'none', background: selected?.id === c.id ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                        color: 'white', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'start' }}>
                          <img src={c.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontWeight: 700 }}>{c.username}</span>
                              <span style={{ fontSize: 10, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '1px 5px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                {c.provider === 'google' && <FaGoogle className="text-red-500" />}
                                {c.provider === 'facebook' && <FaFacebook className="text-blue-600" />}
                                {c.provider === 'instagram' && <FaInstagram className="text-pink-500" />}
                                {c.provider === 'apple' && <FaApple />}
                                {c.provider === 'email' && <FaEnvelope />}
                                {c.provider}
                              </span>
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, wordBreak: 'break-all' }}>
                              {c.email}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4, lineClamp: 1, WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {c.content}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                            {new Date(c.created_at).toLocaleDateString()}
                          </div>
                          <span style={{ color: '#60a5fa', fontSize: 11, fontWeight: 'semibold', display: 'block', marginTop: 4, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.post_title}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )
              )}
            </div>
          </div>

          {/* Details & Deletion Panel */}
          <div style={{ ...box, padding: 18, color: 'white' }}>
            {selected ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', itemsCenter: 'center', gap: 10, pb: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 14 }}>
                    <img src={selected.avatar_url} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>{selected.username}</h4>
                      <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{selected.email}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: 4 }}>Fact Checked Post</span>
                    <div style={{ color: '#60a5fa', fontWeight: 'semibold', fontSize: 13 }}>
                      {selected.post_title}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: 4 }}>Date Posted</span>
                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>
                      {new Date(selected.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, display: 'block', textTransform: 'uppercase', marginBottom: 4 }}>Comment Content</span>
                    <div style={{ 
                      padding: 12, 
                      backgroundColor: 'rgba(255,255,255,0.04)', 
                      borderRadius: 8, 
                      fontSize: 13.5, 
                      lineHeight: 1.5,
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selected.content}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button
                    onClick={() => handleDeleteComment(selected.id)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(90deg, #dc2626, #ef4444)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8
                    }}
                  >
                    <FaTrash />
                    Delete Comment
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                padding: '40px 0'
              }}>
                <FaCommentDots style={{ fontSize: 44, color: 'rgba(255,255,255,0.15)', marginBottom: 12 }} />
                <h4 style={{ margin: '0 0 4px 0', color: 'rgba(255,255,255,0.85)' }}>No Comment Selected</h4>
                <p style={{ margin: 0, fontSize: 12 }}>Select a comment from the list to preview details and manage.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
