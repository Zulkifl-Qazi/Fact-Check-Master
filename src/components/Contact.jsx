// src/components/Contact.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: "Email Us",
      info: "contact@factcheckmaster.com",
      link: "mailto:contact@factcheckmaster.com"
    },
    {
      icon: FaPhone,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: FaMapMarkerAlt,
      title: "Visit Us",
      info: "123 Truth Street, Verification City, VC 12345",
      link: "#"
    }
  ];

  const socialLinks = [
    { icon: FaTwitter, url: "https://twitter.com/fcheckmaster", label: "Twitter" },
    { icon: FaFacebook, url: "#", label: "Facebook" },
    { icon: FaLinkedin, url: "#", label: "LinkedIn" }
  ];

  return (
    <section id="contact" className="relative py-20 bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
        <div className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/90 via-purple-900/80 to-purple-950/90"></div>

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md rounded-full px-4 py-2 mb-4 border border-white/[0.12]">
            <FaEnvelope className="text-purple-400 text-sm" />
            <span className="text-white/90 font-medium text-sm">Get In Touch</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Us</span>
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            Have a question or want to report misinformation? We're here to help. 
            Reach out to our team for prompt assistance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/[0.08] backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/[0.15]"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg border-2 border-white/20 bg-white/[0.08] text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-200 placeholder-white/40 font-medium"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 rounded-lg border-2 border-white/20 bg-white/[0.08] text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-200 placeholder-white/40 font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-white/90 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 rounded-lg border-2 border-white/20 bg-white/[0.08] text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-200 placeholder-white/40 font-medium"
                  placeholder="How can we help you?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-5 py-3 rounded-lg border-2 border-white/20 bg-white/[0.08] text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-200 resize-none placeholder-white/40 font-medium"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              
              <div className="pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full group relative inline-flex items-center justify-center overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-purple-500/40 transition-all duration-300 gap-3"
                >
                  <FaPaperPlane className="text-lg" />
                  <span>Send Message</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 transition-opacity duration-300 opacity-0 group-hover:opacity-100 -z-10 rounded-xl"></div>
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.08] backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/[0.15] hover:border-white/[0.25]"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500/20 p-4 rounded-lg">
                    <item.icon className="text-purple-300 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                    <a 
                      href={item.link}
                      className="text-white/70 hover:text-purple-300 transition-colors duration-200"
                    >
                      {item.info}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-purple-600/80 via-fuchsia-600/80 to-purple-700/80 backdrop-blur-md p-6 rounded-xl text-white border border-white/[0.15]"
            >
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <p className="text-white/90 mb-6">Stay connected and get the latest updates on our fact-checking activities.</p>
              
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-all duration-200 transform hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="text-xl" />
                  </a>
                ))}
              </div>
            </motion.div>

                        {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
              className="bg-white/[0.08] backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/[0.15]"
            >
              <h4 className="text-lg font-semibold text-white mb-4">Emergency Contact</h4>
              <p className="text-white/70 mb-4">
                For urgent fact-checking requests or media inquiries:
              </p>
              <div className="space-y-2">
                <p className="text-sm text-white/70">
                  <strong className="text-white">Media:</strong> media@factcheckmaster.com
                </p>
                <p className="text-sm text-white/70">
                  <strong className="text-white">Tips:</strong> tips@factcheckmaster.com
                </p>
                <p className="text-sm text-white/70">
                  <strong className="text-white">Emergency:</strong> +1 (555) 911-FACT
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;