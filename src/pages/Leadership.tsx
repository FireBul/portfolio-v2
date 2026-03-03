import React from 'react';
import { motion } from 'framer-motion';
import { LEADERSHIP_PROJECTS } from '../constants';

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Leadership() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-6 py-24"
    >
      <motion.div variants={item} className="mb-16 md:mb-24">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
          리더십
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
          팀 빌딩과 운영 체계화 역량을 실제 사례로 확인할 수 있습니다.
        </p>
      </motion.div>

      <div className="space-y-32">
        {LEADERSHIP_PROJECTS.map((project, i) => (
          <motion.div key={project.id} variants={item} className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className={`space-y-8 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{project.title}</h2>
              <p className="text-xl text-zinc-400 leading-relaxed">{project.description}</p>
              
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                  {project.metrics.map(metric => (
                    <div key={metric.label}>
                      <div className="text-3xl font-mono font-bold text-white mb-2">{metric.value}</div>
                      <div className="text-sm text-zinc-500 uppercase tracking-wider">{metric.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={`aspect-[4/3] rounded-3xl overflow-hidden glass-panel ${i % 2 === 1 ? 'md:order-1' : ''}`}>
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={item} className="mt-32 pt-24 border-t border-white/10">
        <h2 className="text-3xl font-bold tracking-tight mb-12">갤러리</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://firebul.github.io/portfolio/assets/images/music/first-rehearsal.jpg',
            'https://firebul.github.io/portfolio/assets/images/music/hospital-performance.jpg',
            'https://firebul.github.io/portfolio/assets/images/music/mgop-orchestra.jpg',
            'https://firebul.github.io/portfolio/assets/images/music/2506_dotorihouse.jpg',
            'https://firebul.github.io/portfolio/assets/images/music/first-meeting.jpg',
            'https://firebul.github.io/portfolio/assets/images/music/instruments.jpg',
            'https://firebul.github.io/portfolio/assets/images/music/first-flute-performance.jpg'
          ].map((img, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden glass-panel group">
              <img 
                src={img} 
                alt={`Gallery image ${i + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
