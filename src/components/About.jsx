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
    <section id="about" className="py-20 bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950 relative overflow-hidden">
      {/* Subtle background gradient elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[100px]"></div>
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
          <div className="inline-flex items-center gap-3 bg-purple-900/50 rounded-full px-6 py-3 mb-6 border border-purple-500/40">
            <FaShieldAlt className="text-purple-300" />
            <span className="text-white/90 font-semibold">About Our Mission</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 drop-shadow-lg">
            Fighting <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Misinformation</span>
          </h2>
          <p className="text-xl text-white/75 max-w-4xl mx-auto leading-relaxed mt-6">
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
          className="bg-slate-900/80 rounded-2xl p-8 md:p-12 mb-20 border border-purple-500/30"
        >
          <div className="text-center">
            <br />
            <h3 className="text-3xl font-bold text-white mb-8">Our Mission</h3>
            <p className="text-lg text-white/75 leading-relaxed max-w-4xl mx-auto mt-4">
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
          className="mb-20"
        >
          <br />
          <h3 className="text-3xl font-bold text-center text-white mb-16">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="bg-purple-900/40 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-500/30 hover:border-purple-500/60"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-purple-500/20 p-3 rounded-lg">
                    <value.icon className="text-purple-300 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4">{value.title}</h4>
                    <p className="text-white/70 leading-relaxed">{value.description}</p>
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
          className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white border border-purple-500/40 mt-8"
        >
          <h3 className="text-3xl font-bold text-center mb-16">Our Impact</h3>
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
                <stat.icon className="text-4xl mx-auto mb-4 text-purple-200" />
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
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">Expert Team</h3>
          <p className="text-lg text-white/75 max-w-3xl mx-auto leading-relaxed mb-8 mt-6">
            Our team consists of experienced journalists, researchers, data analysts, and technology experts 
            who are passionate about truth and committed to the highest standards of fact-checking.
          </p>
          <button className="group relative inline-flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-10 py-4 rounded-xl shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105">
            <span className="relative flex items-center gap-2">
              Meet Our Team
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 transition-opacity duration-300 opacity-0 group-hover:opacity-100 -z-10 rounded-xl"></div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;