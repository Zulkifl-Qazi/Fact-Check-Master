import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaEnvelope, FaGlobe, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await axios.post('/api/feedback', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      if (res.data && (res.data.id || res.data.success)) {
        setStatus('success');
        // Store email status for display in success message
        setEmailSent(res.data.emailSent);
        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        console.error('Unexpected response:', res.data);
        setStatus('error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setStatus('error');
    }
  };

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 md:pt-32 pb-20 px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[820px] mx-auto w-full"
      >
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-full px-5 py-2.5 mb-6">
            <FaEnvelope className="text-blue-600 dark:text-blue-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold text-sm">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3">Contact Us</h1>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-[550px] mx-auto">
            Have a question or want to report misinformation? We're here to help.
          </p>
        </div>

        {/* Single-column Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="relative bg-white dark:bg-slate-900/50 backdrop-blur-md p-8 md:p-12 rounded-3xl overflow-hidden border border-slate-250/50 dark:border-slate-800/80 shadow-xl"
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[80px] pointer-events-none transform translate-y-[-50%] translate-x-[25%]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-[80px] pointer-events-none transform translate-y-[50%] translate-x-[-25%]" />

          <form onSubmit={submit} className="relative z-10 flex flex-col gap-6">
            {/* Heading */}
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">Send us your feedback</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base">We read every message and typically reply within 24 hours.</p>
            </div>

            {/* First Name & Last Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('firstName')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500 font-medium text-sm md:text-base ${
                    focusedField === 'firstName'
                      ? 'border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-400/10 bg-white dark:bg-slate-950'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                  placeholder="First name"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="relative"
              >
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('lastName')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500 font-medium text-sm md:text-base ${
                    focusedField === 'lastName'
                      ? 'border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-400/10 bg-white dark:bg-slate-950'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                  placeholder="Last name"
                  required
                />
              </motion.div>
            </div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500 font-medium text-sm md:text-base ${
                  focusedField === 'email'
                    ? 'border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-400/10 bg-white dark:bg-slate-950'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
                placeholder="you@email.com"
                required
              />
            </motion.div>

            {/* Subject */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="relative"
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500 font-medium text-sm md:text-base ${
                  focusedField === 'subject'
                    ? 'border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-400/10 bg-white dark:bg-slate-950'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
                placeholder="Subject"
                required
              />
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                rows={5}
                className={`w-full px-5 py-3.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none transition-all duration-300 placeholder-slate-400 dark:placeholder-slate-500 font-medium text-sm md:text-base resize-none ${
                  focusedField === 'message'
                    ? 'border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-400/10 bg-white dark:bg-slate-950'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
                placeholder="Your message..."
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col gap-4 pt-2"
            >
              <button
                type="submit"
                disabled={status === 'loading'}
                className="relative w-full overflow-hidden rounded-xl bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-4 px-6 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10 transition-all duration-305 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <FaPaperPlane className={status === 'loading' ? 'animate-bounce' : ''} />
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </span>
              </button>

              {/* Success Message */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 text-emerald-800 dark:text-emerald-350 bg-emerald-50 dark:bg-emerald-950/20 px-6 py-4 rounded-xl border border-emerald-250/50 dark:border-emerald-800/50 font-semibold text-sm md:text-base"
                >
                  <FaCheckCircle className="text-lg text-emerald-600 dark:text-emerald-450" />
                  <div className="flex flex-col items-center">
                    <span>Message sent successfully! 🎉</span>
                    {emailSent ? (
                      <span className="text-xs opacity-90 mt-1">
                        📧 Confirmation email sent to your inbox
                      </span>
                    ) : (
                      <span className="text-xs opacity-80 mt-1">
                        ⚠️ Note: Email confirmation could not be sent
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950/20 px-6 py-4 rounded-xl border border-red-200 dark:border-red-900/50 font-semibold text-sm md:text-base"
                >
                  <FaExclamationCircle className="text-lg text-red-600 dark:text-red-400" />
                  <span>Error sending. Please try again.</span>
                </motion.div>
              )}
            </motion.div>
          </form>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        >
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 flex items-center gap-4 shadow-sm">
            <div className="bg-blue-50 dark:bg-blue-950/40 p-4.5 rounded-xl flex-shrink-0">
              <FaEnvelope className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-slate-950 dark:text-white font-bold text-sm mb-1">Email Us</h3>
              <a href="mailto:factchk0556@gmail.com" className="text-slate-600 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" style={{ textDecoration: 'none' }}>
                factchk0556@gmail.com
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 flex items-center gap-4 shadow-sm">
            <div className="bg-blue-50 dark:bg-blue-950/40 p-4.5 rounded-xl flex-shrink-0">
              <FaGlobe className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-slate-950 dark:text-white font-bold text-sm mb-1">Our Platform</h3>
              <span className="text-slate-600 dark:text-slate-400 text-sm">Online-based, serving 25+ countries</span>
            </div>
          </div>
        </motion.div>

        {/* Social Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="bg-slate-100 dark:bg-slate-900/30 backdrop-blur-md p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 mt-4 flex items-center justify-between flex-wrap gap-4 shadow-sm"
        >
          <div>
            <h3 className="text-slate-950 dark:text-white font-bold text-sm mb-1">Follow Us</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Stay updated on our latest fact-checks</p>
          </div>
          <div className="flex gap-2.5">
            {[
              { icon: FaTwitter, url: 'https://twitter.com/fcheckmaster', color: 'rgb(29, 161, 242)' },
              { icon: FaFacebook, url: 'https://www.facebook.com/share/14MbJJKH8mD/?mibextid=wwXIfr', color: 'rgb(24, 119, 242)' },
              { icon: FaLinkedin, url: 'https://linkedin.com/company/fact-check-master', color: 'rgb(0, 119, 181)' }
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600"
                style={{ textDecoration: 'none' }}
              >
                <social.icon className="text-base" />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;