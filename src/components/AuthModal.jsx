import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaTimes, FaGoogle, FaFacebook, FaEnvelope, FaChevronRight, FaLock, FaUser } from 'react-icons/fa';
import logo from '../assets/logo.jpg';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = () => {
  const { showAuthModal, closeAuthModal, login } = useAuth();
  const [view, setView] = useState('main'); // 'main', 'email-otp', 'profile-setup'
  
  // Form fields
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [setupProvider, setSetupProvider] = useState('email'); // 'email', 'google', 'facebook', 'instagram'
  
  const [error, setError] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpHelpText, setOtpHelpText] = useState('');

  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'facebook-auth-success') {
        const { name, email } = event.data.user;
        const username = email.split('@')[0];
        const avatarUrl = `https://unavatar.io/facebook/${username}?fallback=https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
        
        login('facebook', {
          name,
          email,
          avatar: avatarUrl
        });
        closeAuthModal();
      }
    };
    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, [login, closeAuthModal]);

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
    if (otpInput === sentOtp) {
      // Transition to profile setup step rather than direct login
      setSetupProvider('email');
      setProfileEmail(emailInput.trim());
      setProfileName(emailInput.split('@')[0]);
      setError('');
      setView('profile-setup');
    } else {
      setError('Incorrect verification code. Please check the code and try again.');
    }
  };

  const handleSocialClick = (provider) => {
    if (provider === 'facebook') {
      const width = 580;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      window.open(
        '/auth/facebook',
        'FacebookLoginPopup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );
      return;
    }

    setSetupProvider(provider);
    setProfileEmail('');
    setProfileName('');
    setError('');
    setView('profile-setup');
  };

  const handleCompleteSetupSubmit = (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!profileEmail.trim() || !profileEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const cleanName = profileName.trim();
    const cleanEmail = profileEmail.trim();
    const username = cleanEmail.split('@')[0];

    // Automatically assign real profile photo via unavatar.io service, falling back to beautiful initials SVGs
    let avatarUrl = '';
    if (setupProvider === 'google' || setupProvider === 'email') {
      avatarUrl = `https://unavatar.io/${cleanEmail}?fallback=https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`;
    } else if (setupProvider === 'facebook') {
      avatarUrl = `https://unavatar.io/facebook/${username}?fallback=https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`;
    } else if (setupProvider === 'instagram') {
      avatarUrl = `https://unavatar.io/instagram/${username}?fallback=https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`;
    } else {
      avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`;
    }

    login(setupProvider, {
      name: cleanName,
      email: cleanEmail,
      avatar: avatarUrl
    });
    resetForm();
  };

  const resetForm = () => {
    setView('main');
    setEmailInput('');
    setOtpInput('');
    setProfileName('');
    setProfileEmail('');
    setError('');
    setSentOtp('');
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

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
                    onClick={() => handleSocialClick('google')}
                    className="w-full py-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition flex items-center justify-center gap-3 relative"
                  >
                    <FaGoogle className="text-red-500 absolute left-4 text-base" />
                    Continue with Google
                  </button>

                  <button 
                    onClick={() => handleSocialClick('facebook')}
                    className="w-full py-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition flex items-center justify-center gap-3 relative"
                  >
                    <FaFacebook className="text-blue-600 absolute left-4 text-base" />
                    Continue with Facebook
                  </button>
                </div>

                <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-6 leading-relaxed">
                  By signing in, you agree to our Terms of Service and Privacy Policy. All profile operations are secure.
                </p>
              </div>
            )}

            {/* View 2: Email OTP verification */}
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
                    Verify & Continue
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

            {/* View 3: Setup Profile Details (Name, Email, Auto-Avatar) */}
            {view === 'profile-setup' && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Set Up Your Profile
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Confirm your details to finalize sign in
                  </p>
                </div>

                <form onSubmit={handleCompleteSetupSubmit} className="space-y-5">
                  
                  {/* Profile inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Your Display Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <FaUser className="text-xs" />
                        </div>
                        <input 
                          type="text"
                          required
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <FaEnvelope className="text-xs" />
                        </div>
                        <input 
                          type="email"
                          required
                          disabled={setupProvider === 'email'}
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="w-full text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 disabled:opacity-75 disabled:cursor-not-allowed transition focus:bg-white dark:focus:bg-slate-950 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setView(setupProvider === 'email' ? 'email-otp' : 'main')}
                      className="flex-grow py-3 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl border-none cursor-pointer transition shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
                    >
                      Complete Sign In
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
