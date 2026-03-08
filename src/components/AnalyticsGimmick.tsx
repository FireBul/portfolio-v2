import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, FileText, Clock, ArrowDown, ChevronUp, ChevronDown, CheckCircle2, Sparkles } from 'lucide-react';
import { triggerMessage } from './InAppMessages';
import { MarkovEngine, getPageState, PageState, getPageName } from '../utils/markov';
import { interpretEngagement, interpretMarkov, GEMINI_DISPLAY } from '../utils/geminiInsights';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const AnalyticsGimmick: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [pageviews, setPageviews] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [detailViews, setDetailViews] = useState(0);
  const [score, setScore] = useState(0);

  const [predictions, setPredictions] = useState<{state: PageState, prob: number}[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [showHitAnim, setShowHitAnim] = useState(false);

  const [engagementInsight, setEngagementInsight] = useState<string | null>(null);
  const [markovInsight, setMarkovInsight] = useState<string | null>(null);
  const engagementMilestonesRef = useRef<Set<number>>(new Set());

  const location = useLocation();
  const engineRef = useRef(new MarkovEngine());
  const prevPageRef = useRef<PageState | null>(null);
  const predictedNextRef = useRef<PageState | null>(null);

  // Triggers tracking to avoid spam
  const triggers = useRef({
    firstVisit: false,
    clicks5: false,
    detail2: false,
    scroll75: false,
    time120: false,
    contact: false,
  });

  // 1. Time Tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1;
        if (newTime >= 120 && !triggers.current.time120) {
          triggers.current.time120 = true;
          triggerMessage('체류시간 2분 돌파! Engagement Score가 실시간으로 반영되고 있습니다.', 'Growth Signal');
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      
      setMaxScroll(prev => {
        const newMax = Math.max(prev, scrollPercent);
        if (newMax >= 75 && !triggers.current.scroll75) {
          triggers.current.scroll75 = true;
          triggerMessage('콘텐츠를 75% 이상 읽으셨네요. 콘텐츠 최적화와 리텐션 설계에 강점이 있습니다.', 'Scroll Depth');
        }
        return newMax;
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Click Tracking
  useEffect(() => {
    const handleClick = () => {
      setClicks(prev => {
        const newCount = prev + 1;
        if (newCount === 5 && !triggers.current.clicks5) {
          triggers.current.clicks5 = true;
          triggerMessage('벌써 5번 클릭하셨네요! 유저 행동 데이터를 기반으로 퍼널을 설계하는 역량이 있습니다.', 'Engagement');
        }
        return newCount;
      });
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // 4. Route Changes & Markov Logic
  useEffect(() => {
    const currentState = getPageState(location.pathname);

    // Store visited pages for cross-component access (Contact Gemini)
    if (!sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', String(Date.now()));
    }
    const pages = JSON.parse(sessionStorage.getItem('visited_pages') || '[]');
    pages.push(location.pathname);
    sessionStorage.setItem('visited_pages', JSON.stringify(pages));

    // Pageview tracking
    setPageviews(prev => prev + 1);
    
    // Detail view tracking
    if (currentState === 'detail') {
      setDetailViews(prev => {
        const newCount = prev + 1;
        if (newCount === 2 && !triggers.current.detail2) {
          triggers.current.detail2 = true;
          triggerMessage('프로젝트 상세 페이지를 2번 이상 보셨습니다. 상위 20%의 높은 참여도입니다!', 'Behavioral Insight');
        }
        return newCount;
      });
    }

    // Contact page trigger
    if (currentState === 'contact' && !triggers.current.contact) {
      triggers.current.contact = true;
      triggerMessage('연락처 페이지 도달! 퍼널의 최종 전환율(Conversion Rate)을 분석할 준비가 되었습니다.', 'Conversion');
    }

    // Markov Prediction Logic
    if (prevPageRef.current) {
      const isHit = predictedNextRef.current === currentState;
      engineRef.current.recordHit(isHit);
      engineRef.current.update(prevPageRef.current, currentState);
      
      if (isHit) {
        setShowHitAnim(true);
        setTimeout(() => setShowHitAnim(false), 2000);
        triggerMessage('다음 클릭 예측 적중! Markov Chain과 베이지안 업데이트를 활용한 예측 엔진이 작동 중입니다.', 'Prediction');
      }
    } else {
      // First visit
      if (!triggers.current.firstVisit) {
        triggers.current.firstVisit = true;
        setTimeout(() => {
          triggerMessage('실시간 행동 분석 작동 중. 당신의 탐색 패턴을 분석하고 다음 행동을 예측합니다.', 'Analytics Demo');
        }, 1500);
      }
    }

    // Get new predictions
    const newPredictions = engineRef.current.getPredictions(currentState);
    setPredictions(newPredictions);
    setAccuracy(engineRef.current.getAccuracy());
    
    if (newPredictions.length > 0) {
      predictedNextRef.current = newPredictions[0].state;
    }
    prevPageRef.current = currentState;

  }, [location.pathname]);

  // 5. Engagement Score Calculation
  useEffect(() => {
    const clickScore = Math.min(clicks * 1, 25);
    const pvScore = Math.min(pageviews * 5, 30);
    const timeScore = Math.min(timeSpent / 6, 20); // 120s = 20pt
    const scrollScore = Math.min(maxScroll / 6.66, 15); // 100% = 15pt
    const detailScore = Math.min(detailViews * 5, 10); // 2 views = 10pt
    
    const newScore = Math.round(clickScore + pvScore + timeScore + scrollScore + detailScore);
    setScore(newScore);
    // Expose for cross-component access
    (window as any).__dataLayer = { ...(window as any).__dataLayer, engagementScore: newScore };
  }, [clicks, pageviews, timeSpent, maxScroll, detailViews]);

  // 6. Gemini Engagement Insight (at milestones 25, 50, 75)
  useEffect(() => {
    const milestone = score >= 75 ? 75 : score >= 50 ? 50 : score >= 25 ? 25 : 0;
    if (milestone > 0 && !engagementMilestonesRef.current.has(milestone)) {
      engagementMilestonesRef.current.add(milestone);
      interpretEngagement({ clicks, pageviews, timeSpent, maxScroll, detailViews, score }).then(insight => {
        if (insight) {
          setEngagementInsight(insight);
          triggerMessage(insight, `Gemini Insight`);
        }
      });
    }
  }, [score, clicks, pageviews, timeSpent, maxScroll, detailViews]);

  // 7. Gemini Markov Insight (when accuracy >= 60%)
  useEffect(() => {
    const engine = engineRef.current;
    if (accuracy >= 60 && engine.totalPredictions >= 3 && !markovInsight) {
      interpretMarkov({
        predictions: predictions.slice(0, 3).map(p => ({ page: getPageName(p.state), probability: p.prob })),
        accuracy,
        totalPredictions: engine.totalPredictions,
        hits: engine.correctPredictions,
      }).then(insight => {
        if (insight) setMarkovInsight(insight);
      });
    }
  }, [accuracy, predictions, markovInsight]);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start pointer-events-none">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-5 rounded-3xl shadow-2xl w-80 mb-4 pointer-events-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-sm tracking-tight">Real-time Analytics</h3>
              <button onClick={() => setIsExpanded(false)} className="text-slate-400 hover:text-white transition-colors">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-2 flex flex-col items-center justify-center">
                <MousePointer2 className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-white font-mono font-bold text-sm">{clicks}</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-2 flex flex-col items-center justify-center">
                <FileText className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-white font-mono font-bold text-sm">{pageviews}</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-2 flex flex-col items-center justify-center">
                <Clock className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-white font-mono font-bold text-sm">{formatTime(timeSpent)}</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-2 flex flex-col items-center justify-center">
                <ArrowDown className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-white font-mono font-bold text-sm">{maxScroll}%</span>
              </div>
            </div>

            {/* Engagement Score */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Engagement Score</span>
                <span className="text-emerald-400 font-mono font-bold text-lg leading-none">{score} <span className="text-xs text-emerald-400/70">/ 100</span></span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ type: 'spring', bounce: 0 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono">
                <span>Click(25)</span>
                <span>PV(30)</span>
                <span>Time(20)</span>
                <span>Scroll(15)</span>
                <span>Detail(10)</span>
              </div>
            </div>

            {/* Gemini Engagement Insight */}
            {engagementInsight && (
              <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{GEMINI_DISPLAY}</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">{engagementInsight}</p>
                <p className="text-[9px] text-white/20 mt-1.5 font-mono">Powered by Gemini — 실시간 행동 분석</p>
              </div>
            )}

            {/* Next Click Prediction */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Next Click Prediction</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  Accuracy: {accuracy}%
                </span>
              </div>
              <div className="space-y-2 relative">
                {showHitAnim && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -right-2 -top-2 z-10 text-emerald-400 bg-slate-900 rounded-full"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                )}
                {predictions.slice(0, 3).map((pred, i) => (
                  <div key={pred.state} className="relative h-7 bg-slate-800/50 rounded-lg overflow-hidden flex items-center px-3">
                    <motion.div 
                      className={`absolute left-0 top-0 bottom-0 ${i === 0 ? 'bg-indigo-500/30' : 'bg-slate-700/30'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pred.prob * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="relative z-10 flex justify-between w-full items-center">
                      <span className="text-xs text-slate-200 font-medium">{getPageName(pred.state)}</span>
                      <span className="text-xs text-slate-400 font-mono">{Math.round(pred.prob * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gemini Markov Insight */}
              {markovInsight && (
                <div className="mt-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-[9px] font-mono text-amber-400 font-bold">{GEMINI_DISPLAY} 예측 해석</span>
                  </div>
                  <p className="text-[10px] text-white/60 leading-relaxed">{markovInsight}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Pill */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setIsExpanded(true)}
            className="bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-300 px-4 py-2.5 rounded-full shadow-lg flex items-center gap-3 font-mono text-xs hover:bg-slate-800 transition-colors pointer-events-auto"
          >
            <span className="flex items-center gap-1"><MousePointer2 className="w-3.5 h-3.5" /> {clicks}</span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {pageviews}</span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatTime(timeSpent)}</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400 font-bold">{score}pt</span>
            <ChevronUp className="w-4 h-4 ml-1 text-slate-500" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
