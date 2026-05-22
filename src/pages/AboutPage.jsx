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
    <section className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 md:pt-32 pb-20 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-2 md:px-6">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-full px-5 py-2.5 mb-6">
            <FaShieldAlt className="text-blue-600 dark:text-blue-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold text-sm">About Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Fighting <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Misinformation</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Countering fake news, propaganda, post-truth rhetoric, and beyond — your trusted source for verified information in the digital age.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800/80 mb-8 shadow-xl"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-4">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed text-center max-w-3xl mx-auto">
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
          className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800/80 mb-8 shadow-xl"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-4">Our Story</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed text-center max-w-3xl mx-auto">
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
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + index * 0.08 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-950/40 p-3.5 rounded-xl">
                    <value.icon className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-slate-950 dark:text-white font-bold text-base mb-1.5">{value.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{value.description}</p>
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
          className="bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-slate-900/50 dark:to-slate-900/50 backdrop-blur-md rounded-3xl p-8 md:p-12 mb-8 border border-blue-500/20 dark:border-slate-800/80 shadow-lg text-white"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="text-3xl text-blue-200 dark:text-blue-400 mb-3 mx-auto" />
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.number}</div>
                <div className="text-blue-100 dark:text-blue-300 font-semibold text-[11px] uppercase tracking-wider">{stat.label}</div>
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
          className="mb-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Our Fact-Checking Methodology</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-xl mx-auto">
              Every fact-check follows a rigorous, transparent process to ensure the highest standards of accuracy.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {methodology.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                viewport={{ once: true }}
                className="flex gap-5 bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 items-start shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-purple-500/20 dark:shadow-none">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="text-purple-600 dark:text-purple-400 text-sm" />
                    <h3 className="text-slate-950 dark:text-white font-bold text-base md:text-lg">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">{item.description}</p>
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
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-8">Our Verdicts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {verdicts.map((verdict, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800/50 shadow-sm border-l-4"
                style={{ borderLeftColor: verdict.color }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: verdict.color }} />
                  <h3 className="font-bold text-base" style={{ color: verdict.color }}>{verdict.label}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{verdict.description}</p>
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
          className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800/80 text-center shadow-xl"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Our Team</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-4">
            Our team consists of experienced journalists, researchers, data analysts, and technology experts 
            who are passionate about truth and committed to the highest standards of fact-checking. With 
            expertise spanning multiple languages, regions, and subject areas, we bring a comprehensive 
            perspective to every claim we investigate.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed"> 
            Our coverage spans World News, Viral Claims, Military Claims, and regional reporting, ensuring 
            thorough verification across the topics that matter most to our global community.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutPage;
