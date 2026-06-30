import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FaPlus, FaTrash, FaEye, FaPen, FaImage, FaBookOpen,
  FaTimes, FaCheck, FaFileAlt, FaExternalLinkAlt, FaSearch, FaUpload
} from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Quill editor styles (reuse from AdminPosts)
const quillStyles = `
  .article-editor .ql-container {
    background: rgba(30, 41, 59, 0.8);
    border: 2px solid rgba(29, 78, 216, 0.3) !important;
    border-top: none !important;
    border-radius: 0 0 12px 12px;
    font-size: 16px;
    min-height: 400px;
  }
  .article-editor .ql-toolbar {
    background: rgba(51, 65, 85, 0.8);
    border: 2px solid rgba(29, 78, 216, 0.3) !important;
    border-bottom: 1px solid rgba(29, 78, 216, 0.2) !important;
    border-radius: 12px 12px 0 0;
    padding: 12px;
  }
  .article-editor .ql-toolbar .ql-stroke { stroke: rgba(255, 255, 255, 0.9); }
  .article-editor .ql-toolbar .ql-fill { fill: rgba(255, 255, 255, 0.9); }
  .article-editor .ql-toolbar .ql-picker-label { color: rgba(255, 255, 255, 0.9); }
  .article-editor .ql-toolbar button:hover,
  .article-editor .ql-toolbar button.ql-active {
    background: rgba(29, 78, 216, 0.2);
    border-radius: 6px;
  }
  .article-editor .ql-toolbar button:hover .ql-stroke,
  .article-editor .ql-toolbar button.ql-active .ql-stroke { stroke: #3b82f6; }
  .article-editor .ql-editor {
    min-height: 400px;
    color: rgba(255, 255, 255, 0.95) !important;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.8;
    padding: 20px;
  }
  .article-editor .ql-editor * {
    color: rgba(255, 255, 255, 0.95) !important;
    background-color: transparent !important;
  }
  .article-editor .ql-editor.ql-blank::before {
    color: rgba(255, 255, 255, 0.4) !important;
    font-style: normal;
    left: 20px;
  }
  .article-editor .ql-toolbar .ql-picker-options {
    background: #1e293b;
    border: 1px solid rgba(29, 78, 216, 0.3);
    border-radius: 8px;
  }
  .article-editor .ql-toolbar .ql-picker-item { color: white; }
  .article-editor .ql-toolbar .ql-picker-item:hover { color: #3b82f6; background: rgba(29, 78, 216, 0.15); }
`;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'link', 'image',
];

function slugify(str) {
  return str.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const AdminArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState('Fact Check Master');
  const [status, setStatus] = useState('draft');

  const editorRef = useRef(null);

  const getDeviceId = () => {
    try { return localStorage.getItem('device_id') || ''; } catch { return ''; }
  };

  const showNotif = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ─── Fetch ─────────────────────────────────────────────────
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/articles?all=true', {
        headers: { 'X-Device-ID': getDeviceId() },
      });
      setArticles(res.data || []);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      showNotif('Failed to load articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  // ─── Editor Reset ──────────────────────────────────────────
  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setAuthor('Fact Check Master');
    setStatus('draft');
    setEditingArticle(null);
  };

  const openNew = () => {
    resetForm();
    setShowEditor(true);
  };

  const openEdit = (article) => {
    setEditingArticle(article);
    setTitle(article.title || '');
    setExcerpt(article.excerpt || '');
    setContent(article.content || '');
    setCoverImage(article.cover_image || '');
    setAuthor(article.author || 'Fact Check Master');
    setStatus(article.status || 'draft');
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    resetForm();
  };

  // ─── Save ──────────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      showNotif('Title and content are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const body = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        cover_image: coverImage.trim() || null,
        author: author.trim() || 'Fact Check Master',
        status,
      };

      const headers = {
        'Content-Type': 'application/json',
        'X-Device-ID': getDeviceId(),
      };

      if (editingArticle) {
        await axios.put(`/api/articles?id=${editingArticle.id}`, body, { headers });
        showNotif('Article updated successfully');
      } else {
        await axios.post('/api/articles', body, { headers });
        showNotif('Article created successfully');
      }

      closeEditor();
      fetchArticles();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save article';
      showNotif(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/articles?id=${id}`, {
        headers: { 'X-Device-ID': getDeviceId() },
      });
      showNotif('Article deleted');
      setDeleteConfirm(null);
      fetchArticles();
    } catch (err) {
      showNotif('Failed to delete article', 'error');
    }
  };

  // ─── Filter ────────────────────────────────────────────────
  const filtered = articles.filter((a) =>
    a.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const wordCount = (html) => {
    if (!html) return 0;
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
  };

  return (
    <>
      <style>{quillStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 text-white">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl border backdrop-blur-sm transition-all duration-300 ${
            notification.type === 'error'
              ? 'bg-red-900/80 border-red-700 text-red-200'
              : 'bg-emerald-900/80 border-emerald-700 text-emerald-200'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <FaBookOpen className="text-xl text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Manage Articles</h1>
                <p className="text-sm text-slate-400">{articles.length} article{articles.length !== 1 ? 's' : ''} total</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/posts')}
                className="px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                ← Back to Posts
              </button>
              <button
                onClick={openNew}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <FaPlus /> New Article
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-6 max-w-md">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Articles List */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-700 border-t-blue-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FaBookOpen className="text-4xl text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-medium">No articles yet</p>
              <p className="text-slate-500 text-sm mt-1">Create your first article to get started</p>
              <button
                onClick={openNew}
                className="mt-6 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <FaPlus /> Create Article
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors group"
                >
                  {/* Cover thumbnail */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                    {article.cover_image ? (
                      <img src={article.cover_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaFileAlt className="text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{article.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                        article.status === 'published'
                          ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50'
                          : 'bg-amber-900/30 text-amber-400 border border-amber-800/50'
                      }`}>
                        {article.status === 'published' ? <FaCheck className="text-[8px]" /> : <FaFileAlt className="text-[8px]" />}
                        {article.status}
                      </span>
                      <span>{wordCount(article.content)} words</span>
                      <span>{article.read_time || 5} min read</span>
                      <span className="flex items-center gap-1"><FaEye className="text-[10px]" /> {article.views || 0}</span>
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    {article.status === 'published' && (
                      <button
                        onClick={() => window.open(`/articles/${article.slug}`, '_blank')}
                        className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                        title="View article"
                      >
                        <FaExternalLinkAlt className="text-sm text-slate-400" />
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(article)}
                      className="p-2 rounded-lg hover:bg-blue-900/30 transition-colors"
                      title="Edit article"
                    >
                      <FaPen className="text-sm text-blue-400" />
                    </button>
                    {deleteConfirm === article.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(article.id)}
                        className="p-2 rounded-lg hover:bg-red-900/30 transition-colors"
                        title="Delete article"
                      >
                        <FaTrash className="text-sm text-red-400" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Editor Modal ───────────────────────────────────── */}
        {showEditor && (
          <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/70 backdrop-blur-sm">
            <div className="min-h-screen flex items-start justify-center py-8 px-4">
              <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaBookOpen className="text-blue-400" />
                    {editingArticle ? 'Edit Article' : 'New Article'}
                  </h2>
                  <button
                    onClick={closeEditor}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <FaTimes className="text-slate-400" />
                  </button>
                </div>

                {/* Editor Body */}
                <div className="px-6 py-6 space-y-5 max-h-[80vh] overflow-y-auto">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="How to Identify Fake News"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 text-base transition-colors"
                    />
                    {title && (
                      <p className="text-xs text-slate-500 mt-1.5">
                        Slug: <span className="text-blue-400">/articles/{slugify(title)}</span>
                      </p>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Excerpt (Short Summary)</label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="A brief summary shown on the homepage cards..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 text-sm transition-colors resize-none"
                    />
                  </div>

                  {/* Cover Image URL + Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <FaImage className="inline mr-1.5 text-blue-400" /> Cover Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="Paste image URL or upload from device →"
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
                      />
                      <label className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all border-2 ${
                        uploading
                          ? 'bg-blue-900/40 border-blue-700/50 text-blue-300 cursor-wait'
                          : 'bg-blue-600/20 border-blue-600/40 text-blue-400 hover:bg-blue-600/30 hover:border-blue-500'
                      }`}>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setUploading(true);
                            try {
                              const compressedBase64 = await compressImage(file, 1200, 0.8);
                              const res = await axios.post('/api/upload', {
                                imageBase64: compressedBase64,
                                fileName: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
                                contentType: 'image/jpeg'
                              }, {
                                headers: {
                                  'Content-Type': 'application/json',
                                  'X-Device-ID': getDeviceId()
                                }
                              });
                              setCoverImage(res.data.imageUrl);
                              showNotif('Image uploaded successfully');
                            } catch (err) {
                              console.error('Upload failed:', err);
                              showNotif('Failed to upload image', 'error');
                            } finally {
                              setUploading(false);
                              e.target.value = '';
                            }
                          }}
                        />
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border border-blue-400/30 border-t-blue-400" />
                            Uploading…
                          </>
                        ) : (
                          <>
                            <FaUpload className="text-xs" />
                            Upload
                          </>
                        )}
                      </label>
                    </div>
                    {coverImage && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-700 max-h-48 relative group">
                        <img src={coverImage} alt="Preview" className="w-full h-48 object-cover" onError={(e) => e.target.style.display='none'} />
                        <button
                          type="button"
                          onClick={() => setCoverImage('')}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white/80 hover:text-red-400 hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-all"
                          title="Remove image"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Author + Status Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Author</label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-slate-700 text-white focus:outline-none focus:border-blue-500 text-sm transition-colors"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Content *</label>
                    <div className="article-editor">
                      <ReactQuill
                        ref={editorRef}
                        value={content}
                        onChange={setContent}
                        modules={quillModules}
                        formats={quillFormats}
                        theme="snow"
                        placeholder="Write your article content here..."
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {wordCount(content)} words · ~{Math.max(1, Math.round(wordCount(content) / 200))} min read
                    </p>
                  </div>
                </div>

                {/* Editor Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/80">
                  <button
                    onClick={closeEditor}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaCheck /> {editingArticle ? 'Update Article' : 'Create Article'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminArticles;
