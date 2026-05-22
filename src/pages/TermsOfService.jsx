import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract } from 'react-icons/fa';

const TermsOfService = () => {
  const lastUpdated = 'March 9, 2026';

  return (
    <section style={{ minHeight: '100vh', background: '#ffffff', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: '#eff6ff', borderRadius: '9999px', padding: '0.6rem 1.5rem', marginBottom: '1.5rem', border: '1px solid #93c5fd' }}>
              <FaFileContract style={{ color: '#2563eb' }} />
              <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '0.9rem' }}>Legal</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>
              Terms of Service
            </h1>
            <p style={{ color: '#4b5563', fontSize: '0.9rem' }}>Last updated: {lastUpdated}</p>
          </div>

          {/* Content Card */}
          <div style={{ background: '#ffffff', borderRadius: '1.25rem', padding: '2.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', color: '#374151', lineHeight: '1.75', fontSize: '1rem' }}>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Fact Check Master ("the Website"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>2. Description of Service</h2>
                <p>
                  Fact Check Master is an online platform dedicated to countering fake news, propaganda, post-truth rhetoric, and misinformation. We provide fact-checking services, verified information, and media literacy resources to promote informed public discourse and support democratic values.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>3. Content & Disclaimer</h2>
                <p style={{ marginBottom: '0.75rem' }}>
                  The fact-checks, articles, and information published on Fact Check Master are provided for informational and educational purposes only. While we strive for the highest standards of accuracy and integrity:
                </p>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyleType: 'disc' }}>
                  <li>Our content does not constitute professional, legal, or expert advice.</li>
                  <li>Fact-check verdicts (Verified, False, Misleading, Pending) represent our editorial assessment based on available evidence at the time of publication.</li>
                  <li>We may update or correct our assessments as new evidence emerges.</li>
                  <li>Users should consult primary sources and professionals for critical decisions.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>4. User Conduct</h2>
                <p style={{ marginBottom: '0.75rem' }}>When using our website and services, you agree not to:</p>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyleType: 'disc' }}>
                  <li>Submit false, misleading, or spam content through our contact or feedback forms</li>
                  <li>Attempt to interfere with the website's operation or security</li>
                  <li>Use automated systems to access the website in a manner that exceeds reasonable use</li>
                  <li>Impersonate any person or entity, or misrepresent your affiliation</li>
                  <li>Use our content to harass, defame, or harm any individual or organization</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>5. Intellectual Property</h2>
                <p>
                  All content on this website — including text, graphics, logos, images, and software — is the property of Fact Check Master or its content suppliers and is protected by intellectual property laws. You may share our content for non-commercial, informational purposes with proper attribution. Reproduction for commercial use without prior written consent is prohibited.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>6. Third-Party Content</h2>
                <p>
                  Our website may contain links to third-party websites and embed content from platforms such as YouTube, Twitter/X, TikTok, Facebook, and Vimeo. We are not responsible for the content, privacy practices, or availability of these third-party services. Your interaction with third-party content is governed by their respective terms and policies.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>7. Feedback & Submissions</h2>
                <p>
                  When you submit feedback, tips, or other content through our platform, you grant Fact Check Master a non-exclusive, royalty-free right to use, review, and respond to your submission. We may use feedback to improve our services but will not publicly share personally identifiable information without your consent.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>8. Limitation of Liability</h2>
                <p>
                  Fact Check Master shall not be held liable for any direct, indirect, incidental, consequential, or special damages arising from your use of or inability to use our website or services. Our content is provided "as is" without warranties of any kind, express or implied.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>9. Modifications</h2>
                <p>
                  We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with a revised "Last updated" date. Continued use of the website after posted changes constitutes acceptance of the revised terms.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>10. Governing Law</h2>
                <p>
                  These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
                </p>
              </div>

              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111827', marginBottom: '0.75rem' }}>11. Contact Us</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:factchk0556@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>factchk0556@gmail.com</a>.
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TermsOfService;
