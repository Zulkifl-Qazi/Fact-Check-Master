import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Lightweight request coalescing for fetch GET /api/posts
const originalFetch = window.fetch;
const fetchCache = new Map();

window.fetch = function (input, init) {
  const url = typeof input === 'string' ? input : input?.url;
  const method = init?.method || 'GET';

  if (url && url.includes('/api/posts') && method === 'GET') {
    const cacheKey = url;
    const now = Date.now();
    const cached = fetchCache.get(cacheKey);

    // Cache for 3 seconds to coalesce parallel mount-time requests
    if (cached && (now - cached.timestamp < 3000)) {
      return cached.promise.then(res => res.clone());
    }

    const promise = originalFetch.apply(this, arguments).then(res => {
      if (!res.ok) {
        fetchCache.delete(cacheKey);
      }
      return res;
    }).catch(err => {
      fetchCache.delete(cacheKey);
      throw err;
    });

    fetchCache.set(cacheKey, {
      promise,
      timestamp: now
    });

    return promise.then(res => res.clone());
  }

  // Clear cache on writes
  if (method !== 'GET') {
    fetchCache.clear();
  }

  return originalFetch.apply(this, arguments);
};

// Force dark mode by default
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'dark')
  document.documentElement.classList.add('dark')
}

// Set dark mode on startup
const theme = localStorage.getItem('theme')
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)