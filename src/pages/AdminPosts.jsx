import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPlus, FaTrash, FaEye, FaCheckCircle, FaExclamationTriangle, FaTimes, FaPen } from 'react-icons/fa';

const AdminPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Fact Check Master',
    fact_check_status: 'verified',
    categories: ['latest-news'], // Changed to array for multiple categories
    postUrl: '',
    imageUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);

  // Auto-refresh posts every 15 seconds for live collaboration
  useEffect(() => {
    const interval = setInterval(() => {
      loadPosts();
    }, 15000); // Refresh every 15 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Check admin authentication
  useEffect(() => {
    const adminKey = localStorage.getItem('af_admin_key');
    if (!adminKey || adminKey !== 'factadmin') {
      navigate('/admin-login');
      return;
    }
    loadPosts();
  }, [navigate]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchPostData = async () => {
    if (!formData.postUrl.trim()) {
      alert('Please enter a post URL first');
      return;
    }

    setFetchingUrl(true);
    try {
      const response = await axios.post('/api/fetch-post', { url: formData.postUrl });
      const { title, content, author, imageUrl, message } = response.data;
      
      setFormData(prev => ({
        ...prev,
        title: title || prev.title,
        content: content || prev.content,
        author: author || prev.author,
        imageUrl: imageUrl || prev.imageUrl
      }));
      
      if (message) {
        alert(`✅ URL processed!\n\n${message}\n\nPlease review and edit the content as needed.`);
      } else {
        alert('Post data fetched successfully! ✅\n\nPlease review and edit the content as needed.');
      }
    } catch (error) {
      console.error('Failed to fetch post data:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`ℹ️ ${error.response.data.message}`);
      } else {
        alert('Failed to fetch post data. Please check the URL and try again, or enter the content manually.');
      }
    } finally {
      setFetchingUrl(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    setSubmitting(true);
    try {
      console.log('Submitting post data:', formData);
      const response = await axios.post('/api/posts', formData);
      console.log('Post created successfully:', response.data);
      setFormData({ title: '', content: '', author: 'Fact Check Master', fact_check_status: 'verified', categories: ['latest-news'], postUrl: '', imageUrl: '' });
      setShowAddForm(false);
      // WebSocket will automatically trigger loadPosts via the 'posts_updated' event
      await loadPosts(); // Manually reload to ensure we see the new post
      alert('Post created successfully! ✅');
    } catch (error) {
      console.error('Failed to create post:', error);
      console.error('Error details:', error.response?.data);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      alert(`Failed to create post: ${errorMsg}\n\nCheck console for details.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await axios.delete(`/api/posts?id=${postId}`);
      console.log('Delete response:', response.data);
      
      // Reload posts immediately after deletion
      await loadPosts();
      alert('Post deleted successfully! ✅');
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert(`Failed to delete post: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      fact_check_status: post.fact_check_status,
      categories: post.category ? [post.category] : ['latest-news'],
      postUrl: post.source_url || '',
      imageUrl: post.image_url || ''
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    setSubmitting(true);
    try {
      console.log('Updating post:', editingPost.id, formData);
      const response = await axios.put(`/api/posts?id=${editingPost.id}`, formData);
      console.log('Post updated successfully:', response.data);
      setFormData({ title: '', content: '', author: 'Fact Check Master', fact_check_status: 'verified', categories: ['latest-news'], postUrl: '', imageUrl: '' });
      setShowAddForm(false);
      setEditingPost(null);
      await loadPosts();
      alert('Post updated successfully! ✅');
    } catch (error) {
      console.error('Failed to update post:', error);
      alert(`Failed to update post: ${error.response?.data?.error || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '', author: 'Fact Check Master', fact_check_status: 'verified', categories: ['latest-news'], postUrl: '', imageUrl: '' });
    setShowAddForm(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <FaCheckCircle className="text-green-400" />;
      case 'disputed':
        return <FaExclamationTriangle className="text-yellow-400" />;
      case 'false':
        return <FaTimes className="text-red-400" />;
      default:
        return <FaEye className="text-blue-400" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
      
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Mobile-First Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'space-between', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          '@media (maxWidth: 768px)': {
            flexDirection: 'column',
            alignItems: 'center'
          }
        }}>
          {/* Back Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '200px' }}>
            <button
              onClick={() => navigate('/admin/feedback')}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(71, 85, 105, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              ← Back to Feedback
            </button>
          </div>
          
          {/* Title Section */}
          <div style={{ minWidth: '0' }}>
            <h1 style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
              fontWeight: '800', 
              color: 'white', 
              marginBottom: '0.5rem',
              lineHeight: '1.2'
            }}>Posts Management</h1>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              margin: '0'
            }}>Create and manage posts for the Latest News</p>
          </div>
          
          {/* Add Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(168, 85, 247))',
              color: 'white',
              padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 8px 25px rgba(147, 51, 234, 0.4)',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              whiteSpace: 'nowrap',
              flexShrink: '0'
            }}
          >
            <FaPlus />
            {showAddForm ? 'Cancel' : 'Add Post'}
          </button>
        </div>

        {/* Add Post Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(30, 41, 59, 0.95)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem',
              border: '2px solid rgba(168, 85, 247, 0.3)'
            }}
          >
            <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <form onSubmit={editingPost ? handleUpdate : handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* URL Fetching Section */}
              <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Post URL (Optional) - Twitter/X URLs require manual content entry
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    name="postUrl"
                    value={formData.postUrl}
                    onChange={handleChange}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(71, 85, 105, 0.5)',
                      border: '2px solid rgb(51, 65, 85)',
                      borderRadius: '8px',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="Paste any post URL (Twitter/X, Facebook, news articles, etc.)..."
                  />
                  <button
                    type="button"
                    onClick={fetchPostData}
                    disabled={fetchingUrl || !formData.postUrl.trim()}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: fetchingUrl ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(to right, rgb(59, 130, 246), rgb(37, 99, 235))',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: fetchingUrl ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {fetchingUrl ? 'Processing...' : 'Auto-Fill'}
                  </button>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0' }}>
                    📱 <strong>Twitter/X:</strong> Will extract username and provide template - you'll need to manually copy tweet content<br/>
                    🌐 <strong>Other sites:</strong> Attempts to auto-extract title, content, author, and images<br/>
                    ✨ <strong>Manual entry:</strong> You can always skip URL fetching and fill everything manually
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '0.5rem' }}>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(71, 85, 105, 0.5)',
                      border: '2px solid rgb(51, 65, 85)',
                      borderRadius: '8px',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="Enter post title..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '0.5rem' }}>Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(71, 85, 105, 0.5)',
                      border: '2px solid rgb(51, 65, 85)',
                      borderRadius: '8px',
                      color: 'white',
                      outline: 'none'
                    }}
                    placeholder="Author name..."
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '0.5rem' }}>Fact Check Status</label>
                <select
                  name="fact_check_status"
                  value={formData.fact_check_status}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(71, 85, 105, 0.5)',
                    border: '2px solid rgb(51, 65, 85)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="verified">✅ Verified</option>
                  <option value="disputed">⚠️ Disputed</option>
                  <option value="false">❌ False</option>
                  <option value="investigating">🔍 Under Investigation</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '0.75rem', fontSize: '1rem' }}>
                  Categories (Select one or more)
                </label>
                <div style={{ 
                  background: 'rgba(71, 85, 105, 0.3)',
                  border: '2px solid rgb(51, 65, 85)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem'
                }}>
                  {[
                    { value: 'latest-news', label: 'Latest News', icon: '📰' },
                    { value: 'world-news', label: 'World News', icon: '🌍' },
                    { value: 'viral-claims', label: 'Viral Claims', icon: '🔥' },
                    { value: 'military-claims', label: 'Military Claims', icon: '⚔️' },
                    { value: 'sports-news', label: 'Sports News', icon: '⚽' }
                  ].map(category => (
                    <label 
                      key={category.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: formData.categories.includes(category.value) 
                          ? 'rgba(147, 51, 234, 0.3)' 
                          : 'rgba(71, 85, 105, 0.5)',
                        border: formData.categories.includes(category.value)
                          ? '2px solid rgb(168, 85, 247)'
                          : '2px solid transparent',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        userSelect: 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!formData.categories.includes(category.value)) {
                          e.currentTarget.style.background = 'rgba(71, 85, 105, 0.7)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!formData.categories.includes(category.value)) {
                          e.currentTarget.style.background = 'rgba(71, 85, 105, 0.5)';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.value)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...formData.categories, category.value]
                            : formData.categories.filter(c => c !== category.value);
                          setFormData({ ...formData, categories: newCategories.length > 0 ? newCategories : ['latest-news'] });
                        }}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: 'rgb(168, 85, 247)'
                        }}
                      />
                      <span style={{ fontSize: '1.25rem' }}>{category.icon}</span>
                      <span style={{ 
                        color: 'white', 
                        fontWeight: formData.categories.includes(category.value) ? '600' : '500',
                        fontSize: '0.95rem'
                      }}>
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
                <p style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.875rem', 
                  color: 'rgba(255,255,255,0.6)',
                  fontStyle: 'italic'
                }}>
                  💡 Select multiple categories to display the post in different sections
                </p>
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '0.5rem' }}>Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(71, 85, 105, 0.5)',
                    border: '2px solid rgb(51, 65, 85)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none'
                  }}
                  placeholder="Direct image URL or fetched automatically..."
                />
                {formData.imageUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '0.5rem' }}>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(71, 85, 105, 0.5)',
                    border: '2px solid rgb(51, 65, 85)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Write your post content here..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={editingPost ? handleCancelEdit : () => setShowAddForm(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(71, 85, 105, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.title.trim() || !formData.content.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: submitting ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(to right, rgb(147, 51, 234), rgb(168, 85, 247))',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {submitting ? (editingPost ? 'Updating...' : 'Creating...') : (editingPost ? 'Update Post' : 'Create Post')}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Posts List */}
        <div style={{ background: 'rgba(30, 41, 59, 0.95)', borderRadius: '16px', border: '2px solid rgba(168, 85, 247, 0.3)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700' }}>All Posts ({posts.length})</h2>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
              No posts found. Create your first post above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>{post.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getStatusIcon(post.fact_check_status)}
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: post.fact_check_status === 'verified' ? 'rgb(34, 197, 94)' : 
                                post.fact_check_status === 'disputed' ? 'rgb(251, 191, 36)' :
                                post.fact_check_status === 'false' ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)',
                          backgroundColor: post.fact_check_status === 'verified' ? 'rgba(34, 197, 94, 0.2)' : 
                                          post.fact_check_status === 'disputed' ? 'rgba(251, 191, 36, 0.2)' :
                                          post.fact_check_status === 'false' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'
                        }}>
                          {getStatusText(post.fact_check_status)}
                        </span>
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', margin: '0 0 0.75rem 0' }}>{post.content}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(post)}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: 'rgb(147, 197, 253)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Edit post"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: 'rgb(252, 165, 165)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete post"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminPosts;