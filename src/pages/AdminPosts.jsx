import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPlus, FaTrash, FaEye, FaCheckCircle, FaExclamationTriangle, FaTimes, FaPen, FaImage, FaVideo, FaStar, FaFire, FaRss, FaRobot, FaBolt, FaSearch, FaGlobe, FaChartBar, FaPaperPlane, FaRedo, FaArrowRight, FaCloudUploadAlt, FaLink, FaQuoteLeft } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { parseVideoUrl, getVideoPlatformIcon, getVideoPlatformName } from '../utils/videoParser';
import MediaCarousel from '../components/MediaCarousel';

// Custom styles for Quill editor with dark theme
const quillStyles = `
  .ql-container {
    background: rgba(30, 41, 59, 0.8);
    border: 2px solid rgba(29, 78, 216, 0.3) !important;
    border-top: none !important;
    border-radius: 0 0 12px 12px;
    font-size: 16px;
    min-height: 250px;
  }
  
  .ql-toolbar {
    background: rgba(51, 65, 85, 0.8);
    border: 2px solid rgba(29, 78, 216, 0.3) !important;
    border-bottom: 1px solid rgba(29, 78, 216, 0.2) !important;
    border-radius: 12px 12px 0 0;
    padding: 12px;
  }
  
  .ql-toolbar .ql-stroke {
    stroke: rgba(255, 255, 255, 0.9);
  }
  
  .ql-toolbar .ql-fill {
    fill: rgba(255, 255, 255, 0.9);
  }
  
  .ql-toolbar .ql-picker-label {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .ql-toolbar button:hover,
  .ql-toolbar button:focus,
  .ql-toolbar button.ql-active {
    background: rgba(29, 78, 216, 0.2);
    border-radius: 6px;
  }
  
  .ql-toolbar button:hover .ql-stroke,
  .ql-toolbar button:focus .ql-stroke,
  .ql-toolbar button.ql-active .ql-stroke {
    stroke: #3b82f6;
  }
  
  .ql-toolbar button:hover .ql-fill,
  .ql-toolbar button:focus .ql-fill,
  .ql-toolbar button.ql-active .ql-fill {
    fill: #3b82f6;
  }
  
  .ql-editor {
    min-height: 250px;
    color: rgba(255, 255, 255, 0.95) !important;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.8;
    padding: 20px;
  }
  
  .ql-editor * {
    color: rgba(255, 255, 255, 0.95) !important;
    background-color: transparent !important;
  }
  
  .ql-editor.ql-blank::before {
    color: rgba(255, 255, 255, 0.4) !important;
    font-style: normal;
    left: 20px;
  }
  
  .ql-editor p,
  .ql-editor ol,
  .ql-editor ul,
  .ql-editor li,
  .ql-editor h1,
  .ql-editor h2,
  .ql-editor h3,
  .ql-editor span,
  .ql-editor div {
    color: rgba(255, 255, 255, 0.95) !important;
  }
  
  .ql-editor strong {
    font-weight: 700;
    color: rgba(255, 255, 255, 1) !important;
  }
  
  .ql-editor em {
    font-style: italic;
    color: rgba(255, 255, 255, 0.95) !important;
  }
  
  .ql-editor u {
    text-decoration: underline;
    color: rgba(255, 255, 255, 0.95) !important;
  }
  
  .ql-editor a {
    color: #3b82f6 !important;
    text-decoration: underline;
  }
  
  .ql-editor ol,
  .ql-editor ul {
    padding-left: 1.5em;
    color: rgba(255, 255, 255, 0.95) !important;
  }
  
  .ql-snow .ql-tooltip {
    background-color: rgba(30, 41, 59, 0.98);
    border: 1px solid rgba(29, 78, 216, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 8px;
  }
  
  .ql-snow .ql-tooltip input[type=text] {
    background: rgba(51, 65, 85, 0.8);
    border: 1px solid rgba(29, 78, 216, 0.3);
    color: white;
    padding: 8px;
    border-radius: 6px;
  }
  
  .ql-snow .ql-tooltip input[type=text]::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  .ql-snow .ql-tooltip a.ql-action::after,
  .ql-snow .ql-tooltip a.ql-remove::before {
    color: #3b82f6;
  }
  
  .ql-snow .ql-picker-options {
    background-color: rgba(30, 41, 59, 0.98);
    border: 1px solid rgba(29, 78, 216, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
  }
  
  .ql-snow .ql-picker-options .ql-picker-item {
    color: rgba(255, 255, 255, 0.9);
  }
  
  .ql-snow .ql-picker-options .ql-picker-item:hover {
    background-color: rgba(29, 78, 216, 0.2);
    color: #3b82f6;
  }
  
  /* Post content display styling */
  .post-content-display p {
    margin: 0 0 1em 0;
    color: rgba(255, 255, 255, 0.85);
  }
  
  .post-content-display strong {
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
  }
  
  .post-content-display em {
    font-style: italic;
  }
  
  .post-content-display u {
    text-decoration: underline;
  }
  
  .post-content-display s {
    text-decoration: line-through;
  }
  
  .post-content-display a {
    color: #3b82f6;
    text-decoration: underline;
  }
  
  .post-content-display a:hover {
    color: #60a5fa;
  }
  
  .post-content-display h1,
  .post-content-display h2,
  .post-content-display h3 {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 700;
    margin: 0.75em 0 0.5em 0;
  }
  
  .post-content-display h1 {
    font-size: 1.5em;
  }
  
  .post-content-display h2 {
    font-size: 1.3em;
  }
  
  .post-content-display h3 {
    font-size: 1.1em;
  }
  
  .post-content-display ol,
  .post-content-display ul {
    margin: 0.5em 0;
    padding-left: 1.5em;
    color: rgba(255, 255, 255, 0.85);
  }
  
  .post-content-display ol li,
  .post-content-display ul li {
    margin: 0.25em 0;
  }

  @media (max-width: 768px) {
    .media-upload-row {
      flex-direction: column;
      align-items: stretch;
    }

    .media-upload-row > * {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    .media-upload-input {
      flex: 1 1 auto;
      width: 100%;
    }

    .media-upload-action,
    .media-upload-device {
      width: 100%;
      justify-content: center;
      white-space: normal;
    }

    .media-upload-device {
      padding-left: 1rem !important;
      padding-right: 1rem !important;
    }
  }

  /* Responsive styles for posts list and header */
  .admin-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
  }

  @media (max-width: 768px) {
    .admin-header {
      flex-direction: column !important;
      align-items: stretch !important;
    }
  }

  .post-item-container {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .post-actions-container {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .post-item-container {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    
    .post-actions-container {
      width: 100% !important;
      justify-content: flex-start !important;
      margin-top: 1rem !important;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1rem !important;
    }
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }
`;

