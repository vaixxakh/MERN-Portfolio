import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiNextdotjs, SiTypescript } from 'react-icons/si';
import { FaGraduationCap, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const STACK_ITEMS = [
  {
    key: 'm',
    title: 'MongoDB',
    fullName: 'Database Engineering',
    icon: <SiMongodb />,
    color: 'text-emerald-600',
    borderColor: 'hover:border-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.08)',
    description: 'Document-oriented database storing JSON-like flexible documents. Enables seamless integration with Node using Mongoose schemas.',
    curriculum: 'Mastered aggregation pipelines, schema relationships, index optimization, and clustering at Bridgeon Solutions LLP.',
    features: ['Schema Design validation', 'Mongoose ODM models', 'Indexing & Queries optimization', 'Graceful JSON file database fallback']
  },
  {
    key: 'e',
    title: 'Express.js',
    fullName: 'API Pipeline Architecture',
    icon: <SiExpress />,
    color: 'text-indigo-600',
    borderColor: 'hover:border-indigo-500/20',
    glowColor: 'rgba(99, 102, 241, 0.08)',
    description: 'A minimalist backend routing framework for Node.js. Simplifies request handling pipelines, middleware execution, and REST structures.',
    curriculum: 'Implemented enterprise router divisions, CORS setups, error boundaries, and logging filters during internship periods.',
    features: ['Express Router controllers', 'Unified Error boundaries', 'CORS & Security middlewares', 'Live stdout logs queue streams']
  },
  {
    key: 'r',
    title: 'React.js & Next.js',
    fullName: 'Reactive Interface Engine & SSR',
    icon: <SiReact className="animate-[spin_16s_linear_infinite]" />,
    color: 'text-cyan-600',
    borderColor: 'hover:border-cyan-500/20',
    glowColor: 'rgba(6, 182, 212, 0.08)',
    description: 'Component-driven frontend UI library. Enables rapid reactive UI updates, virtual DOM synchronization, and interactive modular cards.',
    curriculum: 'Studied core React hooks alongside Next.js Server-Side Rendering (SSR), static generation (SSG), and file-based dynamic routing pipelines at Bridgeon.',
    features: ['React 19 Hooks lifecycle', 'Next.js App Router & SSR', 'Framer Motion scroll transitions', 'Tailwind CSS v4 layouts']
  },
  {
    key: 'n',
    title: 'Node.js & TypeScript',
    fullName: 'Runtime & Strict Type Validation',
    icon: <SiNodedotjs />,
    color: 'text-emerald-700',
    borderColor: 'hover:border-emerald-600/20',
    glowColor: 'rgba(16, 185, 129, 0.08)',
    description: 'Chrome V8 engine wrapper executing JavaScript server-side. Handles non-blocking asynchronous requests for high scaling workloads.',
    curriculum: 'Acquired strict typing competencies using TypeScript. Bound compiler typings to Express routes, Mongoose models, and frontend component states.',
    features: ['Non-blocking event loop', 'TypeScript compile validation', 'Concurrently scripts managers', 'Environment variables (.env)']
  }
];

export default function AboutStack() {
  const [selectedTech, setSelectedTech] = useState('m');

  const activeTech = STACK_ITEMS.find(item => item.key === selectedTech);

  return (
    <div id="about" className="py-24 border-b border-black/5 relative bg-white/30">
      {/* Background visual glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gradient-to-r from-indigo-100/10 via-purple-100/10 to-cyan-100/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Title */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm"
          >
            <FaGraduationCap /> Learning Credentials
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 font-display"
          >
            Bridgeon Solutions <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">LLP Blueprint</span>
          </motion.h2>
          <p className="max-w-xl mx-auto mt-4 text-gray-500 text-sm">
            Educated in deep full-stack MERN, Next.js, and TypeScript engineering at Bridgeon. Below is the blueprint of technical competencies mastered during our graduation.
          </p>
        </div>

        {/* Academic credentials showcase badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 mb-12 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-50/10 via-white/50 to-purple-50/10 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-2xl shadow-sm shadow-indigo-500/10">
              <FaGraduationCap />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-gray-900 text-base tracking-wide flex items-center gap-1.5 flex-wrap">
                MERN + Next.js + TS Graduate
              </h3>
              <p className="text-gray-400 text-xs mt-1.5 font-mono flex items-center gap-1">
                <FaMapMarkerAlt className="text-gray-400 text-[10px]" /> Kakkanchery, Calicut, Kerala &bull; Bridgeon Solutions LLP
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-150 text-gray-500 flex items-center gap-1.5 shadow-sm">
              <FaCheckCircle className="text-emerald-500 text-[10px]" /> Next.js App Router (SSR)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-150 text-gray-500 flex items-center gap-1.5 shadow-sm">
              <FaCheckCircle className="text-emerald-500 text-[10px]" /> Strict TypeScript Typings
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-gray-150 text-gray-500 flex items-center gap-1.5 shadow-sm">
              <FaCheckCircle className="text-emerald-500 text-[10px]" /> Local JSON DB Fallbacks
            </span>
          </div>
        </motion.div>

        {/* 2-Column interactive blueprint */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card selection */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {STACK_ITEMS.map((item) => {
              const isSelected = selectedTech === item.key;
              
              return (
                <motion.div
                  key={item.key}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedTech(item.key)}
                  className={`glass p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex items-center gap-4 ${
                    isSelected 
                      ? `border-indigo-200 bg-white shadow-md shadow-indigo-500/5` 
                      : `border-black/5 ${item.borderColor} bg-white/40`
                  }`}
                  style={isSelected ? { boxShadow: `0 0 25px ${item.glowColor}` } : {}}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSelected ? 'bg-gradient-to-b from-indigo-500 to-cyan-500' : 'bg-transparent'}`} />

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl ${
                    isSelected ? 'bg-indigo-50/50 border border-indigo-100' : 'bg-gray-50 border border-black/5'
                  } ${item.color} transition-colors duration-300`}>
                    {item.icon}
                  </div>

                  <div className="text-left">
                    <h3 className="font-display font-extrabold text-gray-900 tracking-wide text-sm">{item.title}</h3>
                    <p className="text-gray-400 text-xs mt-0.5 font-semibold">{item.fullName}</p>
                  </div>

                  <span className={`ml-auto font-mono text-xs font-semibold ${isSelected ? 'text-indigo-600' : 'text-gray-300'}`}>
                    0{STACK_ITEMS.indexOf(item) + 1}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Details screen */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTech.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="glass-premium rounded-3xl p-8 border border-indigo-100/50 h-full flex flex-col justify-between relative overflow-hidden text-left bg-white shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
              >
                <div className={`absolute -right-10 -bottom-10 text-[220px] opacity-[0.03] ${activeTech.color} pointer-events-none select-none`}>
                  {activeTech.icon}
                </div>

                <div>
                  {/* Title and Badge */}
                  <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
                    <span className={`text-4xl ${activeTech.color}`}>
                      {activeTech.icon}
                    </span>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 font-display tracking-wide">{activeTech.title}</h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-50 border border-black/5 text-gray-500 text-[10px] uppercase font-mono tracking-wider font-extrabold mt-1">
                        {activeTech.fullName}
                      </span>
                    </div>
                  </div>

                  {/* Paragraph info */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 font-mono">Overview</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {activeTech.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                        <FaGraduationCap /> Academic Scope (Bridgeon)
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-sm italic">
                        {activeTech.curriculum}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid features */}
                <div className="mt-8 pt-6 border-t border-black/5">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-4 font-mono">Mastery Highlights</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeTech.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50/50 px-3 py-2.5 rounded-xl border border-black/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-neon-pulse" />
                        <span className="font-semibold font-sans">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
