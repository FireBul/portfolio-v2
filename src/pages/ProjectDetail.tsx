import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Target, Lightbulb, Wrench, Lock, Unlock, Play } from 'lucide-react';
import { PROJECTS } from '../constants';
import { PROJECT_DETAILS } from '../data/projectDetails';
import { useAdMode } from '../components/AdPlatformDemo';
import { runAuction, trackAdEvent } from '../data/adEngine';
import { getSdkState, type UserSegment } from '../data/adSdk';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const project = PROJECTS.find(p => p.id === id);
  const details = id ? PROJECT_DETAILS[id] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Block indexing for private projects
    if (project?.category === 'private') {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
      return () => { document.head.removeChild(meta); };
    }
  }, [id, project]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4 text-white">프로젝트를 찾을 수 없습니다</h1>
        <p className="text-zinc-400 mb-8">요청하신 프로젝트 페이지가 존재하지 않거나 삭제되었습니다.</p>
        <Link to="/projects" className="px-6 py-3 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors">
          프로젝트 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // Find next/prev projects for navigation
  const currentIndex = PROJECTS.findIndex(p => p.id === id);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : null;
  const nextProject = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto px-6 py-24"
    >
      {/* Breadcrumb */}
      <motion.nav variants={item} className="flex items-center gap-2 text-sm text-zinc-500 mb-12">
        <Link to="/" className="hover:text-emerald-400 transition-colors">홈</Link>
        <span>›</span>
        <Link to="/projects" className="hover:text-emerald-400 transition-colors">프로젝트</Link>
        <span>›</span>
        <span className="text-zinc-300">{project.title}</span>
      </motion.nav>

      {/* Hero Section */}
      <motion.section variants={item} className="mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] mb-6 text-white">
          {project.title}
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed mb-10">
          {details?.subtitle || project.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {project.metrics?.map((metric, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
              <div className="text-2xl md:text-3xl font-mono font-bold text-emerald-400 mb-2">{metric.value}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{metric.label}</div>
            </div>
          ))}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
            <div className="text-2xl md:text-3xl font-mono font-bold text-emerald-400 mb-2">PM</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">담당 역할</div>
          </div>
        </div>
      </motion.section>

      {/* Overview Image */}
      {(details?.overview?.image || project.image) && (
        <motion.div variants={item} className="mb-16 rounded-3xl overflow-hidden glass-panel border border-white/5">
          <img 
            src={details?.overview?.image || project.image} 
            alt={`${project.title} Overview`} 
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      )}

      {/* Content Sections */}
      {details ? (
        <div className="space-y-16">
          {/* Overview */}
          <motion.section variants={item}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <Target className="text-emerald-400" /> 배경 및 목표
            </h2>
            <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
              <p className="text-lg text-zinc-300 leading-relaxed">{details.overview.background}</p>
              <p className="text-lg text-zinc-300 leading-relaxed">{details.overview.goal}</p>
            </div>
          </motion.section>

          {/* Problems */}
          {details.problems && (
            <motion.section variants={item}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <Wrench className="text-emerald-400" /> 문제 정의
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {details.problems.map((prob: any, i: number) => (
                  <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-2">{prob.title}</h3>
                    <p className="text-zinc-400">{prob.desc}</p>
                  </div>
                ))}
              </div>
              {details.solutionGoal && (
                <div className="mt-6 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="text-emerald-400 font-bold mb-2">🎯 해결 목표</h4>
                  <p className="text-emerald-100/80 leading-relaxed">{details.solutionGoal}</p>
                </div>
              )}
            </motion.section>
          )}

          {/* Process */}
          {details.process && (
            <motion.section variants={item}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <CheckCircle2 className="text-emerald-400" /> 해결 과정
              </h2>
              <div className="space-y-4">
                {details.process.map((step: any, i: number) => (
                  <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0">
                      {step.step || i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{step.title || Object.keys(step)[0]}</h3>
                      <p className="text-zinc-400">{step.desc || Object.values(step)[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Results */}
          {details.results && (
            <motion.section variants={item}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <Target className="text-emerald-400" /> 결과 및 성과
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="glass-panel p-8 rounded-3xl border border-red-500/20 bg-red-500/5 text-center">
                  <h3 className="text-lg font-bold text-white mb-4">적용 전 (Before)</h3>
                  <div className="text-2xl font-bold text-red-400">{details.results.before}</div>
                </div>
                <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                  <h3 className="text-lg font-bold text-white mb-4">적용 후 (After)</h3>
                  <div className="text-3xl font-bold text-emerald-400">{details.results.after}</div>
                </div>
              </div>
              
              {details.results.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {details.results.metrics.map((m: any, i: number) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
                      <div className="text-2xl font-mono font-bold text-emerald-400 mb-2">{m.value}</div>
                      <div className="text-xs text-zinc-500 uppercase">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {/* Tech Stack */}
          {details.techStack && (
            <motion.section variants={item}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <Wrench className="text-emerald-400" /> 사용 기술 및 도구
              </h2>
              <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-wrap gap-3">
                {details.techStack.map((tech: string, i: number) => (
                  <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.section>
          )}

          {/* Learnings */}
          {details.learnings && (
            <LearningsSection details={details} />
          )}
                
          {/* (LearningsSection handles the rest) */}
        </div>
      ) : (
        <motion.div variants={item} className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
          <p className="text-xl text-zinc-400">상세 내용이 준비 중입니다.</p>
        </motion.div>
      )}

      {/* Project Navigation */}
      <motion.nav variants={item} className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4">
        {prevProject ? (
          <Link 
            to={prevProject.link} 
            className="flex items-center gap-3 px-6 py-4 rounded-2xl glass-panel border border-white/5 hover:border-emerald-500/30 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            <div className="text-left">
              <div className="text-xs text-zinc-500 mb-1">이전 프로젝트</div>
              <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{prevProject.title}</div>
            </div>
          </Link>
        ) : <div />}
        
        {nextProject ? (
          <Link 
            to={nextProject.link} 
            className="flex items-center gap-3 px-6 py-4 rounded-2xl glass-panel border border-white/5 hover:border-emerald-500/30 transition-colors group text-right justify-end"
          >
            <div>
              <div className="text-xs text-zinc-500 mb-1">다음 프로젝트</div>
              <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{nextProject.title}</div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </Link>
        ) : <div />}
      </motion.nav>
    </motion.div>
  );
}

function LearningsSection({ details }: { details: any }) {
  const { adMode } = useAdMode();
  const [unlocked, setUnlocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [watching, setWatching] = useState(false);

  const startRewardAd = useCallback(() => {
    setWatching(true);
    setCountdown(5);

    const sdk = getSdkState();
    const segment: UserSegment = sdk.userProfile?.segment || 'casual';
    const auction = runAuction('reward_interstitial', 'reward', undefined, segment);
    if (auction.winnerId) {
      trackAdEvent('impression', auction.winnerId, 'reward_interstitial');
    }

    let t = 5;
    const timer = setInterval(() => {
      t--;
      setCountdown(t);
      if (t <= 0) {
        clearInterval(timer);
        setWatching(false);
        setUnlocked(true);
        if (auction.winnerId) {
          trackAdEvent('click', auction.winnerId, 'reward_interstitial');
          trackAdEvent('conversion', auction.winnerId, 'reward_interstitial');
        }
      }
    }, 1000);
  }, []);

  const showBlur = adMode && !unlocked;

  return (
    <motion.section variants={item}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
        <Lightbulb className="text-emerald-400" /> 배운 점 (Key Learnings)
      </h2>
      <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8">
        <div className={`relative p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 ${showBlur ? 'overflow-hidden' : ''}`}>
          {showBlur && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-2xl">
              {watching ? (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500 flex items-center justify-center mb-2 mx-auto">
                    <span className="text-xl font-mono font-bold text-amber-400">{countdown}</span>
                  </div>
                  <p className="text-xs text-white/50">리워드 광고 시청 중...</p>
                </div>
              ) : (
                <button onClick={startRewardAd} className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono hover:bg-amber-500/30 transition-colors cursor-pointer">
                  <Play className="w-3.5 h-3.5" />
                  광고 시청 후 잠금해제
                </button>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-white/25 font-mono">
                <Lock className="w-3 h-3" /> Reward Ad
              </div>
            </div>
          )}
          <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" /> 핵심 인사이트
            {adMode && unlocked && <Unlock className="w-3.5 h-3.5 text-amber-400 ml-1" />}
          </h4>
          <p className="text-emerald-100/80 leading-relaxed">{details.learnings.highlight}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4">세부 인사이트</h3>
          <ul className="space-y-3">
            {details.learnings.points.map((point: string, i: number) => {
              const [title, desc] = point.split(': ');
              return (
                <li key={i} className="flex items-start gap-3 text-zinc-400">
                  <span className="text-emerald-400 mt-1">•</span>
                  <span>
                    <strong className="text-zinc-200">{title}:</strong> {desc || ''}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
