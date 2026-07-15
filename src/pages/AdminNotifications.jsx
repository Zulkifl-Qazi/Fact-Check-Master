import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPaperPlane, FaUserShield, FaBell, FaUsers, FaArrowLeft, FaGoogle, FaEnvelope, FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [targetGroup, setTargetGroup] = useState('all'); // 'all', 'google'

  // Results display
  const [sentReport, setSentReport] = useState(null);

  const getAdminHeaders = () => ({
    'X-Device-ID': localStorage.getItem('device_id') || ''
  });

  const loadSubscribers = async () => {
    setLoading(true);
    setError('');
    try {
      // In this system, we use Supabase database.
      // We check subscription count by querying the subscribers list.
      // Since there's no separate GET API yet, we can query Supabase or create a route.
      // Wait, let's look at the database subscribers. Can we query them via the API?
      // Let's check `/api/subscribe` -- wait, we wrote GET `/api/subscribe?email=...` but not full list.
      // Let's implement full list retrieval in GET `/api/subscribe` if no email is supplied!
      // This is a brilliant and clean design that keeps endpoints concise.
      const response = await axios.get('/api/subscribe', {
        headers: getAdminHeaders()
      });
      setSubscribers(response.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to load subscriber list. Ensure subscribers table is created in Supabase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const adminKey = localStorage.getItem('af_admin_key');
    if (!adminKey || adminKey !== 'factadmin') {
      navigate('/admin-login');
      return;
    }
    loadSubscribers();
  }, [navigate]);

  const handleDeleteSubscriber = async (email) => {
    if (!window.confirm(`Are you sure you want to remove subscription for ${email}?`)) return;

    try {
      await axios.post('/api/subscribe', {
        email,
        action: 'unsubscribe'
      });
      setSubscribers(prev => prev.filter(sub => sub.email !== email));
      alert('Subscriber removed successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to remove subscriber.');
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      alert('Please fill out both Subject and Content.');
      return;
    }

    setSubmitting(true);
    setSentReport(null);
    try {
      const res = await axios.post('/api/send-notifications', {
        subject: subject.trim(),
        body: body.trim(),
        targetGroup
      }, {
        headers: getAdminHeaders()
      });

      setSentReport(res.data);
      setSubject('');
      setBody('');
      alert('Notification broadcast request completed successfully! ✅');
      loadSubscribers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to send notifications.');
    } finally {
      setSubmitting(false);
    }
  };

  const gmailCount = subscribers.filter(s => s.provider === 'google' || s.email.endsWith('@gmail.com')).length;

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pt-20 pb-16 px-4 md:px-8 text-slate-900 dark:text-slate-100">
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        
        {/* Navigation Admin Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/posts')}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              ← Back to Posts
            </button>
            <button
              onClick={() => navigate('/admin/feedback')}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              ✉️ Feedback
            </button>
            <button
              onClick={() => navigate('/admin/comments')}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              💬 Comments
            </button>
            <button
              onClick={() => navigate('/admin/devices')}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              🔒 Devices
            </button>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              📢 Subscription Manager
            </h1>
          </div>
        </div>

        {/* Dashboard Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</p>
              <h3 className="text-2xl font-black mt-1">{subscribers.length}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <FaGoogle className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gmail Subscribers</p>
              <h3 className="text-2xl font-black mt-1">{gmailCount}</h3>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <FaEnvelope className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">SMTP Configuration</p>
              <h3 className="text-sm font-semibold mt-2 text-emerald-500">Active (Live/Simulate)</h3>
            </div>
          </div>
        </div>

        {/* Main Composition Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Email Composition Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2">
              <FaPaperPlane className="text-blue-500" />
              <span>Compose Alert Broadcast</span>
            </h2>

            <form onSubmit={handleSendNotification} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTargetGroup('all')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      targetGroup === 'all'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <FaUsers />
                    All Subscribers ({subscribers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetGroup('google')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      targetGroup === 'google'
                        ? 'border-red-500 bg-red-500/10 text-red-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <FaGoogle />
                    Gmail Users Only ({gmailCount})
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="email-subject" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email Subject
                </label>
                <input
                  id="email-subject"
                  type="text"
                  placeholder="e.g., Fact-Check Alert: Verifying viral claims about..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none transition text-sm"
                />
              </div>

              <div>
                <label htmlFor="email-content" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Alert Message Content
                </label>
                <textarea
                  id="email-content"
                  rows="8"
                  placeholder="Write the notification email body here. Double-space for paragraphs. HTML tags are supported..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none transition text-sm leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-xl border-none cursor-pointer transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <FaPaperPlane className={submitting ? 'animate-pulse' : ''} />
                {submitting ? 'Sending Broadcast...' : 'Dispatch Alert Notification'}
              </button>
            </form>

            {/* Notification Sent Report */}
            {sentReport && (
              <div className="mt-8 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-4">
                <h3 className="text-sm font-black text-emerald-500 flex items-center gap-2">
                  <FaCheckCircle />
                  <span>Broadcast Summary</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {sentReport.message}
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Recipients Found:</span>
                    <span className="text-sm font-black">{sentReport.subscribersCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Sent Success:</span>
                    <span className="text-sm font-black text-emerald-500">{sentReport.sentCount}</span>
                  </div>
                </div>

                {sentReport.simulated && sentReport.simulatedRecipients && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Simulated Receivers (Local sandbox mode):</h4>
                    <div className="max-h-32 overflow-y-auto border border-slate-200 dark:border-slate-800/60 rounded-xl bg-white dark:bg-slate-900 p-2 space-y-1 scrollbar-none">
                      {sentReport.simulatedRecipients.map((r, i) => (
                        <div key={i} className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
                          <span>{r.name} ({r.email})</span>
                          <span className="text-blue-500 uppercase font-black">{r.provider}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subscribers Roster List Table */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[600px]">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2 flex-shrink-0">
              <FaBell className="text-emerald-500" />
              <span>Subscriber Roster</span>
            </h2>

            {loading ? (
              <div className="flex-grow flex flex-col items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 dark:border-slate-800 border-t-blue-500" />
                <span className="text-xs text-slate-400">Loading subscribers...</span>
              </div>
            ) : error ? (
              <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-4">
                <FaExclamationTriangle className="text-amber-500 text-3xl" />
                <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
                <button
                  onClick={loadSubscribers}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 text-white border-none rounded-lg cursor-pointer"
                >
                  Retry Load
                </button>
              </div>
            ) : subscribers.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6 space-y-2">
                <FaUsers className="text-slate-300 dark:text-slate-700 text-3xl" />
                <h4 className="text-xs font-bold text-slate-400">No active subscribers yet</h4>
                <p className="text-[10px] text-slate-500 max-w-[200px]">Subscribers will show here once users click Follow on the dashboard.</p>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin space-y-3">
                {subscribers.map((sub) => {
                  const isGmail = sub.provider === 'google' || sub.email.endsWith('@gmail.com');
                  return (
                    <div
                      key={sub.id || sub.email}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3 text-left hover:shadow-sm transition"
                    >
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-black truncate max-w-[150px]">{sub.name}</span>
                          {isGmail ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[8px] font-black uppercase">
                              <FaGoogle className="text-[7px]" />
                              Google
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase">
                              <FaEnvelope className="text-[7px]" />
                              Email
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{sub.email}</p>
                        {sub.created_at && (
                          <p className="text-[8px] text-slate-500 mt-1 font-semibold">
                            Joined {new Date(sub.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleDeleteSubscriber(sub.email)}
                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-500/5 transition border-none cursor-pointer"
                        title="Delete subscriber"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
