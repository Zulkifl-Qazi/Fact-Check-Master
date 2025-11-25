import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'factadmin' && password === 'factadmin') {
      try {
        localStorage.setItem('af_logged_in', '1');
        // Also prime the admin key used for API writes
        localStorage.setItem('af_admin_key', 'factadmin');
      } catch {}
      navigate('/admin/feedback', { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <section style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(2, 6, 23), rgb(0, 0, 0))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <form onSubmit={handleSubmit} style={{ width: 360, background: '#0f172a', border: '1px solid rgba(168,85,247,0.35)', borderRadius: 16, boxShadow: '0 22px 44px rgba(0,0,0,0.5)', padding: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Admin Login</h1>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: '#111827', color: 'white' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: '#111827', color: 'white' }} />
        </div>
        {error && <div style={{ color: '#fecaca', marginBottom: 8, fontSize: 13 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', fontWeight: 800, background: 'linear-gradient(90deg, #6d28d9, #8b5cf6)', color: 'white', boxShadow: '0 10px 20px rgba(139,92,246,0.35)' }}>Sign in</button>
      </form>
    </section>
  );
}
