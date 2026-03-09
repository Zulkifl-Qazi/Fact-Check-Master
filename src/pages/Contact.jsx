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
    <section style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(2, 6, 23), rgb(0, 0, 0))', paddingTop: '5rem', paddingBottom: '5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}
      >
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(88, 28, 135, 0.4)', borderRadius: '9999px', padding: '0.6rem 1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
            <FaEnvelope style={{ color: '#c4b5fd' }} />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '0.9rem' }}>Get In Touch</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.75rem' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto' }}>Have a question or want to report misinformation? We're here to help.</p>
        </div>
        {/* Single-column Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          style={{ position: 'relative', background: 'rgba(30, 41, 59, 0.95)', padding: '3rem', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.35)', border: '2px solid rgba(168,85,247,0.35)' }}
        >
            {/* Background decorations */}
            <div style={{ position: 'absolute', top: '0', right: '0', width: '128px', height: '128px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '9999px', filter: 'blur(80px)', transform: 'translateY(-50%) translateX(25%)' }}></div>
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '128px', height: '128px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '9999px', filter: 'blur(80px)', transform: 'translateY(50%) translateX(-25%)' }}></div>

            <form onSubmit={submit} style={{ position: 'relative', zIndex: '10', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Heading */}
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Send us your feedback</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem' }}>We read every message and typically reply within 24 hours.</p>
              </div>
              {/* First Name & Last Name Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ position: 'relative' }}
                >
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      background: focusedField === 'firstName' ? 'rgba(71, 85, 105, 0.8)' : 'rgba(71, 85, 105, 0.5)',
                      border: focusedField === 'firstName' ? '2px solid rgb(168, 85, 247)' : '2px solid rgb(51, 65, 85)',
                      borderRadius: '16px',
                      outline: 'none',
                      transition: 'all 300ms',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '500',
                      boxShadow: focusedField === 'firstName' ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none'
                    }}
                    placeholder="First name"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  style={{ position: 'relative' }}
                >
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      background: focusedField === 'lastName' ? 'rgba(71, 85, 105, 0.8)' : 'rgba(71, 85, 105, 0.5)',
                      border: focusedField === 'lastName' ? '2px solid rgb(168, 85, 247)' : '2px solid rgb(51, 65, 85)',
                      borderRadius: '16px',
                      outline: 'none',
                      transition: 'all 300ms',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '500',
                      boxShadow: focusedField === 'lastName' ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none'
                    }}
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
                style={{ position: 'relative' }}
              >
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    background: focusedField === 'email' ? 'rgba(71, 85, 105, 0.8)' : 'rgba(71, 85, 105, 0.5)',
                    border: focusedField === 'email' ? '2px solid rgb(168, 85, 247)' : '2px solid rgb(51, 65, 85)',
                    borderRadius: '16px',
                    outline: 'none',
                    transition: 'all 300ms',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '500',
                    boxShadow: focusedField === 'email' ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none'
                  }}
                  placeholder="you@email.com"
                  required
                />
              </motion.div>

              {/* Subject */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{ position: 'relative' }}
              >
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    background: focusedField === 'subject' ? 'rgba(71, 85, 105, 0.8)' : 'rgba(71, 85, 105, 0.5)',
                    border: focusedField === 'subject' ? '2px solid rgb(168, 85, 247)' : '2px solid rgb(51, 65, 85)',
                    borderRadius: '16px',
                    outline: 'none',
                    transition: 'all 300ms',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '500',
                    boxShadow: focusedField === 'subject' ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none'
                  }}
                  placeholder="Subject"
                  required
                />
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ position: 'relative' }}
              >
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    background: focusedField === 'message' ? 'rgba(71, 85, 105, 0.8)' : 'rgba(71, 85, 105, 0.5)',
                    border: focusedField === 'message' ? '2px solid rgb(168, 85, 247)' : '2px solid rgb(51, 65, 85)',
                    borderRadius: '16px',
                    outline: 'none',
                    transition: 'all 300ms',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '500',
                    resize: 'none',
                    fontFamily: 'inherit',
                    boxShadow: focusedField === 'message' ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none'
                  }}
                  placeholder="Your message..."
                  required
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1.5rem' }}
              >
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    position: 'relative',
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(168, 85, 247), rgb(236, 72, 153))',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    paddingTop: '1.25rem',
                    paddingBottom: '1.25rem',
                    fontWeight: '700',
                    color: 'white',
                    boxShadow: '0 20px 25px rgba(147, 51, 234, 0.3)',
                    transition: 'all 300ms',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.5 : 1,
                    border: 'none',
                    fontSize: '1rem'
                  }}
                >
                  <span style={{ position: 'relative', zIndex: '10', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <FaPaperPlane style={{ animation: status === 'loading' ? 'bounce 1s infinite' : 'none' }} />
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </span>
                </button>

                {/* Success Message */}
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      color: 'rgb(134, 239, 172)',
                      background: 'rgba(6, 78, 59, 0.3)',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem',
                      paddingTop: '1rem',
                      paddingBottom: '1rem',
                      borderRadius: '16px',
                      border: '2px solid rgba(34, 197, 94, 0.5)',
                      fontWeight: '600'
                    }}
                  >
                    <FaCheckCircle />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span>Message sent successfully! 🎉</span>
                      {emailSent ? (
                        <span style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' }}>
                          📧 Confirmation email sent to your inbox
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.25rem' }}>
                          ⚠️ Note: Email confirmation could not be sent
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      color: 'rgb(252, 165, 165)',
                      background: 'rgba(127, 29, 29, 0.3)',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem',
                      paddingTop: '1rem',
                      paddingBottom: '1rem',
                      borderRadius: '16px',
                      border: '2px solid rgba(239, 68, 68, 0.5)',
                      fontWeight: '600'
                    }}
                  >
                    <FaExclamationCircle />
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
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '2rem' }}
        >
          <div style={{ background: 'rgba(30, 41, 59, 0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '0.75rem', borderRadius: '12px', flexShrink: 0 }}>
              <FaEnvelope style={{ color: '#c4b5fd', fontSize: '1.25rem' }} />
            </div>
            <div>
              <h3 style={{ color: 'white', fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>Email Us</h3>
              <a href="mailto:factchk0556@gmail.com" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#a78bfa'} onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}>factchk0556@gmail.com</a>
            </div>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.8)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '0.75rem', borderRadius: '12px', flexShrink: 0 }}>
              <FaGlobe style={{ color: '#c4b5fd', fontSize: '1.25rem' }} />
            </div>
            <div>
              <h3 style={{ color: 'white', fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>Our Platform</h3>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Online-based, serving 25+ countries</span>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{ background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.5), rgba(124, 58, 237, 0.35))', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.25)', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <h3 style={{ color: 'white', fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>Follow Us</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Stay updated on our latest fact-checks</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { icon: FaTwitter, url: 'https://twitter.com/fcheckmaster', color: 'rgb(29, 161, 242)' },
              { icon: FaFacebook, url: 'https://www.facebook.com/share/14MbJJKH8mD/?mibextid=wwXIfr', color: 'rgb(24, 119, 242)' },
              { icon: FaLinkedin, url: 'https://linkedin.com/company/fact-check-master', color: 'rgb(0, 119, 181)' }
            ].map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" style={{ padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = `${social.color}25`; e.currentTarget.style.color = social.color; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
                <social.icon style={{ fontSize: '1.1rem' }} />
              </a>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Contact;