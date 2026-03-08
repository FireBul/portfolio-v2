import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Search, Gift } from 'lucide-react';
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

      {/* 광고 PM 역량 */}
      <motion.div variants={item} className="py-24 border-t border-white/10">
        <h2 className="text-3xl font-bold tracking-tight mb-6">광고 PM 역량</h2>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-2xl">
          디스플레이·검색·리워드 광고 상품의 기획·구현 경험과 DSP/SSP/MMP 플랫폼 활용 및 연동 경험을 보유하고 있습니다.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Megaphone className="w-6 h-6" />, title: '디스플레이 & DSP', desc: 'A/B 테스트 기반 지면 최적화, RTB Second-Price + Quality Score 과금, 판매자 광고센터 ADMIN 총괄 기획' },
            { icon: <Search className="w-6 h-6" />, title: '검색 & SSP 연동', desc: 'Kafka 기반 광고 데이터 파이프라인, 외부 매체(SSP) 연동, ROAS/CTR 정밀 측정 체계 구축' },
            { icon: <Gift className="w-6 h-6" />, title: '리워드 & CRM', desc: 'CPS 리워드 모델 0→1 기획, Braze×GA4 개인화 광고, MMP 어트리뷰션, CPC 과금 시나리오' },
          ].map((card) => (
            <div key={card.title} className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-emerald-500/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">{card.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

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