// Client-side image compression utility
const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

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
    categories: ['latest-news'],
    postUrl: '',
    media: {
      images: [],
      videos: []
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [mediaTab, setMediaTab] = useState('images');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [tempVideoUrl, setTempVideoUrl] = useState('');

  // AI Studio state
  const [showAIStudio, setShowAIStudio] = useState(false);
  const [aiStep, setAiStep] = useState(1); // 1=input, 2=processing, 3=review
  const [aiClaim, setAiClaim] = useState('');
  const [aiImageUrl, setAiImageUrl] = useState('');
  const [aiClaimType, setAiClaimType] = useState('text');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');
  const [aiProcessingStage, setAiProcessingStage] = useState(0);
  const lastInteractionRef = useRef(0);

  // Auto-refresh posts every 15 seconds for live collaboration
  useEffect(() => {
    const interval = setInterval(() => {
      loadPosts(true); // Silent background refresh
    }, 15000); // Refresh every 15 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [pinningId, setPinningId] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const getAdminHeaders = () => ({
    'X-Device-ID': localStorage.getItem('device_id') || ''
  });

  const handleSyncSocials = async () => {
    setSyncing(true);
    try {
      const res = await axios.post('/api/sync-facebook', {}, {
        headers: getAdminHeaders()
      });
      alert(`Sync completed! Added ${res.data.syncedCount || 0} new posts.`);
      loadPosts(false);
    } catch (err) {
      console.error('Sync failed:', err);
      alert(err.response?.data?.error || 'Failed to sync Facebook & Instagram posts. Make sure environment variables are configured on Vercel.');
    } finally {
      setSyncing(false);
    }
  };

  // Check admin authentication
  useEffect(() => {
    const adminKey = localStorage.getItem('af_admin_key');
    if (!adminKey || adminKey !== 'factadmin') {
      navigate('/admin-login');
      return;
    }
    loadPosts(false); // Initial load (non-silent)
  }, [navigate]);

  const loadPosts = async (silent = false) => {
    // Prevent silent auto-refresh from clashing with recent user actions
    // Extended cooldown (20s) and guard against active pin operations
    if (silent && (pinningId !== null || (Date.now() - lastInteractionRef.current < 20000))) {
      return;
    }
    
    if (!silent) {
      setLoading(true);
    }
    try {
      const response = await axios.get('/api/posts', {
        headers: getAdminHeaders()
      });
      const posts = response.data || [];
      console.log('Raw posts from API:', posts.length, 'posts');
      if (posts.length > 0) {
        console.log('First post sample:', posts[0]);
        console.log('First post media:', posts[0].media, 'Type:', typeof posts[0].media);
      }
      
      // Parse media field if it comes as string from database
      const parsedPosts = posts.map(post => {
        if (post.media && typeof post.media === 'string') {
          try {
            post.media = JSON.parse(post.media);
          } catch (e) {
            console.error('Failed to parse media for post', post.id, e);
            post.media = { images: [], videos: [] };
          }
        }
        // Ensure media has correct structure
        if (!post.media || typeof post.media !== 'object') {
          post.media = { images: [], videos: [] };
        }
        // Backward compatibility - if no media but has image_url
        if (post.image_url && (!post.media.images || post.media.images.length === 0)) {
          post.media = {
            images: [post.image_url],
            videos: []
          };
        }
        return post;
      });
      
      console.log('Parsed posts:', parsedPosts.length);
      if (parsedPosts.length > 0) {
        console.log('First parsed post media:', parsedPosts[0].media);
      }
      setPosts(parsedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePinToggle = async (postId) => {
    lastInteractionRef.current = Date.now();
    setPinningId(postId);
    
    // Optimistic local update to eliminate UI lag
    setPosts(prevPosts => {
      const targetPost = prevPosts.find(p => p.id === postId);
      if (!targetPost) return prevPosts;
      
      const isCurrentlyPinned = targetPost.pinned_hero;
      
      return prevPosts.map(p => {
        if (p.id === postId) {
          return { ...p, pinned_hero: !isCurrentlyPinned };
        }
        return p;
      });
    });

    try {
      const response = await axios.patch(`/api/posts?id=${postId}&action=pin-hero`, {}, {
        headers: getAdminHeaders()
      });
      
      if (response.data && response.data.post) {
        setPosts(prevPosts => prevPosts.map(p => {
          if (p.id === response.data.post.id) {
            return { ...p, pinned_hero: response.data.post.pinned_hero };
          }
          return p;
        }));
        // Reset cooldown timer AFTER server confirms, to protect against auto-refresh
        lastInteractionRef.current = Date.now();
      }
    } catch (error) {
      console.error('Pin toggle failed:', error);
      alert('Failed to pin/unpin post');
      await loadPosts(); // Revert on error
    } finally {
      setPinningId(null);
    }
  };

  const handlePopularPinToggle = async (postId) => {
    lastInteractionRef.current = Date.now();
    setPinningId(postId);
    
    // Optimistic local update to eliminate UI lag
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        return { ...p, pinned_popular: p.pinned_popular ? 0 : 1 };
      }
      return p;
    }));

    try {
      const response = await axios.patch(`/api/posts?id=${postId}&action=pin-popular`, {}, {
        headers: getAdminHeaders()
      });
      
      if (response.data && response.data.post) {
        setPosts(prevPosts => prevPosts.map(p => {
          if (p.id === response.data.post.id) {
            return { ...p, pinned_popular: response.data.post.pinned_popular };
          }
          return p;
        }));
        // Reset cooldown timer AFTER server confirms, to protect against auto-refresh
        lastInteractionRef.current = Date.now();
      }
    } catch (error) {
      console.error('Popular pin toggle failed:', error);
      alert('Failed to pin/unpin popular post');
      await loadPosts(); // Revert on error
    } finally {
      setPinningId(null);
    }
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
        media: {
          images: imageUrl ? [imageUrl, ...prev.media.images] : prev.media.images,
          videos: prev.media.videos
        }
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
    
    lastInteractionRef.current = Date.now();
    setSubmitting(true);
    try {
      console.log('Submitting post data:', formData);
      const response = await axios.post('/api/posts', formData, {
        headers: getAdminHeaders()
      });
      console.log('Post created successfully:', response.data);
      setFormData({ title: '', content: '', author: 'Fact Check Master', fact_check_status: 'verified', categories: ['latest-news'], postUrl: '', media: { images: [], videos: [] } });
      setShowAddForm(false);
      setTempImageUrl('');
      setTempVideoUrl('');
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
    
    lastInteractionRef.current = Date.now();
    try {
      const response = await axios.delete(`/api/posts?id=${postId}`, {
        headers: getAdminHeaders()
      });
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
    console.log('Editing post:', post);
    console.log('Post media:', post.media);
    
    // Parse media if it's a string (from database)
    let media = { images: [], videos: [] };
    if (post.media) {
      if (typeof post.media === 'string') {
        try {
          media = JSON.parse(post.media);
        } catch (e) {
          console.error('Failed to parse media:', e);
          media = { images: [], videos: [] };
        }
      } else if (typeof post.media === 'object') {
        media = post.media;
      }
    }
    
    // Ensure media has the correct structure
    media = {
      images: Array.isArray(media.images) ? media.images : [],
      videos: Array.isArray(media.videos) ? media.videos : []
    };
    
    // Handle backward compatibility with old image_url field
    if (post.image_url && !media.images.includes(post.image_url)) {
      media.images = [post.image_url, ...media.images];
    }
    
    console.log('Final media object:', media);
    
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      fact_check_status: post.fact_check_status,
      categories: post.category ? [post.category] : ['latest-news'],
      postUrl: post.source_url || '',
      media: media
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    lastInteractionRef.current = Date.now();
    setSubmitting(true);
    try {
      console.log('Updating post:', editingPost.id);
      console.log('Form data being sent:', formData);
      console.log('Media object:', formData.media);
      const response = await axios.put(`/api/posts?id=${editingPost.id}`, formData, {
        headers: getAdminHeaders()
      });
      console.log('Post updated successfully:', response.data);
      setFormData({ title: '', content: '', author: 'Fact Check Master', fact_check_status: 'verified', categories: ['latest-news'], postUrl: '', media: { images: [], videos: [] } });
      setShowAddForm(false);
      setEditingPost(null);
      setTempImageUrl('');
      setTempVideoUrl('');
      await loadPosts();
      alert('Post updated successfully! ✅');
    } catch (error) {
      console.error('Failed to update post:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to update post: ${error.response?.data?.error || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ========== AI Studio Handlers ==========
  const aiProcessingStages = [
    { icon: '🔍', text: 'Analyzing claim...', color: '#3b82f6' },
    { icon: '🌐', text: 'Cross-referencing sources...', color: '#8b5cf6' },
    { icon: '📊', text: 'Evaluating evidence...', color: '#06b6d4' },
    { icon: '✍️', text: 'Drafting article...', color: '#10b981' },
    { icon: '🎯', text: 'Finalizing verdict...', color: '#f59e0b' }
  ];

  const handleAIGenerate = async () => {
    if (!aiClaim.trim() && !aiImageUrl.trim()) {
      setAiError('Please enter a claim or provide an image URL.');
      return;
    }

    setAiError('');
    setAiGenerating(true);
    setAiStep(2);
    setAiProcessingStage(0);

    // Animate through processing stages
    const stageInterval = setInterval(() => {
      setAiProcessingStage(prev => {
        if (prev < aiProcessingStages.length - 1) return prev + 1;
        return prev;
      });
    }, 2500);

    try {
      const response = await axios.post('/api/posts?action=ai-generate', {
        claim: aiClaim.trim(),
        imageUrl: aiImageUrl.trim() || undefined
      }, {
        headers: getAdminHeaders(),
        timeout: 35000
      });

      clearInterval(stageInterval);
      setAiResult(response.data);
      setAiStep(3);
    } catch (error) {
      clearInterval(stageInterval);
      console.error('AI generation failed:', error);
      const errorMsg = error.response?.data?.error || error.message || 'AI generation failed';
      setAiError(errorMsg);
      setAiStep(1);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleAIPublish = () => {
    if (!aiResult) return;

    // Transfer AI result to the existing post form
    setFormData({
      title: aiResult.title || '',
      content: aiResult.content || '',
      author: 'Fact Check Master',
      fact_check_status: aiResult.factCheckStatus || 'verified',
      categories: aiResult.categories || ['latest-news'],
      postUrl: '',
      media: { images: [], videos: [] }
    });

    // Close AI Studio and open the manual form for final review
    setShowAIStudio(false);
    setShowAddForm(true);
    setAiStep(1);
    setAiResult(null);
    setAiClaim('');
    setAiImageUrl('');
  };

  const handleAIDirectPublish = async () => {
    if (!aiResult) return;

    lastInteractionRef.current = Date.now();
    setSubmitting(true);
    try {
      const postData = {
        title: aiResult.title,
        content: aiResult.content,
        author: 'Fact Check Master',
        fact_check_status: aiResult.factCheckStatus || 'verified',
        categories: aiResult.categories || ['latest-news'],
        postUrl: '',
        media: { images: [], videos: [] }
      };

      await axios.post('/api/posts', postData, {
        headers: getAdminHeaders()
      });

      setShowAIStudio(false);
      setAiStep(1);
      setAiResult(null);
      setAiClaim('');
      setAiImageUrl('');
      await loadPosts();
      alert('AI-generated post published successfully! ✅');
    } catch (error) {
      console.error('Failed to publish AI post:', error);
      alert(`Failed to publish: ${error.response?.data?.error || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAIRegenerate = () => {
    setAiResult(null);
    setAiStep(1);
    setAiError('');
  };

  const handleCloseAIStudio = () => {
    setShowAIStudio(false);
    setAiStep(1);
    setAiResult(null);
    setAiClaim('');
    setAiImageUrl('');
    setAiError('');
    setAiGenerating(false);
  };

  const getVerdictColor = (verdict) => {
    const v = (verdict || '').toUpperCase();
    const colors = {
      'TRUE': '#10b981',
      'FALSE': '#ef4444',
      'MISLEADING': '#f59e0b',
      'PARTLY FALSE': '#f97316',
      'UNVERIFIED': '#6b7280',
      'SATIRE': '#8b5cf6',
      'MANIPULATED MEDIA': '#dc2626',
      'OUT OF CONTEXT': '#eab308'
    };
    return colors[v] || '#6b7280';
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return '#10b981';
    if (score >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '', author: 'Fact Check Master', fact_check_status: 'verified', categories: ['latest-news'], postUrl: '', media: { images: [], videos: [] } });
    setShowAddForm(false);
    setTempImageUrl('');
    setTempVideoUrl('');
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
    <section className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300" style={{ 
      minHeight: '100vh', 
      paddingTop: '5rem', 
      paddingBottom: '5rem', 
      paddingLeft: 'clamp(0.5rem, 2vw, 1rem)', 
      paddingRight: 'clamp(0.5rem, 2vw, 1rem)' 
    }}>
      <style>{quillStyles}</style>
      
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Mobile-First Header */}
        <div className="admin-header">
          {/* Back Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '200px', flexWrap: 'wrap' }}>
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
            <button
              onClick={() => navigate('/admin/articles')}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(99, 102, 241, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              📚 Articles
            </button>
            <button
              onClick={() => navigate('/admin/devices')}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(59, 130, 246, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              🔒 Devices
            </button>
            <button
              onClick={() => navigate('/admin/comments')}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(236, 72, 153, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              💬 Comments
            </button>
            <button
              onClick={() => navigate('/admin/notifications')}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(245, 158, 11, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              📢 Notifications
            </button>
          </div>
          
          {/* Title Section */}
          <div style={{ minWidth: '0' }}>
            <h1 className="text-slate-900 dark:text-white" style={{ 
              fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
              fontWeight: 900, 
              margin: '0 0 0.25rem 0',
              lineHeight: '1.2'
            }}>Admin Console</h1>
            <p className="text-slate-600 dark:text-slate-400" style={{ 
              fontSize: '0.875rem', 
              margin: '0',
              fontWeight: '500'
            }}>Countering Fake News Desk</p>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Sync Button */}
            <button
              onClick={handleSyncSocials}
              disabled={syncing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(to right, #059669, #10b981)',
                color: 'white',
                padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: syncing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                whiteSpace: 'nowrap',
                flexShrink: '0',
                opacity: syncing ? 0.7 : 1
              }}
            >
              {syncing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border border-white/30 border-t-white" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <FaRss />
                  <span>Sync Socials</span>
                </>
              )}
            </button>

            {/* AI Generate Button */}
            <button
              onClick={() => { setShowAIStudio(!showAIStudio); if (showAddForm) setShowAddForm(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: showAIStudio
                  ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                  : 'linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9)',
                color: 'white',
                padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                whiteSpace: 'nowrap',
                flexShrink: '0',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <FaRobot style={{ fontSize: '1.1rem' }} />
              {showAIStudio ? 'Close AI' : 'AI Generate'}
              {!showAIStudio && (
                <span style={{
                  position: 'absolute',
                  top: '-1px',
                  right: '-1px',
                  width: '10px',
                  height: '10px',
                  background: '#10b981',
                  borderRadius: '50%',
                  border: '2px solid rgba(30,41,59,0.95)',
                  animation: 'pulse 2s infinite'
                }} />
              )}
            </button>

            {/* Add Button */}
            <button
              onClick={() => { setShowAddForm(!showAddForm); if (showAIStudio) setShowAIStudio(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(to right, #1d4ed8, #2563eb)',
                color: 'white',
                padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 8px 25px rgba(29, 78, 216, 0.4)',
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                whiteSpace: 'nowrap',
                flexShrink: '0'
              }}
            >
              <FaPlus />
              {showAddForm ? 'Cancel' : 'Add Post'}
            </button>
          </div>
        </div>

        {/* ==================== AI STUDIO PANEL ==================== */}
        {showAIStudio && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
              borderRadius: '20px',
              padding: '0',
              marginBottom: '2rem',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Animated gradient border effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4, #10b981, #f59e0b, #8b5cf6)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite'
            }} />

            {/* Header */}
            <div style={{
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(139, 92, 246, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                }}>
                  <FaRobot style={{ color: 'white' }} />
                </div>
                <div>
                  <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>
                    AI Studio
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0, fontWeight: '500' }}>
                    Powered by Gemini AI
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Step indicators */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {[1, 2, 3].map(step => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <div style={{
                        width: step === aiStep ? '28px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: step <= aiStep
                          ? 'linear-gradient(90deg, #8b5cf6, #3b82f6)'
                          : 'rgba(255,255,255,0.15)',
                        transition: 'all 0.4s ease'
                      }} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleCloseAIStudio}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '2rem' }}>

              {/* ===== STEP 1: Claim Input ===== */}
              {aiStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Claim Type Chips */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                      { key: 'text', icon: <FaQuoteLeft />, label: 'Text Claim' },
                      { key: 'url', icon: <FaLink />, label: 'URL' },
                      { key: 'image', icon: <FaCloudUploadAlt />, label: 'Image URL' }
                    ].map(type => (
                      <button
                        key={type.key}
                        onClick={() => setAiClaimType(type.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: aiClaimType === type.key
                            ? '2px solid rgba(139, 92, 246, 0.6)'
                            : '2px solid rgba(255,255,255,0.1)',
                          background: aiClaimType === type.key
                            ? 'rgba(139, 92, 246, 0.15)'
                            : 'rgba(255,255,255,0.03)',
                          color: aiClaimType === type.key ? '#a78bfa' : 'rgba(255,255,255,0.6)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Main Input Area */}
                  <div style={{
                    position: 'relative',
                    marginBottom: '1rem'
                  }}>
                    <textarea
                      value={aiClaim}
                      onChange={(e) => setAiClaim(e.target.value)}
                      placeholder={aiClaimType === 'url'
                        ? 'Paste the URL of a claim to fact-check...'
                        : aiClaimType === 'image'
                        ? 'Describe the claim shown in the image...'
                        : 'Paste a claim, rumor, or viral text to fact-check...\n\nExample: "Pakistan Army suffered 50 casualties in recent military operation"'}
                      style={{
                        width: '100%',
                        minHeight: '140px',
                        padding: '1.25rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '2px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '14px',
                        color: 'white',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: '1.7',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.3s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)'}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.3)'
                    }}>
                      {aiClaim.length} chars
                    </div>
                  </div>

                  {/* Image URL Input (shown for image type) */}
                  {aiClaimType === 'image' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{ marginBottom: '1rem' }}
                    >
                      <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        <FaImage style={{ marginRight: '0.4rem' }} />
                        Image URL (screenshot or image to analyze)
                      </label>
                      <input
                        type="url"
                        value={aiImageUrl}
                        onChange={(e) => setAiImageUrl(e.target.value)}
                        placeholder="https://example.com/screenshot.jpg"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background: 'rgba(255,255,255,0.04)',
                          border: '2px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '0.9rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Error Message */}
                  {aiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '10px',
                        color: '#fca5a5',
                        fontSize: '0.85rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaExclamationTriangle />
                      {aiError}
                    </motion.div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleAIGenerate}
                    disabled={aiGenerating || (!aiClaim.trim() && !aiImageUrl.trim())}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: (!aiClaim.trim() && !aiImageUrl.trim())
                        ? 'rgba(107, 114, 128, 0.3)'
                        : 'linear-gradient(135deg, #8b5cf6, #6d28d9, #4c1d95)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      cursor: (!aiClaim.trim() && !aiImageUrl.trim()) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      transition: 'all 0.3s',
                      boxShadow: (!aiClaim.trim() && !aiImageUrl.trim())
                        ? 'none'
                        : '0 10px 30px rgba(139, 92, 246, 0.35)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    <FaBolt style={{ fontSize: '1.1rem' }} />
                    Generate Fact Check
                    <FaArrowRight style={{ fontSize: '0.85rem', marginLeft: '0.25rem' }} />
                  </button>

                  {/* Powered by note */}
                  <p style={{
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.25)',
                    fontSize: '0.7rem',
                    marginTop: '0.75rem',
                    fontWeight: '500'
                  }}>
                    AI-generated content should always be reviewed before publishing
                  </p>
                </motion.div>
              )}

              {/* ===== STEP 2: Processing Animation ===== */}
              {aiStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 1rem',
                    textAlign: 'center'
                  }}
                >
                  {/* Animated brain icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '24px',
                      background: `linear-gradient(135deg, ${aiProcessingStages[aiProcessingStage]?.color || '#8b5cf6'}33, ${aiProcessingStages[aiProcessingStage]?.color || '#8b5cf6'}11)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      marginBottom: '1.5rem',
                      border: `2px solid ${aiProcessingStages[aiProcessingStage]?.color || '#8b5cf6'}44`,
                      boxShadow: `0 0 40px ${aiProcessingStages[aiProcessingStage]?.color || '#8b5cf6'}22`,
                      transition: 'all 0.5s ease'
                    }}
                  >
                    {aiProcessingStages[aiProcessingStage]?.icon || '🤖'}
                  </motion.div>

                  {/* Stage text */}
                  <motion.p
                    key={aiProcessingStage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      color: 'white',
                      fontSize: '1.15rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {aiProcessingStages[aiProcessingStage]?.text || 'Processing...'}
                  </motion.p>

                  {/* Progress bar */}
                  <div style={{
                    width: '280px',
                    height: '4px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginTop: '1rem'
                  }}>
                    <motion.div
                      animate={{ width: `${((aiProcessingStage + 1) / aiProcessingStages.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, #8b5cf6, ${aiProcessingStages[aiProcessingStage]?.color || '#3b82f6'})`,
                        borderRadius: '2px'
                      }}
                    />
                  </div>

                  {/* Stage dots */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                    {aiProcessingStages.map((stage, i) => (
                      <div
                        key={i}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: i <= aiProcessingStage ? stage.color : 'rgba(255,255,255,0.15)',
                          transition: 'all 0.3s'
                        }}
                      />
                    ))}
                  </div>

                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '1.5rem' }}>
                    This usually takes 10-20 seconds
                  </p>
                </motion.div>
              )}

              {/* ===== STEP 3: Review & Publish ===== */}
              {aiStep === 3 && aiResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Top Stats Bar */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                  }}>
                    {/* Verdict Badge */}
                    <div style={{
                      padding: '0.5rem 1.25rem',
                      background: `${getVerdictColor(aiResult.verdict)}18`,
                      border: `2px solid ${getVerdictColor(aiResult.verdict)}44`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: getVerdictColor(aiResult.verdict),
                        boxShadow: `0 0 10px ${getVerdictColor(aiResult.verdict)}66`
                      }} />
                      <span style={{ color: getVerdictColor(aiResult.verdict), fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                        {aiResult.verdictLabel || aiResult.verdict}
                      </span>
                    </div>

                    {/* Confidence Score */}
                    <div style={{
                      padding: '0.5rem 1.25rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <FaChartBar style={{ color: getConfidenceColor(aiResult.confidence), fontSize: '0.85rem' }} />
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: '600' }}>
                        Confidence: 
                      </span>
                      <span style={{ color: getConfidenceColor(aiResult.confidence), fontWeight: '800' }}>
                        {Math.round(aiResult.confidence * 100)}%
                      </span>
                    </div>

                    {/* Read Time */}
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}>
                      ⏱ {aiResult.readTime}
                    </div>

                    {/* Categories */}
                    {aiResult.categories?.map((cat, i) => (
                      <div key={i} style={{
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        borderRadius: '12px',
                        color: '#60a5fa',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {cat.replace(/-/g, ' ')}
                      </div>
                    ))}
                  </div>

                  {/* Title Preview */}
                  <div style={{
                    marginBottom: '1.25rem',
                    padding: '1.25rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', marginTop: 0 }}>
                      Generated Title
                    </p>
                    <h3 style={{ color: 'white', fontSize: '1.15rem', fontWeight: '800', margin: 0, lineHeight: '1.4' }}>
                      {aiResult.title}
                    </h3>
                  </div>

                  {/* Summary */}
                  {aiResult.summary && (
                    <div style={{
                      marginBottom: '1.25rem',
                      padding: '1rem 1.25rem',
                      background: 'rgba(139, 92, 246, 0.06)',
                      borderRadius: '12px',
                      borderLeft: '4px solid rgba(139, 92, 246, 0.4)'
                    }}>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0, lineHeight: '1.6', fontStyle: 'italic' }}>
                        {aiResult.summary}
                      </p>
                    </div>
                  )}

                  {/* Article Content Preview */}
                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1.5rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    maxHeight: '350px',
                    overflowY: 'auto'
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', marginTop: 0 }}>
                      Article Preview
                    </p>
                    <div
                      className="post-content-display"
                      dangerouslySetInnerHTML={{ __html: aiResult.content }}
                      style={{ color: 'rgba(255,255,255,0.85)', lineHeight: '1.75', fontSize: '0.9rem' }}
                    />
                  </div>

                  {/* Sources */}
                  {aiResult.sources?.length > 0 && (
                    <div style={{
                      marginBottom: '1.5rem',
                      padding: '1rem 1.25rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', marginTop: 0 }}>
                        Sources ({aiResult.sources.length})
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {aiResult.sources.map((source, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaGlobe style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', flexShrink: 0 }} />
                            <span style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: '500' }}>
                              {source.name}
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>•</span>
                            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>
                              {source.type || 'reference'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SEO Preview */}
                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem 1.25rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', marginTop: 0 }}>
                      <FaSearch style={{ marginRight: '0.3rem', fontSize: '0.65rem' }} />
                      SEO Preview
                    </p>
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px'
                    }}>
                      <p style={{ color: '#8ab4f8', fontSize: '0.95rem', fontWeight: '500', margin: '0 0 0.25rem 0', lineHeight: '1.3' }}>
                        {aiResult.seoTitle || aiResult.title}
                      </p>
                      <p style={{ color: '#bdc1c6', fontSize: '0.78rem', margin: 0, lineHeight: '1.4' }}>
                        {aiResult.seoDescription || aiResult.summary}
                      </p>
                      <p style={{ color: '#4d9a5c', fontSize: '0.72rem', margin: '0.25rem 0 0 0' }}>
                        www.factcheckmaster.com › post › ...
                      </p>
                    </div>
                  </div>

                  {/* Keywords */}
                  {aiResult.keywords?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      {aiResult.keywords.map((kw, i) => (
                        <span key={i} style={{
                          padding: '0.25rem 0.6rem',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '6px',
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '0.72rem',
                          fontWeight: '500'
                        }}>
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Direct Publish */}
                    <button
                      onClick={handleAIDirectPublish}
                      disabled={submitting}
                      style={{
                        flex: '1',
                        minWidth: '140px',
                        padding: '0.85rem 1.5rem',
                        background: submitting ? 'rgba(107,114,128,0.4)' : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.95rem',
                        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <FaPaperPlane />
                      {submitting ? 'Publishing...' : 'Publish Now'}
                    </button>

                    {/* Edit More */}
                    <button
                      onClick={handleAIPublish}
                      style={{
                        flex: '1',
                        minWidth: '140px',
                        padding: '0.85rem 1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.95rem',
                        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <FaPen />
                      Edit More
                    </button>

                    {/* Regenerate */}
                    <button
                      onClick={handleAIRegenerate}
                      style={{
                        padding: '0.85rem 1.25rem',
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <FaRedo />
                      Redo
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

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
              border: '2px solid rgba(37, 99, 235, 0.3)'
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
                    { value: 'latest-news', label: 'Latest News', icon: '' },
                    { value: 'breaking-news', label: 'Featured / Breaking (hero)', icon: '' },
                    { value: 'trending-news', label: 'Trending', icon: '' },
                    { value: 'world-news', label: 'World News', icon: '' },
                    { value: 'viral-claims', label: 'Viral Claims', icon: '' },
                    { value: 'military-claims', label: 'Military Claims', icon: '' },
                    { value: 'political', label: 'Politics', icon: '' },
                    { value: 'technology', label: 'Technology', icon: '' },
                    { value: 'health', label: 'Health', icon: '' },
                    { value: 'sports', label: 'Sports', icon: '' },
                    { value: 'indian-claims', label: 'Indian Claims', icon: '' },
                    { value: 'afghan-claims', label: 'Afghan Claims', icon: '' }
                  ].map(category => (
                    <label 
                      key={category.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: formData.categories.includes(category.value) 
                          ? 'rgba(29, 78, 216, 0.3)' 
                          : 'rgba(71, 85, 105, 0.5)',
                        border: formData.categories.includes(category.value)
                          ? '2px solid #2563eb'
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
                          accentColor: '#2563eb'
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

              {/* Media Management Section */}
              <div style={{ 
                padding: '1.5rem', 
                background: 'rgba(51, 65, 85, 0.3)', 
                borderRadius: '12px', 
                border: '2px solid rgba(29, 78, 216, 0.3)' 
              }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontWeight: '700', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  📷 Media (Images & Videos)
                </label>
                
                {/* Media Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setMediaTab('images')}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: mediaTab === 'images' ? 'linear-gradient(to right, #1d4ed8, #2563eb)' : 'rgba(71, 85, 105, 0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s'
                    }}
                  >
                    <FaImage /> Images ({formData.media.images.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaTab('videos')}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: mediaTab === 'videos' ? 'linear-gradient(to right, #1d4ed8, #2563eb)' : 'rgba(71, 85, 105, 0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s'
                    }}
                  >
                    <FaVideo /> Videos ({formData.media.videos.length})
                  </button>
                </div>

                {/* Images Tab */}
                {mediaTab === 'images' && (
                  <div>
                    <div className="media-upload-row" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
                      <input
                        type="url"
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (tempImageUrl.trim()) {
                              setFormData(prev => ({
                                ...prev,
                                media: {
                                  ...prev.media,
                                  images: [...prev.media.images, tempImageUrl.trim()]
                                }
                              }));
                              setTempImageUrl('');
                            }
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: 'rgba(71, 85, 105, 0.5)',
                          border: '2px solid rgb(51, 65, 85)',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none'
                        }}
                        className="media-upload-input"
                        placeholder="Paste image URL and press Enter..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempImageUrl.trim()) {
                            setFormData(prev => ({
                              ...prev,
                              media: {
                                ...prev.media,
                                images: [...prev.media.images, tempImageUrl.trim()]
                              }
                            }));
                            setTempImageUrl('');
                          }
                        }}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(22, 163, 74))',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
                        }}
                        className="media-upload-action"
                      >
                        + Add URL
                      </button>
                      
                      <label style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(to right, rgb(234, 179, 8), rgb(202, 138, 4))',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            
                            try {
                              // Compress image before uploading
                              const compressedBase64 = await compressImage(file, 1200, 0.8);
                              
                              const payload = {
                                imageBase64: compressedBase64,
                                fileName: file.name.replace(/\.[^/.]+$/, "") + ".jpg", // Force .jpg extension
                                contentType: 'image/jpeg'
                              };
                              
                              const res = await axios.post('/api/upload', payload, {
                                headers: { 
                                  'Content-Type': 'application/json',
                                  ...getAdminHeaders()
                                }
                              });
                              
                              setFormData(prev => ({
                                ...prev,
                                media: {
                                  ...prev.media,
                                  images: [...prev.media.images, res.data.imageUrl]
                                }
                              }));
                            } catch (error) {
                              console.error('Upload failed', error);
                              alert('Failed to upload image. Please try again.');
                            } finally {
                              e.target.value = ''; // Reset input to allow selecting same file again
                            }
                          }}
                        />
                        <span className="media-upload-device">Upload from Device</span>
                      </label>
                    </div>

                    {/* Image List */}
                    {formData.media.images.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {formData.media.images.map((url, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            background: 'rgba(71, 85, 105, 0.3)',
                            borderRadius: '8px',
                            alignItems: 'center'
                          }}>
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: '80px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                flexShrink: 0
                              }}
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"%3E%3Crect fill="%23374151" width="80" height="60"/%3E%3Ctext x="50%25" y="50%25" fill="%23fff" font-size="12" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                              }}
                            />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ 
                                color: 'rgba(255,255,255,0.8)', 
                                fontSize: '0.875rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {url}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  media: {
                                    ...prev.media,
                                    images: prev.media.images.filter((_, i) => i !== index)
                                  }
                                }));
                              }}
                              style={{
                                padding: '0.5rem',
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: 'rgb(252, 165, 165)',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ 
                        padding: '2rem', 
                        textAlign: 'center', 
                        color: 'rgba(255,255,255,0.5)',
                        border: '2px dashed rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}>
                        No images added yet. Paste URLs above to add images.
                      </div>
                    )}
                  </div>
                )}

                {/* Videos Tab */}
                {mediaTab === 'videos' && (
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <input
                        type="url"
                        value={tempVideoUrl}
                        onChange={(e) => setTempVideoUrl(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (tempVideoUrl.trim()) {
                              const video = parseVideoUrl(tempVideoUrl.trim());
                              if (video) {
                                setFormData(prev => ({
                                  ...prev,
                                  media: {
                                    ...prev.media,
                                    videos: [...prev.media.videos, video]
                                  }
                                }));
                                setTempVideoUrl('');
                              } else {
                                alert('Invalid video URL. Please enter a valid YouTube, Vimeo, Twitter, or direct video link.');
                              }
                            }
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: 'rgba(71, 85, 105, 0.5)',
                          border: '2px solid rgb(51, 65, 85)',
                          borderRadius: '8px',
                          color: 'white',
                          outline: 'none'
                        }}
                        placeholder="Paste video URL (YouTube, Vimeo, Twitter, etc.)..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (tempVideoUrl.trim()) {
                            const video = parseVideoUrl(tempVideoUrl.trim());
                            if (video) {
                              setFormData(prev => ({
                                ...prev,
                                media: {
                                  ...prev.media,
                                  videos: [...prev.media.videos, video]
                                }
                              }));
                              setTempVideoUrl('');
                            } else {
                              alert('Invalid video URL. Please enter a valid YouTube, Vimeo, Twitter, or direct video link.');
                            }
                          }
                        }}
                        style={{
                          padding: '0.75rem 1.5rem',
                          background: 'linear-gradient(to right, rgb(239, 68, 68), rgb(220, 38, 38))',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        + Add Video
                      </button>
                    </div>

                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '1rem',
                      padding: '0.75rem',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '6px'
                    }}>
                      <strong>Supported:</strong> YouTube, Vimeo, Twitter/X, TikTok, Facebook, Direct video files (.mp4, .webm, etc.)
                    </div>

                    {/* Video List */}
                    {formData.media.videos.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {formData.media.videos.map((video, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            background: 'rgba(71, 85, 105, 0.3)',
                            borderRadius: '8px',
                            alignItems: 'center'
                          }}>
                            <div style={{
                              width: '80px',
                              height: '60px',
                              background: 'rgba(0, 0, 0, 0.5)',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '2rem',
                              flexShrink: 0
                            }}>
                              {getVideoPlatformIcon(video.platform)}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ 
                                color: 'rgba(255,255,255,0.9)', 
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                marginBottom: '0.25rem'
                              }}>
                                {getVideoPlatformName(video.platform)}
                              </div>
                              <div style={{ 
                                color: 'rgba(255,255,255,0.6)', 
                                fontSize: '0.75rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {video.url}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  media: {
                                    ...prev.media,
                                    videos: prev.media.videos.filter((_, i) => i !== index)
                                  }
                                }));
                              }}
                              style={{
                                padding: '0.5rem',
                                background: 'rgba(239, 68, 68, 0.2)',
                                color: 'rgb(252, 165, 165)',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ 
                        padding: '2rem', 
                        textAlign: 'center', 
                        color: 'rgba(255,255,255,0.5)',
                        border: '2px dashed rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}>
                        No videos added yet. Paste video URLs above to add videos.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  color: 'rgba(255,255,255,0.9)', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem',
                  fontSize: '15px'
                }}>
                  Content *
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'header': [1, 2, 3, false] }],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      ['link'],
                      ['clean']
                    ],
                    clipboard: {
                      matchVisual: false
                    }
                  }}
                  formats={[
                    'bold', 'italic', 'underline', 'strike',
                    'header',
                    'list', 'bullet',
                    'link'
                  ]}
                  placeholder="Write your post content here... Use the toolbar to format text with bold, italic, underline, headers, lists, and links."
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
                    background: submitting ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(to right, #1d4ed8, #2563eb)',
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
        <div style={{ background: 'rgba(30, 41, 59, 0.95)', borderRadius: '16px', border: '2px solid rgba(37, 99, 235, 0.3)' }}>
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
                  className="post-item-container"
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <h3 style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>{post.title}</h3>
                      {post.pinned_hero ? (
                        <span style={{
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '800',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#000',
                          background: 'linear-gradient(135deg, #F59E0B, #EAB308)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          HERO PINNED
                        </span>
                      ) : null}
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
                    
                    {/* Media Display */}
                    {(() => {
                      const hasMedia = (post.media?.images?.length > 0 || post.media?.videos?.length > 0) || post.image_url;
                      console.log(`Post ${post.id} - hasMedia:`, hasMedia, 'media:', post.media, 'image_url:', post.image_url);
                      return hasMedia ? (
                        <div style={{ marginBottom: '1rem' }}>
                          <MediaCarousel media={post.media || { images: post.image_url ? [post.image_url] : [], videos: [] }} />
                        </div>
                      ) : null;
                    })()}
                    
                    <div 
                      className="post-content-display"
                      style={{ 
                        color: 'rgba(255,255,255,0.85)', 
                        lineHeight: '1.7', 
                        margin: '0 0 0.75rem 0',
                        fontSize: '15px'
                      }}
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', alignItems: 'center' }}>
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FaEye /> {post.views || 0} views
                      </span>
                    </div>
                  </div>
                  
                  <div className="post-actions-container">
                    <button
                      onClick={() => handlePinToggle(post.id)}
                      disabled={pinningId === post.id}
                      style={{
                        padding: '0.5rem',
                        background: post.pinned_hero ? 'rgba(245, 158, 11, 0.3)' : 'rgba(100, 116, 139, 0.2)',
                        color: post.pinned_hero ? 'rgb(251, 191, 36)' : 'rgb(148, 163, 184)',
                        border: post.pinned_hero ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid transparent',
                        borderRadius: '8px',
                        cursor: pinningId === post.id ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        opacity: pinningId === post.id ? 0.6 : 1
                      }}
                      title={post.pinned_hero ? 'Unpin from Hero (currently the lead story)' : 'Pin to Hero (make lead story)'}
                    >
                      <FaStar />
                    </button>
                    <button
                      onClick={() => handlePopularPinToggle(post.id)}
                      disabled={pinningId === post.id}
                      style={{
                        padding: '0.5rem',
                        background: post.pinned_popular ? 'rgba(239, 68, 68, 0.3)' : 'rgba(100, 116, 139, 0.2)',
                        color: post.pinned_popular ? 'rgb(248, 113, 113)' : 'rgb(148, 163, 184)',
                        border: post.pinned_popular ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid transparent',
                        borderRadius: '8px',
                        cursor: pinningId === post.id ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s',
                        opacity: pinningId === post.id ? 0.6 : 1
                      }}
                      title={post.pinned_popular ? 'Remove from Most Popular section' : 'Pin to Most Popular section'}
                    >
                      <FaFire />
                    </button>
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