import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaClock, FaTrash } from 'react-icons/fa';

export default function DeviceManagement() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const adminKey = localStorage.getItem('af_admin_key');
    if (!adminKey || adminKey !== 'factadmin') {
      navigate('/admin-login');
      return;
    }

    setDeviceId(localStorage.getItem('device_id') || '');
    loadDevices();
  }, [navigate]);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const currentDeviceId = localStorage.getItem('device_id');
      const response = await axios.get('/api/device-auth', {
        headers: { 'X-Device-ID': currentDeviceId }
      });
      setDevices(response.data || []);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveDevice = async (deviceIdToApprove) => {
    try {
      const currentDeviceId = localStorage.getItem('device_id');
      await axios.post('/api/approve-device', 
        { deviceIdToApprove },
        { headers: { 'X-Device-ID': currentDeviceId } }
      );
      alert('Device approved successfully! ✅');
      loadDevices();
    } catch (error) {
      alert(`Failed: ${error.response?.data?.error || error.message}`);
    }
  };

  const revokeDevice = async (deviceIdToRevoke) => {
    if (!window.confirm('Revoke this device?')) return;

    try {
      const currentDeviceId = localStorage.getItem('device_id');
      await axios.delete(`/api/device-auth?deviceId=${deviceIdToRevoke}`, {
        headers: { 'X-Device-ID': currentDeviceId }
      });
      alert('Device revoked! ✅');
      loadDevices();
    } catch (error) {
      alert(`Failed: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(2, 6, 23), rgb(0, 0, 0))',
      paddingTop: '5rem',
      paddingBottom: '5rem',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>
              Device Management
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              Authorize devices for admin access
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/posts')}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(71, 85, 105, 0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Back to Posts
          </button>
        </div>

        {deviceId && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
              🔒 Your Current Device
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', fontFamily: 'monospace' }}>
              {deviceId}
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.7)' }}>
            Loading devices...
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {devices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.5)' }}>
                No devices found
              </div>
            ) : (
              devices.map(device => (
                <div
                  key={device.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.95)',
                    border: `2px solid ${device.approved ? 'rgba(34, 197, 94, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      {device.approved ? (
                        <FaCheckCircle style={{ color: '#22c55e', fontSize: '1.25rem' }} />
                      ) : (
                        <FaClock style={{ color: '#eab308', fontSize: '1.25rem' }} />
                      )}
                      <span style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
                        {device.device_name}
                      </span>
                      {device.device_id === deviceId && (
                        <span style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#60a5fa',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>
                      {device.device_id}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
                      {device.approved ? (
                        <>Approved: {new Date(device.approved_at).toLocaleString()}</>
                      ) : (
                        <>Requested: {new Date(device.requested_at).toLocaleString()}</>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!device.approved && (
                      <button
                        onClick={() => approveDevice(device.device_id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(22, 163, 74))',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.875rem'
                        }}
                      >
                        ✓ Approve
                      </button>
                    )}
                    <button
                      onClick={() => revokeDevice(device.device_id)}
                      disabled={device.device_id === deviceId}
                      style={{
                        padding: '0.5rem 1rem',
                        background: device.device_id === deviceId ? 'rgba(107, 114, 128, 0.5)' : 'rgba(239, 68, 68, 0.8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: device.device_id === deviceId ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FaTrash /> Revoke
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div style={{
          marginTop: '2rem',
          background: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid rgba(37, 99, 235, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>
            💡 How It Works
          </h3>
          <ul style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: '1.6', paddingLeft: '1.5rem' }}>
            <li>Each device has a unique fingerprint</li>
            <li>New devices must be approved before accessing admin</li>
            <li>Try to login from new device → Approve it here</li>
            <li>Works across different networks and IPs</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
