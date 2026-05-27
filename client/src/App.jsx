import React, { useState, useEffect } from 'react';
import MernPlayground from './components/MernPlayground';
import AboutStack from './components/AboutStack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaGraduationCap, FaPlay, FaWifi, FaArrowDown, FaBookOpen, FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import avatarImg from './assets/avatar.jpg';

function App() {
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    // Check if Express backend is running to display active badge
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) setBackendOnline(true);
      } catch (err) {
        setBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen text-gray-700 antialiased font-sans relative">
      
      {/* -------------------- FLOATING GLASS NAVBAR -------------------- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
        <div className="max-w-5xl mx-auto glass rounded-2xl border border-black/5 px-6 py-3.5 flex items-center justify-between pointer-events-auto shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm tracking-wide font-display shadow-sm shadow-indigo-500/30">
              VV
            </div>
            <span className="font-display font-extrabold text-gray-900 text-sm tracking-widest hidden sm:inline-block">
              VAISHAKH VINOD
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold tracking-wider font-mono text-gray-500">
            <button onClick={() => handleScrollTo('home')} className="hover:text-indigo-600 transition-colors cursor-pointer uppercase">Home</button>
            <button onClick={() => handleScrollTo('playground')} className="hover:text-indigo-600 transition-colors cursor-pointer uppercase">Simulator</button>
            <button onClick={() => handleScrollTo('about')} className="hover:text-indigo-600 transition-colors cursor-pointer uppercase">Credentials</button>
            <button onClick={() => handleScrollTo('projects')} className="hover:text-indigo-600 transition-colors cursor-pointer uppercase">Internship</button>
            <button onClick={() => handleScrollTo('contact')} className="hover:text-indigo-600 transition-colors cursor-pointer uppercase">Contact</button>
          </div>

          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${backendOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              {backendOnline ? 'API Connected' : 'Offline'}
            </span>
          </div>
        </div>
      </nav>

      {/* -------------------- HERO SECTION -------------------- */}
      <section id="home" className="min-h-screen pt-36 pb-20 flex flex-col justify-center relative overflow-hidden border-b border-black/5">
        {/* Soft elegant backdrops */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider shadow-sm"
              >
                <FaLaptopCode className="animate-pulse" /> Full-Stack MERN & Next.js Developer
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 100 }}
                className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 font-display leading-[1.05]"
              >
                Vaishakh Vinod<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">MERN Stack Engineer</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-xl text-gray-500 text-base sm:text-lg leading-relaxed select-text"
              >
                Graduated from the intensive MERN, Next.js, and TypeScript program at **Bridgeon Solutions LLP** in Kakkanchery, Calicut, Kerala. Specialized in building fast cloud infrastructures, and high-performance server-side rendering pipelines.
              </motion.p>

              {/* Educational Highlight Block */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 90 }}
                className="glass p-5 rounded-2xl border border-black/5 bg-white/40 flex items-start gap-4 max-w-lg shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-lg shadow-sm">
                  <FaBookOpen />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-gray-900 text-sm tracking-wide flex items-center gap-1">
                    <FaMapMarkerAlt className="text-indigo-600 text-[10px]" /> Kakkanchery, Calicut &bull; Bridgeon Solutions LLP
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 leading-normal font-sans">
                    Mastered advanced MERN adapters alongside Next.js Server-Side Rendering (SSR), static generation layouts, and strict TypeScript types.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <button
                  onClick={() => handleScrollTo('playground')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_10px_25px_rgba(99,102,241,0.25)] transition-all duration-200 cursor-pointer font-sans"
                >
                  <FaPlay className="text-[10px]" /> Run API Simulator
                </button>
                <button
                  onClick={() => handleScrollTo('contact')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer font-sans"
                >
                  Initiate Connection
                </button>
              </motion.div>

            </div>

            {/* Right Column: Premium Developer Portrait */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Orb rings */}
              <div className="absolute inset-0 m-auto w-[360px] h-[360px] rounded-full border border-black/5 bg-transparent pointer-events-none select-none">
                <div className="absolute inset-0 rounded-full border border-indigo-500/5 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-6 rounded-full border border-cyan-500/5 animate-[spin_25s_linear_infinite_reverse]" />
                <div className="absolute inset-12 rounded-full border border-purple-500/5 animate-[spin_15s_linear_infinite]" />
              </div>

              {/* Developer Avatar glass card mockup */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.6, type: "spring" }}
                className="w-[300px] sm:w-[320px] glass-premium rounded-[32px] p-5 border border-white/50 relative shadow-[0_30px_60px_rgba(0,0,0,0.06)] group overflow-hidden"
              >
                {/* Glowing mesh overlay inside card */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 opacity-30" />

                {/* Avatar Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-square border border-black/5 mb-5 shadow-sm bg-gray-100">
                  <img 
                    src={avatarImg} 
                    alt="Vaishakh Vinod Portrait" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  
                  {/* Floating active badges */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur border border-black/5 px-2.5 py-1 rounded-xl text-[9px] font-mono text-indigo-600 font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping inline-block" />
                    ACTIVESYNC
                  </div>
                </div>

                {/* Text details */}
                <div className="text-left relative z-10">
                  <h3 className="font-display font-extrabold text-gray-900 text-base tracking-wide uppercase">Vaishakh Vinod</h3>
                  <p className="text-gray-400 text-xs font-mono mt-1 font-semibold">MERN + Next.js &bull; Intern</p>
                  
                  {/* Technical capabilities progress bars or descriptors */}
                  <div className="mt-4 pt-3 border-t border-black/5 flex flex-wrap gap-1.5 text-[8px] font-mono text-gray-400">
                    <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-gray-500">MongoDB</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-gray-500">Express</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-gray-500">React</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-gray-500">Node</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-gray-500">Next.js</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-gray-500">TS</span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Scroll indicator pointing down */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleScrollTo('playground')}>
          <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Explore Simulator</span>
          <FaArrowDown className="text-xs animate-bounce" />
        </div>
      </section>

      {/* -------------------- PLAYGROUND SIMULATOR -------------------- */}
      <MernPlayground />

      {/* -------------------- ABOUT ARCHITECTURE STACK -------------------- */}
      <AboutStack />

      {/* -------------------- PROJECTS SHOWCASES -------------------- */}
      <Projects />

      {/* -------------------- CONTACT AND CONNECT PIPELINE -------------------- */}
      <Contact />

      {/* -------------------- FOOTER -------------------- */}
      <footer className="border-t border-black/5 py-12 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-400 font-mono">
          <div>
            &copy; 2026 Vaishakh Vinod. Verified MERN Developer. Crafted with Tailwind CSS v4 & Framer Motion.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-200">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Node Kernel Active
            </span>
            <span className="text-gray-200">|</span>
            <a href="https://github.com/vaixxakh" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors inline-flex items-center gap-1 font-bold"><FaGithub /> GitHub</a>
            <a href="https://www.linkedin.com/in/vaishakh-vinod/" target="_blank" rel="noreferrer" className="hover:text-gray-900 transition-colors inline-flex items-center gap-1 font-bold"><FaLinkedin /> LinkedIn</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
