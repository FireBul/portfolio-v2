import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Zap, Target, Handshake } from 'lucide-react';

type PersonaKey = 'researcher' | 'scanner' | 'hunter' | 'decider';

interface PersonaInfo {
  name: string;
  emoji: React.ReactNode;
  desc: string;
  traits: string[];
  match: string;
  color: string;
}

const PERSONAS: Record<PersonaKey, PersonaInfo> = {
  researcher: {
    name: '꼼꼼한 리서처',
    emoji: <Search className="w-7 h-7 text-blue-400" />,
    desc: '콘텐츠를 깊이 읽고, 여러 페이지를 꼼꼼히 비교합니다.',
    traits: ['느린 스크롤', '긴 체류시간', '넓은 탐색 범위'],
    match: '시니어 리크루터 · 기술 리드',
    color: 'border-blue-500',
  },
  scanner: {
    name: '빠른 스캐너',
    emoji: <Zap className="w-7 h-7 text-amber-400" />,
    desc: '핵심만 빠르게 파악하고 다음으로 넘어갑니다.',
    traits: ['빠른 스크롤', '짧은 체류', '다수 페이지 방문'],
    match: 'HR 매니저 · 헤드헌터',
    color: 'border-amber-500',
  },
  hunter: {
    name: '프로젝트 헌터',
    emoji: <Target className="w-7 h-7 text-purple-400" />,
    desc: '프로젝트 상세 페이지에 집중하며 실행력을 평가합니다.',
    traits: ['상세 페이지 집중', '적절한 속도', '활발한 클릭'],
    match: 'PM 채용 매니저 · CTO',
    color: 'border-purple-500',
  },
  decider: {
    name: '의사결정자',
    emoji: <Handshake className="w-7 h-7 text-emerald-400" />,
    desc: '핵심만 확인하고 빠르게 연락 단계로 이동합니다.',
    traits: ['연락처 도달', '집중된 경로', '효율적 탐색'],
    match: 'C-Level · 사업 파트너',
    color: 'border-emerald-500',
  },
};

export const BehavioralPersona: React.FC = () => {
  const [persona, setPersona] = useState<(PersonaInfo & { confidence: number }) | null>(null);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  const scrollSpeedsRef = useRef<number[]>([]);
  const lastScrollRef = useRef({ y: window.scrollY, t: Date.now() });
  const pagesVisitedRef = useRef<string[]>([]);
  const clickCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const classifiedRef = useRef(false);

  // Track scroll speed
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const dt = now - lastScrollRef.current.t;
      if (dt > 100 && dt < 2000) {
        const dy = Math.abs(window.scrollY - lastScrollRef.current.y);
        const speed = (dy / dt) * 1000;
        scrollSpeedsRef.current.push(speed);
        if (scrollSpeedsRef.current.length > 100) scrollSpeedsRef.current.shift();
      }
      lastScrollRef.current = { y: window.scrollY, t: now };
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page visits
  useEffect(() => {
    const page = location.pathname;
    const pages = pagesVisitedRef.current;
    if (!pages.length || pages[pages.length - 1] !== page) {
      pages.push(page);
    }
  }, [location.pathname]);

  // Track clicks
  useEffect(() => {
    const handleClick = () => { clickCountRef.current++; };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Classify function
  const classify = useCallback(() => {
    if (classifiedRef.current) return;

    const pages = pagesVisitedRef.current;
    const clicks = clickCountRef.current;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const uniquePages = [...new Set(pages)].length;
    const detailViews = pages.filter((p) => p.startsWith('/projects/')).length;
    const avgScrollSpeed =
      scrollSpeedsRef.current.length > 5
        ? scrollSpeedsRef.current.reduce((a, b) => a + b, 0) / scrollSpeedsRef.current.length
        : 500;
    const hasContact = pages.includes('/contact');
    const dwellPerPage = uniquePages > 0 ? elapsed / uniquePages : elapsed;

    const scores: Record<PersonaKey, number> = {
      researcher: 0,
      scanner: 0,
      hunter: 0,
      decider: 0,
    };

    // Researcher: slow scroll, long dwell, many pages
    if (avgScrollSpeed < 400) scores.researcher += 3;
    if (dwellPerPage > 40) scores.researcher += 3;
    if (uniquePages >= 4) scores.researcher += 2;
    if (detailViews >= 2) scores.researcher += 2;

    // Scanner: fast scroll, short dwell
    if (avgScrollSpeed > 800) scores.scanner += 3;
    if (dwellPerPage < 20) scores.scanner += 3;
    if (uniquePages >= 3 && elapsed < 60) scores.scanner += 2;
    if (clicks > 8 && elapsed < 90) scores.scanner += 2;

    // Hunter: detail page focus
    if (detailViews >= 2) scores.hunter += 3;
    if (detailViews > uniquePages * 0.4) scores.hunter += 3;
    if (avgScrollSpeed > 300 && avgScrollSpeed < 700) scores.hunter += 1;
    if (clicks >= 5) scores.hunter += 1;

    // Decider: quick to contact
    if (hasContact) scores.decider += 4;
    if (uniquePages <= 4 && hasContact) scores.decider += 3;
    if (elapsed < 180 && hasContact) scores.decider += 2;
    if (detailViews >= 1 && detailViews <= 2) scores.decider += 1;

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];
    if (top[1] < 3) return;

    const info = PERSONAS[top[0] as PersonaKey];
    const confidence = Math.min(Math.round((top[1] / 10) * 100), 95);

    classifiedRef.current = true;
    setPersona({ ...info, confidence });
    setVisible(true);

    // Auto-hide after 15s
    setTimeout(() => setVisible(false), 15000);
  }, []);

  // Check classification periodically after 25s
  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        classify();
        if (classifiedRef.current) clearInterval(interval);
      }, 5000);
      classify();
      return () => clearInterval(interval);
    }, 25000);
    return () => clearTimeout(timeout);
  }, [classify]);

  if (!persona) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`fixed bottom-16 left-5 z-[9010] w-72 bg-zinc-900/95 backdrop-blur-xl border border-white/10 ${persona.color} border-t-2 rounded-2xl shadow-2xl overflow-hidden`}
        >
          {/* Close */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Head */}
          <div className="p-4 pb-2">
            <div className="mb-2">{persona.emoji}</div>
            <h4 className="text-white font-bold text-sm">당신의 브라우징 유형</h4>
            <p className="text-white font-bold text-lg">{persona.name}</p>
            <p className="text-zinc-500 text-xs mt-1">
              신뢰도 {persona.confidence}% · 실시간 행동 기반 분류
            </p>
          </div>

          {/* Body */}
          <div className="px-4 pb-3">
            <p className="text-zinc-400 text-xs leading-relaxed mb-3">{persona.desc}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {persona.traits.map((t) => (
                <span
                  key={t}
                  className="bg-white/5 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-zinc-600 text-[10px]">
              비슷한 프로필: <span className="text-zinc-400">{persona.match}</span>
            </p>
          </div>

          {/* Footer */}
          <div className="bg-white/[0.02] border-t border-white/5 px-4 py-2 text-center">
            <p className="text-zinc-600 text-[10px]">
              스크롤 속도 · 클릭 패턴 · 체류 분포 기반 세그먼테이션
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
