import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaLaptopCode } from 'react-icons/fa';
import lumiereImg from '../assets/lumiere.png';
import localserviceImg from '../assets/localservice.png';

const PROJECTS = [
  {
    title: "Lumiere Luxury Lighting Website",
    category: "Internship E-Commerce Project",
    image: lumiereImg,
    description: "An ultra-premium E-Commerce platform built for high-end lighting designers. Features a glassmorphic visual products catalog, responsive shopping basket pipelines, advanced product filtration routers, and secure administrative dashboards.",
    tags: ["MERN Stack", "React DOM", "Mongoose Schemas", "Tailwind CSS"],
    github: "https://github.com/vaixxakh",
    demo: "https://lumiere-lighting.vercel.app/",
    color: "from-indigo-500/5 to-cyan-500/5",
    borderColor: "group-hover:border-indigo-500/25"
  },
  {
    title: "Local Service Freelancer Platform",
    category: "Internship Gig-Economy App",
    image: localserviceImg,
    description: "A hyper-localized gig portal connecting homeowners and corporate clients with nearby tradespeople and service contractors. Implemented geographic location mapping, live reservation calendars, and interactive service rating schemas.",
    tags: ["MERN Stack", "Express Routing", "JWT Auth", "Tailwind v4"],
    github: "https://github.com/vaixxakh",
    demo: "https://github.com/vaixxakh",
    color: "from-purple-500/5 to-indigo-500/5",
    borderColor: "group-hover:border-purple-500/25"
  }
];

export default function Projects() {
  return (
    <div id="projects" className="py-24 border-b border-black/5 relative bg-white/25">
      
      {/* Background radial glow */}
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-100/10 to-indigo-100/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm"
          >
            <FaLaptopCode /> Internship Showcases
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 font-display"
          >
            Internship <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Engineering Work</span>
          </motion.h2>
          <p className="max-w-xl mx-auto mt-4 text-gray-500 text-sm">
            Review the advanced, industry-aligned full-stack environments designed and built during our internship period.
          </p>
        </div>

        {/* Dynamic 2-column project grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 70 }}
              whileHover={{ y: -8 }}
              className="group glass rounded-3xl overflow-hidden border border-black/5 flex flex-col justify-between hover:shadow-[0_25px_50px_rgba(0,0,0,0.04)] hover:border-black/10 transition-all duration-300 text-left bg-white"
            >
              
              {/* Graphic preview area with REAL project screenshot */}
              <div className="h-56 bg-gray-50 relative overflow-hidden flex items-center justify-center border-b border-black/5">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none" 
                  loading="lazy"
                />
                {/* Soft gradient hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-extrabold font-mono text-indigo-500 uppercase tracking-widest block mb-2">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors font-display tracking-wide mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 select-text">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2 mb-6 border-t border-black/5 pt-4">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-50 border border-black/5 text-[9px] font-mono text-gray-400 font-extrabold uppercase shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <FaGithub className="text-sm" /> Codebase
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors ml-auto cursor-pointer"
                    >
                      <FaExternalLinkAlt className="text-[10px]" /> Live Preview
                    </a>
                  </div>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
