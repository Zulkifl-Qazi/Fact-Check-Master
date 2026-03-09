import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const lastUpdated = 'March 9, 2026';

  return (
    <section style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(2, 6, 23), rgb(0, 0, 0))', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(88, 28, 135, 0.4)', borderRadius: '9999px', padding: '0.6rem 1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
              <FaShieldAlt style={{ color: '#c4b5fd' }} />
              <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '0.9rem' }}>Legal</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Last updated: {lastUpdated}</p>
          </div>

          {/* Content Card */}
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '1.25rem', padding: '2.5rem', border: '1px solid rgba(168, 85, 247, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: 'rgba(255,255,255,0.78)', lineHeight: '1.75', fontSize: '1rem' }}>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>1. Introduction</h2>
                <p>
                  Fact Check Master ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our fact-checking services.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>2. Information We Collect</h2>
                <p style={{ marginBottom: '0.75rem' }}>We collect information in the following ways:</p>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyleType: 'disc' }}>
                  <li><strong style={{ color: 'white' }}>Contact Form Submissions:</strong> When you use our contact form, we collect your name, email address, subject, and message content to respond to your inquiry.</li>
                  <li><strong style={{ color: 'white' }}>Device Information:</strong> We collect basic device fingerprint data to help manage access and prevent abuse of our platform.</li>
                  <li><strong style={{ color: 'white' }}>Analytics Data:</strong> We use Vercel Analytics to collect anonymous usage data such as page views, browser type, and general location to improve our services.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>3. Cookies & Advertising</h2>
                <p style={{ marginBottom: '0.75rem' }}>
                  We use Google AdSense to display advertisements on our site. Google AdSense may use cookies and web beacons to serve ads based on your prior visits to our website or other websites on the Internet. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', textDecoration: 'underline' }}>Google's Ads Settings</a>.
                </p>
                <p>
                  Third-party vendors, including Google, use cookies to serve ads based on your browsing activity. You may opt out of the use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', textDecoration: 'underline' }}>www.aboutads.info</a>.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>4. Third-Party Embeds</h2>
                <p>
                  Our fact-check articles may embed content from third-party platforms including YouTube, Twitter/X, TikTok, Facebook, and Vimeo. These embeds may collect data about you according to their own privacy policies. We encourage you to review the privacy policies of these platforms.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>5. How We Use Your Information</h2>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyleType: 'disc' }}>
                  <li>To respond to your inquiries and feedback</li>
                  <li>To improve and maintain our website and services</li>
                  <li>To analyze usage trends and optimize user experience</li>
                  <li>To prevent abuse and ensure platform security</li>
                  <li>To display relevant advertisements through Google AdSense</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>6. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is completely secure. While we strive to protect your data, we cannot guarantee its absolute security.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>7. Data Retention</h2>
                <p>
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>8. Your Rights</h2>
                <p style={{ marginBottom: '0.75rem' }}>You have the right to:</p>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyleType: 'disc' }}>
                  <li>Request access to the personal data we hold about you</li>
                  <li>Request correction or deletion of your personal data</li>
                  <li>Object to or restrict the processing of your data</li>
                  <li>Withdraw consent at any time where processing is based on consent</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>9. Children's Privacy</h2>
                <p>
                  Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last updated" date. We encourage you to review this page periodically.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>11. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:factchk0556@gmail.com" style={{ color: '#a78bfa', textDecoration: 'underline' }}>factchk0556@gmail.com</a>.
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
