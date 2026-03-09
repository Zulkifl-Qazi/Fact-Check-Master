import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEye, FaBullseye, FaHeart, FaUsers, FaGlobe, FaAward, FaLightbulb, FaSearch, FaDatabase, FaCheckDouble, FaUserTie, FaNewspaper } from 'react-icons/fa';

const AboutPage = () => {
  const values = [
    {
      icon: FaShieldAlt,
      title: "Truth & Integrity",
      description: "We are committed to providing accurate, unbiased fact-checking with complete transparency in our methodology."
    },
    {
      icon: FaEye,
      title: "Vigilant Monitoring",
      description: "24/7 surveillance of information landscapes to identify and counter misinformation before it spreads."
    },
    {
      icon: FaBullseye,
      title: "Precision & Accuracy",
      description: "Every fact-check undergoes rigorous verification through multiple sources and expert review processes."
    },
    {
      icon: FaHeart,
      title: "Public Service",
      description: "Dedicated to serving the public interest by promoting media literacy and informed democratic discourse."
    }
  ];

  const stats = [
    { icon: FaUsers, number: "50,000+", label: "Community Members" },
    { icon: FaGlobe, number: "25+", label: "Countries Covered" },
    { icon: FaAward, number: "99.9%", label: "Accuracy Rate" },
    { icon: FaLightbulb, number: "10,000+", label: "Facts Verified" }
  ];

  const methodology = [
    {
      step: 1,
      icon: FaSearch,
      title: "Claim Identification",
      description: "Our team monitors news sources, social media platforms, and public discourse to identify claims that require verification. We prioritize claims with high public impact and viral potential."
    },
    {
      step: 2,
      icon: FaDatabase,
      title: "Source Gathering",
      description: "We collect evidence from primary sources — official records, scientific publications, verified databases, and credible news agencies. We trace claims back to their origin whenever possible."
    },
    {
      step: 3,
      icon: FaCheckDouble,
      title: "Multi-Source Verification",
      description: "Each claim is cross-referenced against multiple independent sources. We apply evidence-based reasoning, consult domain-specific references, and verify through at least three independent channels."
    },
    {
      step: 4,
      icon: FaUserTie,
      title: "Expert Review",
      description: "Our team of experienced journalists, researchers, and data analysts reviews each fact-check for accuracy, completeness, and fairness before publication."
    },
    {
      step: 5,
      icon: FaNewspaper,
      title: "Publication with Verdict",
      description: "Each fact-check is published with a clear verdict — Verified, False, Misleading, or Pending — along with the full evidence trail so readers can evaluate the facts independently."
    }
  ];

  const verdicts = [
    { label: "Verified", color: "#10b981", description: "The claim is supported by substantial evidence from credible sources." },
    { label: "False", color: "#ef4444", description: "The claim is contradicted by evidence and cannot be substantiated." },
    { label: "Misleading", color: "#f97316", description: "The claim contains elements of truth but is presented in a deceptive or out-of-context manner." },
    { label: "Pending", color: "#eab308", description: "The claim is under investigation and a verdict has not yet been reached." }
  ];

  return (
    <section style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(2, 6, 23), rgb(0, 0, 0))', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(88, 28, 135, 0.4)', borderRadius: '9999px', padding: '0.6rem 1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
            <FaShieldAlt style={{ color: '#c4b5fd' }} />
            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: '0.9rem' }}>About Us</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '800', color: 'white', marginBottom: '1rem' }}>
            Fighting <span style={{ background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Misinformation</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>
            Countering fake news, propaganda, post-truth rhetoric, and beyond — your trusted source for verified information in the digital age.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '1.25rem', padding: '2.5rem', border: '1px solid rgba(168, 85, 247, 0.25)', marginBottom: '3rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: '1.25rem' }}>Our Mission</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: '1.8', textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
            To create a more informed society by providing accurate, timely fact-checking services and promoting 
            media literacy. We believe that access to verified information is fundamental to democracy and 
            human progress. Through rigorous research, transparent methodology, and community engagement, 
            we work to counter the spread of misinformation and support evidence-based decision making.
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '1.25rem', padding: '2.5rem', border: '1px solid rgba(168, 85, 247, 0.2)', marginBottom: '3rem' }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: '1.25rem' }}>Our Story</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: '1.8', textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
            Founded in 2024, Fact Check Master was born out of a growing concern about the rapid spread of 
            misinformation in the digital age. What started as a small initiative to verify viral claims has 
            grown into a comprehensive fact-checking platform covering world news, viral claims, military 
            affairs, and regional reporting across 25+ countries. Our platform operates around the clock, 
            monitoring information landscapes to identify and debunk false narratives before they can cause harm.
          </p>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: '2rem' }}>Our Core Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + index * 0.08 }}
                viewport={{ once: true }}
                style={{
                  background: 'rgba(88, 28, 135, 0.25)',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  transition: 'transform 0.25s, border-color 0.25s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.25)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ flexShrink: 0, background: 'rgba(139, 92, 246, 0.2)', padding: '0.75rem', borderRadius: '0.625rem' }}>
                    <value.icon style={{ color: '#c4b5fd', fontSize: '1.25rem' }} />
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{value.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', fontSize: '0.95rem' }}>{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.6), rgba(124, 58, 237, 0.4))',
            borderRadius: '1.25rem',
            padding: '2.5rem',
            marginBottom: '3rem',
            border: '1px solid rgba(168, 85, 247, 0.35)'
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: '2rem' }}>Our Impact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center' }}
              >
                <stat.icon style={{ fontSize: '2rem', color: '#c4b5fd', marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '0.25rem' }}>{stat.number}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: '0.85rem' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fact-Checking Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>Our Fact-Checking Methodology</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Every fact-check follows a rigorous, transparent process to ensure the highest standards of accuracy.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {methodology.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                viewport={{ once: true }}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  background: 'rgba(30, 41, 59, 0.7)',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  flexShrink: 0,
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)'
                }}>
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <item.icon style={{ color: '#a78bfa', fontSize: '0.95rem' }} />
                    <h3 style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>{item.title}</h3>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', fontSize: '0.95rem' }}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Verdict Definitions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
          style={{ marginBottom: '3rem' }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: '2rem' }}>Our Verdicts</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {verdicts.map((verdict, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
                viewport={{ once: true }}
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  borderLeft: `4px solid ${verdict.color}`,
                  border: `1px solid rgba(168, 85, 247, 0.15)`,
                  borderLeftColor: verdict.color,
                  borderLeftWidth: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: verdict.color }}></div>
                  <h3 style={{ color: verdict.color, fontWeight: '700', fontSize: '1.05rem' }}>{verdict.label}</h3>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: '1.6' }}>{verdict.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '1.25rem',
            padding: '2.5rem',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', marginBottom: '1.25rem' }}>Our Team</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto', marginBottom: '1rem' }}>
            Our team consists of experienced journalists, researchers, data analysts, and technology experts 
            who are passionate about truth and committed to the highest standards of fact-checking. With 
            expertise spanning multiple languages, regions, and subject areas, we bring a comprehensive 
            perspective to every claim we investigate.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>
            Our coverage spans World News, Viral Claims, Military Claims, and regional reporting, ensuring 
            thorough verification across the topics that matter most to our global community.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutPage;
