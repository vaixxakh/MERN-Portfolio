import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSpinner, FaEnvelope, FaMapMarkerAlt, FaLaptopCode, FaCheckCircle } from 'react-icons/fa';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Collaboration',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const formData = { ...form };
      
      // 1. Scroll page smoothly to simulator playground
      const playgroundEl = document.getElementById('playground');
      if (playgroundEl) {
        playgroundEl.scrollIntoView({ behavior: 'smooth' });
      }
      
      // 2. Wait for scroll animation to proceed
      await new Promise(resolve => setTimeout(resolve, 850));

      // 3. Dispatch global custom event to trigger visual simulator
      window.dispatchEvent(new CustomEvent('mern-contact-submit', { detail: formData }));

      // 4. Fire the real API call in the background to write into datastore
      await axios.post('/api/messages', formData);
      
      setSubmitted(true);
      setForm({ name: '', email: '', subject: 'Collaboration', message: '' });
      
      // Auto reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to dispatch database write request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="py-24 relative bg-white/40 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm" >
            <FaEnvelope /> Contact Controller
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 font-display">
            Initiate a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Connection</span>
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-gray-500 text-sm">
            Ready to discuss system integrations or full-stack opportunities? Dispatch a contact transaction into our MERN database.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Contact Details (Left Column) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            <div className="glass rounded-3xl p-6 border border-black/5 text-left bg-white/60 shadow-sm">
              <h3 className="text-xl font-extrabold text-gray-900 font-display tracking-wide mb-4">
                Ecosystem Hub
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">
                Whether you have an interesting contract opportunity, want to build a customized Next.js or MERN platform, or just want to chat about system architectures, we are open to requests!
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-black/5 flex items-center justify-center text-indigo-600 text-base shadow-sm">
                    <FaEnvelope />
                  </div>
                  <div>
                    <span className="block text-gray-400 font-mono text-[9px] uppercase font-bold">Email Channel</span>
                    <a href="mailto:vaishakhvinodnlr@gmail.com" className="text-gray-900 hover:text-indigo-600 transition-colors font-semibold select-all">
                      vaishakhvinodnlr@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-black/5 flex items-center justify-center text-indigo-600 text-base shadow-sm">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <span className="block text-gray-400 font-mono text-[9px] uppercase font-bold">Academic Base</span>
                    <span className="text-gray-800 font-semibold leading-normal">
                      Kakkanchery, Calicut, Kerala
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-black/5 flex items-center justify-center text-purple-600 text-base shadow-sm">
                    <FaLaptopCode />
                  </div>
                  <div>
                    <span className="block text-gray-400 font-mono text-[9px] uppercase font-bold">Development Mode</span>
                    <span className="text-emerald-600 font-extrabold flex items-center gap-1.5 font-sans">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      AVAILABLE FOR ACTIVE GIGS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart visual integration badge */}
            <div className="glass rounded-3xl p-6 border border-indigo-100 text-left bg-gradient-to-r from-indigo-50/10 via-white/50 to-cyan-50/10 shadow-[0_10px_30px_rgba(0,0,0,0.01)]">
              <h4 className="text-xs font-extrabold font-mono text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                Flow Integration Active
              </h4>
              <p className="text-gray-400 text-[11px] leading-relaxed font-semibold">
                Clicking send will execute a real-time transaction. We will automatically scroll you up to our **MERN Flow Simulator** so you can visually watch your payload transit the client-server pipeline!
              </p>
            </div>

          </div>

          {/* Contact Form (Right Column) */}
          <div className="lg:col-span-7">
            <div className="glass rounded-3xl p-8 border border-black/5 h-full text-left bg-white/60 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs flex items-center gap-2 font-semibold">
                    <span>⚠️ {errorMsg}</span>
                  </div>
                )}

                {submitted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl text-xs flex items-center gap-2.5 font-semibold shadow-[0_4px_15px_rgba(16,185,129,0.05)]">
                    <FaCheckCircle className="text-base text-emerald-500 animate-bounce" />
                    <div>
                      <span className="block font-extrabold">Message piped to simulator!</span>
                      <span className="text-gray-400 text-[11px]">Scroll up to the console dashboard to view your new database record.</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full bg-white border border-gray-200 focus:border-indigo-400 rounded-xl px-4 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="hello@example.com"
                      className="w-full bg-white border border-gray-200 focus:border-indigo-400 rounded-xl px-4 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase mb-2">Topic / Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-white border border-gray-200 focus:border-indigo-400 rounded-xl px-4 py-3.5 text-xs text-gray-500 focus:outline-none transition-colors font-sans"
                  >
                    <option value="Collaboration">Collaboration Proposal</option>
                    <option value="Hiring">Job Opportunity</option>
                    <option value="Consulting">Consulting / Freelance</option>
                    <option value="Feedback">Simulator Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold font-mono text-gray-400 uppercase mb-2">Message Details *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Type message to watch it flow..."
                    rows="5"
                    className="w-full bg-white border border-gray-200 focus:border-indigo-400 rounded-xl px-4 py-3.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none transition-colors resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !form.name || !form.email || !form.message}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300 disabled:border-gray-200 text-white font-bold rounded-xl py-4 text-xs tracking-wider uppercase flex items-center justify-center gap-2 border border-black/5 shadow-[0_4px_25px_rgba(99,102,241,0.2)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.3)] transition-all duration-200 cursor-pointer font-sans"
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin text-white" />
                  ) : (
                    <FaPaperPlane className="text-white" />
                  )}
                  Dispatched API Contact Transaction
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
