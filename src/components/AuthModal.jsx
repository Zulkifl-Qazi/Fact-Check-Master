import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaTimes, FaGoogle, FaFacebook, FaApple, FaInstagram, FaEnvelope, FaChevronRight, FaLock, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import { motion, AnimatePresence } from 'framer-motion';

// High-quality mock profile images
const MOCK_AVATARS = {
  qzulkifl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  qazi: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  zulkifl18: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  case: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
};

const AuthModal = () => {
  const { showAuthModal, closeAuthModal, login } = useAuth();
  const [view, setView] = useState('main'); // 'main', 'google', 'facebook', 'instagram', 'email-otp', 'custom-user'
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [error, setError] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpHelpText, setOtpHelpText] = useState('');

  if (!showAuthModal) return null;

  const handleMainEmailContinue = async (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsSendingOtp(true);
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailInput.trim() })
      });
      if (!response.ok) {
        throw new Error('Failed to send code');
      }
      const data = await response.json();
      setSentOtp(data.otp);
      if (data.emailSent) {
        setOtpHelpText('✉️ Verification code sent to your email inbox!');
      } else {
        setOtpHelpText(`⚠️ SMTP is not configured. For testing, please use this code: ${data.otp}`);
      }
      setView('email-otp');
    } catch (err) {
      console.error(err);
      setError('Could not send verification code. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput === sentOtp || otpInput === '123456') {
      login('email', {
        name: emailInput.split('@')[0],
        email: emailInput.trim(),
        avatar: MOCK_AVATARS.default
      });
      resetForm();
    } else {
      setError('Incorrect verification code. (Hint: enter "123456" or use code provided above)');
    }
  };

  const selectGoogleAccount = (account) => {
    login('google', {
      name: account.name,
      email: account.email,
      avatar: account.avatar
    });
    resetForm();
  };

  const handleCustomUserSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim() || !customEmail.includes('@')) {
      setError('Please enter a valid name and email.');
      return;
    }
    login('google', {
      name: customName.trim(),
      email: customEmail.trim(),
      avatar: MOCK_AVATARS.default
    });
    resetForm();
  };

  const resetForm = () => {
    setView('main');
    setEmailInput('');
    setOtpInput('');
    setCustomName('');
    setCustomEmail('');
    setError('');
    setSentOtp('');
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const googleAccounts = [
    { name: 'Zulkifl Qazi', email: 'qzulkifl@gmail.com', avatar: MOCK_AVATARS.qzulkifl, status: 'Active' },
    { name: 'Qazi', email: 'qazi.piffer@gmail.com', avatar: MOCK_AVATARS.qazi, status: 'Signed out' },
    { name: 'Muhammad Zulkifl Qazi', email: 'zulkiflqazi18@gmail.com', avatar: MOCK_AVATARS.zulkifl18, status: 'Active' },
    { name: 'Zulkifl Qazi', email: '2230-0112.zulkifl@case.edu.pk', avatar: MOCK_AVATARS.case, status: 'Signed out' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Dark overlay backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal content container */}
        <motion.div 
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl w-full max-w-[450px] shadow-2xl overflow-hidden transition-colors duration-300"
        >
          {/* Close button */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-none cursor-pointer transition z-50 flex items-center justify-center"
          >
            <FaTimes className="text-sm" />
          </button>

          <div className="p-6 md:p-8">
            {/* View 1: Main Login Panel */}
            {view === 'main' && (
              <div>
                {/* Logo & Header */}
                <div className="text-center mb-8">
                  <div className="inline-block relative mb-3">
                    <img src={logo} alt="Fact Check Master Logo" className="w-14 h-14 rounded-xl shadow-md border-2 border-blue-500/20" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-semibold">
                    Sign in to participate in comments & share posts
                  </p>
                </div>

                {/* Email Form */}
                <form onSubmit={handleMainEmailContinue} className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <FaEnvelope className="text-sm" />
                      </div>
                      <input 
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="name@domain.com"
                        className="w-full text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

                  <button 
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-75 active:scale-[0.98] text-white font-bold rounded-xl border-none cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSendingOtp ? 'Sending...' : 'Continue'}
                    {!isSendingOtp && <FaChevronRight className="text-xs" />}
                  </button>
                </form>

                {/* Separator */}
                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-widest">or</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>

                {/* Social Login Options */}
                <div className="space-y-3">
                  <button 
                    onClick={() => setView('google')}
                    className="w-full py-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition flex items-center justify-center gap-3 relative"
                  >
                    <FaGoogle className="text-red-500 absolute left-4 text-base" />
                    Continue with Google
                  </button>

                  <button 
                    onClick={() => setView('facebook')}
                    className="w-full py-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition flex items-center justify-center gap-3 relative"
                  >
                    <FaFacebook className="text-blue-600 absolute left-4 text-base" />
                    Continue with Facebook
                  </button>

                  <button 
                    onClick={() => setView('instagram')}
                    className="w-full py-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition flex items-center justify-center gap-3 relative"
                  >
                    <FaInstagram className="text-pink-600 absolute left-4 text-base" />
                    Continue with Instagram
                  </button>
                </div>

                {/* Footer disclaimer */}
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-6 leading-relaxed">
                  By signing in, you agree to our Terms of Service and Privacy Policy. All profile operations are secure.
                </p>
              </div>
            )}

            {/* View 2: Google Choose Account Screen */}
            {view === 'google' && (
              <div>
                {/* Header */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                  <FaGoogle className="text-red-500 text-lg" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sign in with Google</span>
                </div>

                <div className="text-center mb-6">
                  <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg mx-auto mb-2 shadow" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Choose an account
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    to continue to <span className="font-bold text-blue-600 dark:text-blue-400">Fact Check Master</span>
                  </p>
                </div>

                {/* List of accounts */}
                <div className="space-y-1 max-h-[280px] overflow-y-auto pr-1">
                  {googleAccounts.map((acc, i) => (
                    <button
                      key={i}
                      onClick={() => selectGoogleAccount(acc)}
                      className="w-full p-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left border-none cursor-pointer rounded-xl transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img src={acc.avatar} alt={acc.name} className="w-9 h-9 rounded-full object-cover border border-slate-200/50 dark:border-slate-700" />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {acc.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {acc.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
                        {acc.status}
                      </span>
                    </button>
                  ))}

                  {/* Use another account option */}
                  <button
                    onClick={() => setView('custom-user')}
                    className="w-full p-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left border-none cursor-pointer rounded-xl transition flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <FaUser className="text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Use another account
                      </p>
                      <p className="text-xs text-slate-500">
                        Login with a custom Google email
                      </p>
                    </div>
                  </button>
                </div>

                {/* Google Footer */}
                <div className="mt-8 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                  Before using this app, you can review Fact Check Master's <a href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</a> and <a href="/terms-of-service" className="text-blue-500 hover:underline">Terms of Service</a>.
                </div>
              </div>
            )}

            {/* View 3: Facebook Simulated Login */}
            {view === 'facebook' && (
              <div>
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                  <FaFacebook className="text-blue-600 text-lg" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sign in with Facebook</span>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Facebook Login
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Fact Check Master is requesting access to your name, email address, and profile picture.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 flex items-center gap-4">
                  <img src={MOCK_AVATARS.qzulkifl} alt="Profile" className="w-12 h-12 rounded-full border shadow" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Zulkifl Qazi</h4>
                    <p className="text-xs text-slate-500">Facebook User</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      login('facebook', {
                        name: 'Zulkifl Qazi',
                        email: 'qzulkifl@gmail.com',
                        avatar: MOCK_AVATARS.qzulkifl
                      });
                      resetForm();
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl border-none cursor-pointer transition"
                  >
                    Continue as Zulkifl
                  </button>
                  <button
                    onClick={() => setView('main')}
                    className="w-full py-3 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* View 4: Instagram Simulated Login */}
            {view === 'instagram' && (
              <div>
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                  <FaInstagram className="text-pink-600 text-lg" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sign in with Instagram</span>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Instagram/Meta Auth
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Connect using your Meta social details.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 flex items-center gap-4">
                  <img src={MOCK_AVATARS.zulkifl18} alt="Profile" className="w-12 h-12 rounded-full border shadow" />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">zulkifl_qazi</h4>
                    <p className="text-xs text-slate-500">Instagram Profile</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      login('instagram', {
                        name: 'Zulkifl Qazi',
                        email: 'zulkiflqazi18@gmail.com',
                        avatar: MOCK_AVATARS.zulkifl18
                      });
                      resetForm();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl border-none cursor-pointer transition"
                  >
                    Log In with Instagram
                  </button>
                  <button
                    onClick={() => setView('main')}
                    className="w-full py-3 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* View 5: Email OTP verification */}
            {view === 'email-otp' && (
              <div>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-3">
                    <FaLock className="text-lg" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Enter verification code
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 px-4">
                    We sent a 6-digit OTP code to <span className="font-bold text-slate-700 dark:text-slate-300">{emailInput}</span>
                  </p>
                  {otpHelpText && (
                    <div className="mt-3 p-3 bg-blue-50/50 dark:bg-slate-950/50 border border-blue-200/50 dark:border-blue-800/40 rounded-xl text-[11px] text-blue-700 dark:text-blue-400 font-semibold leading-relaxed">
                      {otpHelpText}
                    </div>
                  )}
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <input 
                      type="text"
                      required
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Code (e.g. 123456)"
                      className="w-full text-center text-lg font-bold py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

                  <button 
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl border-none cursor-pointer transition"
                  >
                    Verify & Sign In
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button 
                    onClick={() => setView('main')}
                    className="text-xs font-bold text-slate-500 hover:text-blue-500 bg-transparent border-none cursor-pointer transition"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}

            {/* View 6: Google Custom Sign In Form */}
            {view === 'custom-user' && (
              <div>
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                  <FaGoogle className="text-red-500 text-lg" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sign in with Google</span>
                </div>

                <form onSubmit={handleCustomUserSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Google Email
                    </label>
                    <input 
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setView('google')}
                      className="flex-1 py-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl border-none cursor-pointer transition"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
