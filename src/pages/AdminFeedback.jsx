import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const box = {
  backgroundColor: '#0f172a',
  border: '1px solid rgba(168,85,247,0.35)',
  borderRadius: 16,
  boxShadow: '0 22px 44px rgba(0,0,0,0.5)'
};

export default function AdminFeedback() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('af_admin_key') || '');

  const loadList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/feedback');
      setItems(res.data || []);
    } catch (e) {
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async (id) => {
    try {
      const res = await axios.get(`/api/replies?feedback_id=${id}`);
      setReplies(res.data || []);
    } catch (e) {
      setReplies([]);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (selected) loadReplies(selected.id);
  }, [selected?.id]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(x =>
      (x.name || '').toLowerCase().includes(q) ||
      (x.email || '').toLowerCase().includes(q) ||
      (x.subject || '').toLowerCase().includes(q) ||
      (x.message || '').toLowerCase().includes(q)
    );
  }, [items, query]);

  const submitReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSubmitting(true);
    try {
      const response = await axios.post('/api/replies', {
        feedback_id: selected.id,
        reply: replyText
      });
      
      // Show feedback about email status (only if email fields are present)
      if (response.data.hasOwnProperty('emailSent')) {
        if (response.data.emailSent) {
          alert('Reply sent successfully! ✅ Email notification delivered to user.');
        } else {
          const errorMsg = response.data.emailError ? ` (${response.data.emailError})` : '';
          alert(`Reply saved successfully! ⚠️ Email notification could not be sent${errorMsg}`);
        }
      } else {
        alert('Reply sent successfully!');
      }
      
      setReplyText('');
      await loadReplies(selected.id);
    } catch (e) {
      console.error('Reply submission error:', e);
      alert('Failed to add reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(2, 6, 23), rgb(0, 0, 0))', 
      paddingTop: '5rem', 
      paddingBottom: '5rem', 
      paddingLeft: 'clamp(0.5rem, 2vw, 1rem)', 
      paddingRight: 'clamp(0.5rem, 2vw, 1rem)' 
    }}>
      {/* Force mobile styles with CSS */}
      <style>{`
        @media (max-width: 768px) {
          .admin-header-mobile {
            display: flex !important;
            flex-direction: column !important;
            gap: 1rem !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          .admin-controls-mobile {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            gap: 0.75rem !important;
            align-items: stretch !important;
          }
          .admin-buttons-mobile {
            display: flex !important;
            gap: 0.5rem !important;
            width: 100% !important;
          }
          .admin-buttons-mobile button {
            flex: 1 !important;
            padding: 12px !important;
            font-size: 0.85rem !important;
            white-space: nowrap !important;
          }
          .admin-search-mobile {
            width: 100% !important;
            padding: 12px !important;
            font-size: 0.9rem !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
      
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* Mobile-First Header */}
        <div className="admin-header-mobile" style={{ marginBottom: '1.5rem' }}>
          {/* Title */}
          <h1 style={{ 
            fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', 
            fontWeight: 800,
            color: 'white',
            margin: '0',
            textAlign: 'center'
          }}>Feedback Admin</h1>
          
          {/* Mobile Controls */}
          <div className="admin-controls-mobile">
            {/* Buttons Row */}
            <div className="admin-buttons-mobile">
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
                  fontSize: '0.85rem'
                }}
              >
                Manage Posts
              </button>
              <button
                onClick={() => { try { localStorage.removeItem('af_logged_in'); localStorage.removeItem('af_admin_key'); } catch {} navigate('/admin/login', { replace: true }); }}
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: 10, 
                  border: 'none', 
                  fontWeight: 700, 
                  background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)', 
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >Sign out</button>
            </div>
            
            {/* Search Row */}
            <input
              className="admin-search-mobile"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search feedback..."
              style={{ 
                padding: '12px 16px', 
                borderRadius: 10, 
                border: '1px solid rgba(255,255,255,0.2)', 
                background: '#111827', 
                color: 'white', 
                fontSize: '0.9rem',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ 
          ...box, 
          padding: '16px', 
          marginBottom: 16, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          alignItems: 'stretch'
        }}>
          <span style={{ 
            color: 'rgba(255,255,255,0.75)', 
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>Admin Key (Optional)</span>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'stretch',
            flexWrap: 'wrap'
          }}>
            <input
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin key if server has ADMIN_KEY set"
              style={{ 
                padding: '10px 12px', 
                borderRadius: 8, 
                border: '1px solid rgba(255,255,255,0.2)', 
                background: '#111827', 
                color: 'white', 
                fontSize: '0.9rem',
                flex: '1 1 200px',
                minWidth: '200px'
              }}
            />
            <button
              onClick={() => localStorage.setItem('af_admin_key', adminKey)}
              style={{
                background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)', 
                color: 'white', 
                border: 'none', 
                borderRadius: 8,
                padding: '10px 16px', 
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flex: '0 0 auto'
              }}
            >Save</button>
          </div>
          
          <span style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: '0.8rem',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>Only needed if server has ADMIN_KEY configured</span>
        </div>

        {error && (
          <div style={{ ...box, padding: 14, color: '#fecaca', borderColor: 'rgba(239,68,68,0.5)' }}>\n            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr', gap: 16 }}>
          {/* List */}
          <div style={{ ...box, overflow: 'hidden' }}>
            <div style={{ padding: 14, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>Latest Feedback</div>
            </div>
            <div style={{ maxHeight: 560, overflow: 'auto' }}>
              {loading ? (
                <div style={{ padding: 16, color: 'rgba(255,255,255,0.7)' }}>Loading...</div>
              ) : (
                filtered.length === 0 ? (
                  <div style={{ padding: 16, color: 'rgba(255,255,255,0.7)' }}>No feedback found.</div>
                ) : (
                  filtered.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelected(f)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left', padding: 14,
                        border: 'none', background: selected?.id === f.id ? 'rgba(168,85,247,0.12)' : 'transparent',
                        color: 'white', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{f.subject || 'No subject'}</div>
                          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                            {(f.name || 'Anon')} · {(f.email || 'N/A')}
                          </div>
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                          {new Date(f.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.85)' }}>
                        {f.message?.slice(0, 120)}{(f.message || '').length > 120 ? '…' : ''}
                      </div>
                    </button>
                  ))
                )
              )}
            </div>
          </div>

          {/* Detail & Replies */}
          <div style={{ ...box, padding: 16 }}>
            {!selected ? (
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>Select a feedback item to view details and replies.</div>
            ) : (
              <div>
                <div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{selected.email || 'N/A'}</div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{selected.subject || 'No subject'}</h2>
                  <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{selected.message}</div>
                  <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>By {selected.name || 'Anonymous'} on {new Date(selected.created_at).toLocaleString()}</div>
                </div>

                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

                <div>
                  <div style={{ fontWeight: 800, marginBottom: 8 }}>Replies</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflow: 'auto', paddingRight: 4 }}>
                    {replies.length === 0 ? (
                      <div style={{ color: 'rgba(255,255,255,0.6)' }}>No replies yet.</div>
                    ) : (
                      replies.map(r => (
                        <div key={r.id} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 8 }}>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{r.reply}</div>
                            <div style={{ minWidth: 140, textAlign: 'right' }}>
                              {r.emailed ? (
                                <div style={{ fontSize: 12, color: '#4ade80' }}>Emailed ✓{r.delivered_at ? ` · ${new Date(r.delivered_at).toLocaleString()}` : ''}</div>
                              ) : (
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Email pending</div>
                              )}
                            </div>
                          </div>
                          <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>By {r.replied_by || 'Admin'} · {new Date(r.created_at).toLocaleString()}</div>
                          {r.email_error ? (
                            <div style={{ marginTop: 6, fontSize: 12, color: '#fecaca' }}>Email error: {r.email_error}</div>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="Write a reply..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: '#111827', color: 'white', resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button
                      onClick={submitReply}
                      disabled={submitting || !replyText.trim()}
                      style={{
                        background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)',
                        color: '#ffffff',
                        padding: '10px 16px',
                        border: 'none',
                        borderRadius: 10,
                        fontWeight: 700,
                        opacity: submitting || !replyText.trim() ? 0.6 : 1,
                        cursor: submitting || !replyText.trim() ? 'not-allowed' : 'pointer',
                        boxShadow: '0 10px 20px rgba(139,92,246,0.35)'
                      }}
                    >
                      {submitting ? 'Sending…' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
