import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X, Loader2 } from 'lucide-react';
import { trackABEvent, fetchABStats, type ABStats } from '../utils/supabase';

export type Group = 'A' | 'B';

export const VARIANTS: Record<Group, string> = {
  A: '프로젝트 보기',
  B: '어떤 일을 했는지 확인하기 →',
};

export const getOrAssignGroup = (): Group => {
  const stored = localStorage.getItem('eng_ab_group');
  if (stored === 'A' || stored === 'B') return stored;
  const group: Group = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem('eng_ab_group', group);
  localStorage.setItem('eng_ab_assigned_at', String(Date.now()));
  // 신규 배정 → Supabase에 기록
  trackABEvent(group, 'assignment');
  return group;
};

export const ABTestReveal: React.FC = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [stats, setStats] = useState<ABStats | null>(null);
  const [loading, setLoading] = useState(false);
  const group = useMemo(getOrAssignGroup, []);

  // Show badge after 4s
  useEffect(() => {
    const timer = setTimeout(() => setBadgeVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // 패널 열릴 때 실시간 통계 fetch (lazy)
  useEffect(() => {
    if (!panelOpen) return;
    let cancelled = false;
    setLoading(true);
    fetchABStats().then((result) => {
      if (!cancelled) {
        setStats(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [panelOpen]);

  return (
    <>
      {/* Floating Badge */}
      <AnimatePresence>
        {badgeVisible && !panelOpen && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => setPanelOpen(true)}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[9080] flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium
              bg-black/85 backdrop-blur-xl text-zinc-300 border border-white/10 hover:bg-black/95 hover:text-white shadow-lg cursor-pointer transition-all"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
            A/B 실험 참여 중 ·{' '}
            <span className="font-bold text-white">Group {group}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Results Panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[9081] w-[min(380px,calc(100vw-40px))] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black/50 px-4 py-3 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-400" />
                <span className="text-white font-bold text-sm">라이브 A/B 테스트 결과</span>
              </div>
              <button onClick={() => setPanelOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Group Assignment */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    group === 'A'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {group}
                </span>
                <span className="text-zinc-400 text-sm">
                  당신은 <span className="text-white font-medium">Group {group}</span>에 배정되었습니다
                </span>
              </div>

              {/* Variants */}
              <div className="space-y-2">
                {(['A', 'B'] as Group[]).map((g) => (
                  <div
                    key={g}
                    className="flex items-center gap-2 py-2 border-b border-white/5 last:border-0"
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        g === 'A'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}
                    >
                      {g}
                    </span>
                    <span className="text-zinc-300 text-xs flex-1">"{VARIANTS[g]}"</span>
                    {g === group && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                        YOU
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Result Bars — 실시간 Supabase 데이터 */}
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-4 text-zinc-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  통계 로딩 중...
                </div>
              ) : stats ? (
                <>
                  <div className="space-y-2">
                    {(['A', 'B'] as Group[]).map((g) => {
                      const s = g === 'A' ? stats.a : stats.b;
                      return (
                        <div key={g} className="flex items-center gap-2">
                          <span className="w-4 text-xs font-bold text-zinc-500">{g}</span>
                          <div className="flex-1 h-5 bg-white/5 rounded-md overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${s.rate}%` }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                              className={`h-full rounded-md ${
                                g === 'A'
                                  ? 'bg-gradient-to-r from-blue-600 to-blue-500'
                                  : 'bg-gradient-to-r from-purple-600 to-purple-500'
                              }`}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-white">
                              {s.rate}%
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 w-16 text-right">
                            {s.clicks}/{s.visitors}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Meta */}
                  <p className="text-center text-zinc-500 text-[11px]">
                    총 {stats.total}명 · 현재 리더:{' '}
                    <span className="text-white font-medium">Group {stats.winner}</span>
                    {stats.winner === group && ' (당신의 그룹!)'} · 유의도: {stats.significance}
                  </p>
                </>
              ) : (
                <div className="text-center text-zinc-500 text-sm py-4">
                  통계를 불러올 수 없습니다 (오프라인)
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white/[0.02] border-t border-white/5 px-4 py-2.5 text-center">
              <p className="text-zinc-600 text-[10px]">
                CTA 버튼 문구를 실제 A/B 테스트 중입니다 · Supabase 실시간 추적
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
