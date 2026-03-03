import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'advertising', label: '광고' },
  { id: 'automation', label: '자동화' },
  { id: 'data', label: '데이터' },
  { id: 'crm', label: 'CRM' },
  { id: 'policy', label: '정책' },
  { id: 'private', label: 'Private' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = PROJECTS.filter(
    project => activeCategory === 'all' || project.category === activeCategory
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-6 py-24"
    >
      <motion.div variants={item} className="mb-12 md:mb-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
          프로젝트
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
          광고·커머스·CRM·데이터·AI/ML 영역의 프로젝트를 문제정의 → 실행 → KPI 성과 기준으로 정리했습니다.
        </p>
      </motion.div>

      <motion.div variants={item} className="flex flex-wrap gap-3 mb-12">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category.id
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {category.label}
          </button>
        ))}
      </motion.div>

      <motion.div layout className="grid md:grid-cols-2 gap-8 md:gap-12">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div 
              key={project.id} 
              layout
              variants={item}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="group relative rounded-3xl overflow-hidden glass-panel flex flex-col h-full border border-white/5 hover:border-emerald-500/30 transition-colors"
            >
              <div className="aspect-[16/9] overflow-hidden bg-zinc-900 border-b border-white/10 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-mono rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col bg-gradient-to-b from-white/[0.02] to-transparent">
                <h3 className="text-2xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                <p className="text-zinc-400 leading-relaxed mb-8 flex-1">{project.description}</p>
                
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 mt-auto">
                    {project.metrics.map(metric => (
                      <div key={metric.label} className="text-center md:text-left">
                        <div className="text-xl md:text-2xl font-mono font-bold text-emerald-400">{metric.value}</div>
                        <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider mt-1">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link to={project.link} className="absolute inset-0 z-20">
                <span className="sr-only">View {project.title}</span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
