import React from 'react';
import { motion } from 'framer-motion';
import { CORE_COMPETENCIES } from '../constants';

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

export function About() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto px-6 py-24"
    >
      <div className="flex flex-col md:flex-row gap-12 items-start mb-16 md:mb-24">
        <motion.div variants={item} className="flex-1">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
            소개
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            데이터 기반 제품 전략으로 광고/커머스 성과를 만든 PM입니다.
          </p>
        </motion.div>
        <motion.div variants={item} className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border-4 border-white/10 glass-panel">
          <img 
            src="https://firebul.github.io/portfolio/assets/images/profile.jpg" 
            alt="최원혁 프로필" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 md:gap-24 mb-32">
        <motion.div variants={item} className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">Core Competence</h2>
          <div className="space-y-12">
            {CORE_COMPETENCIES.map((comp) => (
              <div key={comp.title} className="space-y-4">
                <h3 className="text-xl font-bold text-emerald-400">{comp.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{comp.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-8">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-panel">
            <img 
              src="https://firebul.github.io/portfolio/assets/images/gallery/work-environment.jpg" 
              alt="Work Environment" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="py-24 border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">현재 고도화 방향</h2>
            <p className="text-zinc-400 leading-relaxed mb-8">
              면접관이 20초 안에 이해하게, 프로젝트는 숫자로 설명, 프라이빗 프로젝트는 안전하게 공개, 문의까지 이어지는 흐름을 설계합니다.
            </p>
          </div>
          <div className="space-y-8">
            {[
              { title: 'AI 트레이딩 엔진 (ML 운영/자동화)', desc: '모델 실험부터 운영 검증까지 연결되는 파이프라인을 구축·운영했습니다. 핵심은 실험 속도보다 안정성 게이트를 지키는 운영 체계입니다.' },
              { title: 'Teflon Inspection Automation', desc: '비전 모델 기반 검사 자동화 프로젝트로, 현장 배포 관점(카메라/운영 UI/업그레이드)까지 고려해 시스템을 고도화했습니다.' },
              { title: 'Universal Architecture Lab', desc: '대규모 아이디어/아티팩트 생성·분류·우선순위화 실험을 통해, 의사결정에 바로 쓰일 수 있는 구조화 방법을 검증했습니다.' }
            ].map((proj) => (
              <div key={proj.title} className="p-8 rounded-3xl glass-panel">
                <h3 className="text-xl font-bold mb-4 text-emerald-400">{proj.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{proj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
