// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Contact from './pages/Contact';
import AdminTweets from './pages/AdminTweets';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Set document title and meta description
    document.title = 'Fact Check Master';
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Countering Fake News, Propaganda, Post-Truth and Beyond The Truth Rhetoric.';
  }, []);

  return (
    <BrowserRouter>
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-purple-950 via-slate-950 to-black text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] h-96 w-96 bg-fuchsia-500/10 blur-[140px]" />
      </div>
      <Navbar />
      <main className="relative flex-grow w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/tweets" element={<AdminTweets />} />
        </Routes>
      </main>
      <Footer />
    </div>
    </BrowserRouter>
  );
}

export default App;