import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getDeviceId, getDeviceName } from '../utils/deviceFingerprint';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    async function loadDeviceInfo() {
      const deviceId = await getDeviceId();
      const deviceName = getDeviceName();
      setDeviceInfo({ deviceId, deviceName });
      console.log('Your Device ID:', deviceId);
      console.log('Device Name:', deviceName);
    }
    loadDeviceInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check password
      if (username !== 'factadmin' || password !== 'factadmin') {
        setError('Invalid credentials');
        setLoading(false);
        return;
      }

      // Check device authorization
      const response = await axios.post('/api/device-auth', {
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        password: password
      });

      if (response.data.approved) {
        // Device approved - allow login
        localStorage.setItem('af_logged_in', '1');
        localStorage.setItem('af_admin_key', password);
        localStorage.setItem('device_id', deviceInfo.deviceId);
        navigate('/admin/feedback', { replace: true });
      } else {
        // Device needs approval
        setError(
          `⚠️ Device Not Authorized\n\n` +
          `Device: ${deviceInfo.deviceName}\n` +
          `ID: ${deviceInfo.deviceId.substring(0, 20)}...\n\n` +
          `This device needs approval.\n` +
          `Login from an approved device and approve this one in Device Management.`
        );
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(2, 6, 23), rgb(0, 0, 0))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <form onSubmit={handleSubmit} style={{ width: 420, background: '#0f172a', border: '1px solid rgba(168,85,247,0.35)', borderRadius: 16, boxShadow: '0 22px 44px rgba(0,0,0,0.5)', padding: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: 'white' }}>Admin Login</h1>
        
        {deviceInfo && (
          <div style={{ marginBottom: 16, padding: 12, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Device:</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>{deviceInfo.deviceName}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontFamily: 'monospace' }}>ID: {deviceInfo.deviceId.substring(0, 20)}...</div>
          </div>
        )}
        
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: '#111827', color: 'white' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: '#111827', color: 'white' }} />
        </div>
        {error && (
          <div style={{ color: '#fecaca', marginBottom: 12, fontSize: 12, whiteSpace: 'pre-line', padding: 12, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </div>
        )}
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '10px 12px', 
            borderRadius: 10, 
            border: 'none', 
            fontWeight: 800, 
            background: loading ? '#6b7280' : 'linear-gradient(90deg, #6d28d9, #8b5cf6)', 
            color: 'white', 
            boxShadow: '0 10px 20px rgba(139,92,246,0.35)',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Checking...' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
