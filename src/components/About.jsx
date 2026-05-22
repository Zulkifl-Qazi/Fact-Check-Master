// src/components/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEye, FaBullseye, FaHeart, FaUsers, FaGlobe, FaAward, FaLightbulb } from 'react-icons/fa';

const About = () => {
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

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Subtle background gradient elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-950/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-950/30 rounded-full px-6 py-3 mb-6 border border-blue-200/50 dark:border-blue-900/30">
            <FaShieldAlt className="text-blue-600 dark:text-blue-400" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold">About Our Mission</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-8 drop-shadow-sm">
            Fighting <span className="inline-block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Misinformation</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed mt-6">
            In an era where information travels faster than ever, we stand as guardians of truth, 
            providing reliable fact-checking services to combat fake news, propaganda, and misinformation.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-100 dark:border-slate-800/60 shadow-sm transition-colors duration-300"
        >
          <div className="text-center">
            <h3 style={{ marginTop: '32px', marginBottom: '32px' }} className="text-3xl font-bold text-slate-900 dark:text-slate-100">Our Mission</h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl mx-auto mt-6">
              To create a more informed society by providing accurate, timely fact-checking services and promoting 
              media literacy. We believe that access to verified information is fundamental to democracy and 
              human progress. Through rigorous research, transparent methodology, and community engagement, 
              we work to counter the spread of misinformation and support evidence-based decision making.
            </p>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className=""
        >
          <h3 style={{ marginTop: '48px', marginBottom: '64px' }} className="text-3xl font-bold text-center text-slate-900 dark:text-slate-100">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 dark:border-slate-800/60 hover:border-blue-200 dark:hover:border-blue-500/50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-lg">
                    <value.icon className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h4 style={{ marginTop: '8px', marginBottom: '16px' }} className="text-xl font-semibold text-slate-900 dark:text-slate-100">{value.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          style={{ marginTop: '80px', marginBottom: '80px' }}
          className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 rounded-2xl p-8 md:p-12 text-white border border-blue-500/40 dark:border-blue-700/30 shadow-md transition-colors duration-300"
        >
          <h3 style={{ marginTop: '32px', marginBottom: '64px' }} className="text-3xl font-bold text-center">Our Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="text-4xl mx-auto mb-4 text-blue-200 dark:text-blue-300" />
                <div className="text-3xl md:text-4xl font-black mb-2">{stat.number}</div>
                <div className="text-white/90 font-semibold text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          style={{ marginTop: '80px' }}
          className="text-center"
        >
          <h3 style={{ marginTop: '48px', marginBottom: '32px' }} className="text-3xl font-bold text-slate-900 dark:text-slate-100">Expert Team</h3>
          <p style={{ marginTop: '32px' }} className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Our team consists of experienced journalists, researchers, data analysts, and technology experts 
            who are passionate about truth and committed to the highest standards of fact-checking.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;