import React, { useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, BarChart3, Target, Zap } from 'lucide-react';
import { KEY_METRICS, PROJECTS } from '../constants';
import { getOrAssignGroup, VARIANTS } from '../components/ABTestReveal';
import { trackABEvent, trackVisitor } from '../utils/supabase';
import { useAdMode } from '../components/AdPlatformDemo';
import { DisplayBanner } from '../components/ads/DisplayBanner';

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

export function Home() {
  const group = useMemo(() => getOrAssignGroup(), []);

  // impression 트래킹 (visitor당 1회) + 방문자 정보 수집
  useEffect(() => {
    trackABEvent(group, 'impression', '/');
    trackVisitor();
  }, [group]);

  const handleCTAClick = useCallback(() => {
    trackABEvent(group, 'click', '/');
  }, [group]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-6"
    >
      {/* Hero Section */}
      <section className="py-24 md:py-32 flex flex-col md:flex-row gap-12 items-center justify-between">
        <div className="flex-1 space-y-8">
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available for new opportunities
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
            안녕하세요,<br />
            <span className="text-gradient">최원혁입니다</span>
          </motion.h1>
          
          <motion.p variants={item} className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Product Strategy · AI/ML · Growth Execution<br />
            데이터 기반 제품 전략으로 광고/커머스 성과를 만든 PM입니다. 인터파크에서 핵심 프로젝트를 리드했고, 현재는 AI·ML 및 고난도 R&D 프로젝트까지 확장해 실무형 임팩트를 설계하고 있습니다.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-wrap gap-4 pt-4">
            <Link to="/projects" onClick={handleCTAClick} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              {VARIANTS[group]} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors">
              핵심 역량
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
              연락하기
            </Link>
          </motion.div>
        </div>
        
        <motion.div variants={item} className="w-full md:w-1/3 aspect-square rounded-3xl overflow-hidden border border-white/10 relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img 
            src="https://firebul.github.io/portfolio/assets/images/profile.jpg" 
            alt="최원혁 프로필" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </section>

      {/* Display Banner Ad (광고 모드 ON 시에만) */}
      <AdBannerSlot />

      {/* Metrics Section */}
      <section className="py-20 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {KEY_METRICS.map((metric, i) => (
            <motion.div key={metric.label} variants={item} className="flex flex-col gap-2">
              <span className="text-4xl md:text-5xl font-mono font-bold text-white">{metric.value}</span>
              <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{metric.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 border-t border-white/10">
        <div className="flex items-end justify-between mb-12">
          <motion.div variants={item} className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">주요 프로젝트</h2>
            <p className="text-zinc-400 max-w-xl">KPI 기준으로 정리된 대표 프로젝트만 빠르게 검토할 수 있습니다.</p>
          </motion.div>
          <motion.div variants={item}>
            <Link to="/projects" className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              모두 보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {PROJECTS.slice(0, 2).map((project, i) => (
            <motion.div key={project.id} variants={item} className="group relative rounded-3xl overflow-hidden glass-panel flex flex-col h-full border border-white/5 hover:border-emerald-500/30 transition-colors">
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
        </div>
      </section>

      {/* Core Competencies */}
      <section className="py-24 border-t border-white/10">
        <motion.div variants={item} className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">핵심 역량</h2>
          <p className="text-zinc-400 max-w-xl">의사결정 방식, 운영 철학, 문제 해결 접근을 간결하게 확인할 수 있습니다.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Target className="w-6 h-6" />, title: 'Problem Solving', desc: '현상에서 문제를 정의하고 원인을 고민하며 이를 해결해내는 추진력을 갖추었습니다.' },
            { icon: <BarChart3 className="w-6 h-6" />, title: 'Data Literacy', desc: '데이터를 이해하고 분석하여 인사이트를 도출하고, 이를 바탕으로 전략적인 의사결정을 내릴 수 있습니다.' },
            { icon: <Zap className="w-6 h-6" />, title: 'Planning & Execution', desc: '사용자 니즈를 파악하고 이를 반영한 서비스 기획부터 실행까지 전체 과정을 효과적으로 관리할 수 있습니다.' }
          ].map((comp, i) => (
            <motion.div key={comp.title} variants={item} className="p-8 rounded-3xl glass-panel hover:bg-white/5 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-emerald-400">
                {comp.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{comp.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{comp.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function AdBannerSlot() {
  const { adMode } = useAdMode();
  if (!adMode) return null;
  return <DisplayBanner />;
}
