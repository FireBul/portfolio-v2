import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Cookie,
  Eye,
  Megaphone,
  BarChart3,
  Gavel,
  Play,
  Pause,
  Plus,
  RotateCcw,
  ChevronDown,
  X,
  Check,
  ShieldCheck,
  User,
  Server,
  LineChart,
  Sparkles,
} from 'lucide-react';
import { interpretSdkPipeline, interpretAuction, GEMINI_DISPLAY } from '../utils/geminiInsights';
import {
  type SdkStep,
  type SdkPipelineLog,
  type ConsentLevel,
  type UserProfile,
  type UserSegment,
  getSdkState,
  grantConsent,
  restoreConsent,
  runPipeline,
  onStepChange,
  resetSdk,
} from '../data/adSdk';
import {
  initEngine,
  resetEngine,
  getCampaigns,
  addCampaign,
  toggleCampaign,
  runAuction,
  getDspStats,
  getSspStats,
  getMmpStats,
  getAuctionHistory,
  type Campaign,
  type AuctionResult,
  type AdSlotType,
} from '../data/adEngine';

// ── AdMode Context ──

interface AdModeContextType {
  adMode: boolean;
  setAdMode: (v: boolean) => void;
}

export const AdModeContext = createContext<AdModeContextType>({
  adMode: false,
  setAdMode: () => {},
});

export function useAdMode() {
  return useContext(AdModeContext);
}

export function AdModeProvider({ children }: { children: React.ReactNode }) {
  const [adMode, setAdMode] = useState(() => {
    return localStorage.getItem('wh_ad_mode') === 'on';
  });

  useEffect(() => {
    localStorage.setItem('wh_ad_mode', adMode ? 'on' : 'off');
    if (adMode) {
      initEngine();
      restoreConsent();
    }
  }, [adMode]);

  return (
    <AdModeContext.Provider value={{ adMode, setAdMode }}>
      {children}
    </AdModeContext.Provider>
  );
}

// ── Main Widget ──

export function AdPlatformDemo() {
  const { adMode, setAdMode } = useAdMode();
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [pipelineLogs, setPipelineLogs] = useState<SdkPipelineLog[]>([]);
  const [currentStep, setCurrentStep] = useState<SdkStep>('idle');
  const [pipelineComplete, setPipelineComplete] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // 광고 모드 토글 처리
  const handleToggle = useCallback(() => {
    if (!adMode) {
      setAdMode(true);
      initEngine();
      const consent = restoreConsent();
      if (consent === 'none') {
        setShowCookieBanner(true);
      } else {
        // 이미 동의한 상태 → 바로 파이프라인
        startPipeline();
      }
    } else {
      setAdMode(false);
      setShowDashboard(false);
      setShowPipeline(false);
      setPipelineComplete(false);
    }
  }, [adMode, setAdMode]);

  // 쿠키 동의 처리
  const handleConsent = useCallback((level: ConsentLevel) => {
    grantConsent(level);
    setShowCookieBanner(false);
    if (level !== 'none') {
      startPipeline();
    } else {
      // 거부 — 광고 모드 ON이지만 개인화 없음
      setPipelineComplete(true);
    }
  }, []);

  // SDK 파이프라인 시작
  const startPipeline = useCallback(async () => {
    setPipelineLogs([]);
    setCurrentStep('idle');
    setShowPipeline(true);
    setPipelineComplete(false);

    const unsub = onStepChange((_step, log) => {
      setCurrentStep(log.step);
      setPipelineLogs((prev) => [...prev, log]);
    });

    const result = await runPipeline();
    setProfile(result);
    setPipelineComplete(true);
    unsub();

    // 3초 후 자동으로 파이프라인 패널 축소
    setTimeout(() => setShowPipeline(false), 3000);
  }, []);

  return (
    <>
      {/* 광고 모드 토글 — 우측 상단 고정 */}
      <AdToggleButton adMode={adMode} onToggle={handleToggle} />

      {/* 쿠키 동의 배너 */}
      <AnimatePresence>
        {showCookieBanner && (
          <CookieBanner onConsent={handleConsent} />
        )}
      </AnimatePresence>

      {/* SDK 파이프라인 시각화 */}
      <AnimatePresence>
        {showPipeline && (
          <PipelinePanel
            logs={pipelineLogs}
            currentStep={currentStep}
            complete={pipelineComplete}
            onClose={() => setShowPipeline(false)}
          />
        )}
      </AnimatePresence>

      {/* AD LAB 플로팅 배지 */}
      <AnimatePresence>
        {adMode && pipelineComplete && !showDashboard && !showPipeline && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setShowDashboard(true)}
            className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm text-amber-400 text-xs font-mono hover:bg-amber-500/30 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            AD LAB
          </motion.button>
        )}
      </AnimatePresence>

      {/* AD LAB 대시보드 */}
      <AnimatePresence>
        {showDashboard && (
          <DashboardPanel
            profile={profile}
            pipelineLogs={pipelineLogs}
            onClose={() => setShowDashboard(false)}
            onRerunPipeline={() => {
              setShowDashboard(false);
              startPipeline();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Toggle Button ──

function AdToggleButton({ adMode, onToggle }: { adMode: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-3 right-4 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors cursor-pointer"
      whileTap={{ scale: 0.95 }}
    >
      <div className={`w-8 h-4 rounded-full transition-colors relative ${adMode ? 'bg-amber-500' : 'bg-white/20'}`}>
        <motion.div
          className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white"
          animate={{ x: adMode ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      <span className={`text-[10px] font-mono tracking-wider ${adMode ? 'text-amber-400' : 'text-white/40'}`}>
        AD {adMode ? 'ON' : 'OFF'}
      </span>
    </motion.button>
  );
}

// ── Cookie Banner ──

function CookieBanner({ onConsent }: { onConsent: (level: ConsentLevel) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-x-0 bottom-0 z-[70] p-4"
    >
      <div className="max-w-lg mx-auto rounded-xl border border-white/10 bg-black/90 backdrop-blur-md p-5">
        <div className="flex items-center gap-2 mb-3">
          <Cookie className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-medium text-white/90">광고 체험을 위한 데이터 수집 동의</h3>
        </div>

        <p className="text-xs text-white/50 mb-2 leading-relaxed">
          수집 항목: 브라우저, OS, 화면 크기, 언어, 유입 경로<br />
          용도: 개인화 광고 추천 시뮬레이션
        </p>

        <div className="flex items-center gap-2 mb-4 px-2 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500/60 shrink-0" />
          <p className="text-[10px] text-amber-500/70">
            광고 PM 역량 데모입니다. 모든 데이터는 localStorage에만 저장되며 외부 전송 없음
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onConsent('full')}
            className="flex-1 py-2 rounded-lg bg-amber-500 text-black text-xs font-medium hover:bg-amber-400 transition-colors cursor-pointer"
          >
            모두 수락
          </button>
          <button
            onClick={() => onConsent('essential')}
            className="flex-1 py-2 rounded-lg bg-white/10 text-white/70 text-xs font-medium hover:bg-white/20 transition-colors cursor-pointer"
          >
            필수만
          </button>
          <button
            onClick={() => onConsent('none')}
            className="flex-1 py-2 rounded-lg bg-white/5 text-white/40 text-xs font-medium hover:bg-white/10 transition-colors cursor-pointer"
          >
            거부
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Pipeline Panel ──

const STEP_LABELS: Record<SdkStep, string> = {
  idle: '대기',
  init: 'SDK Init',
  cookie_check: 'Cookie Check',
  collect: 'Data Collect',
  profile: 'User Profiling',
  ad_request: 'Ad Request',
  bidding: 'RTB Bidding',
  serve: 'Ad Serve',
  track: 'Impression Track',
};

const STEP_ORDER: SdkStep[] = ['init', 'cookie_check', 'collect', 'profile', 'ad_request', 'bidding', 'serve', 'track'];

function PipelinePanel({
  logs,
  currentStep,
  complete,
  onClose,
}: {
  logs: SdkPipelineLog[];
  currentStep: SdkStep;
  complete: boolean;
  onClose: () => void;
}) {
  const completedSteps = new Set(logs.map((l) => l.step));
  const logMap = Object.fromEntries(logs.map((l) => [l.step, l]));

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-16 right-4 z-[65] w-80 max-h-[80vh] overflow-y-auto rounded-xl border border-white/10 bg-black/90 backdrop-blur-md"
    >
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-mono text-amber-400">WH Ad SDK v1.0</span>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        {STEP_ORDER.map((step, i) => {
          const done = completedSteps.has(step);
          const active = currentStep === step && !done;
          const waiting = !done && !active;
          const log = logMap[step];

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-lg px-3 py-2 text-xs ${
                done
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : active
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'bg-white/5 border border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white/30 font-mono">
                    {done ? '✅' : active ? '⏳' : `${i + 1}`}
                  </span>
                  <span className={done ? 'text-emerald-400' : active ? 'text-amber-400' : 'text-white/30'}>
                    {STEP_LABELS[step]}
                  </span>
                </div>
                {log && <span className="text-white/20 font-mono">{log.duration}ms</span>}
              </div>

              {/* Detail */}
              {log && (
                <p className="mt-1 text-white/40 pl-6">{log.detail}</p>
              )}

              {/* Data collect 세부 정보 */}
              {log?.step === 'collect' && log.data && (
                <div className="mt-1 pl-6 space-y-0.5 text-[10px] text-white/30 font-mono">
                  {Object.entries(log.data).map(([k, v]) => (
                    <div key={k}>├ {k}: {String(v)}</div>
                  ))}
                </div>
              )}

              {/* Profile 세부 정보 */}
              {log?.step === 'profile' && log.data && (
                <div className="mt-1 pl-6 text-[10px] font-mono">
                  <span className="text-amber-400/70">세그먼트: {String(log.data.segment)}</span>
                  <span className="text-white/25 ml-2">적합도: {String(log.data.relevance)}/100</span>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Total */}
        {complete && logs.length > 0 && (
          <div className="border-t border-white/5 pt-2 mt-2 text-[10px] font-mono text-white/30 text-center">
            Total: {logs.reduce((s, l) => s + l.duration, 0).toLocaleString()}ms
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Dashboard Panel ──

type DashboardTab = 'sdk' | 'dsp' | 'ssp' | 'mmp' | 'rtb';

function DashboardPanel({
  profile,
  pipelineLogs,
  onClose,
  onRerunPipeline,
}: {
  profile: UserProfile | null;
  pipelineLogs: SdkPipelineLog[];
  onClose: () => void;
  onRerunPipeline: () => void;
}) {
  const [tab, setTab] = useState<DashboardTab>('sdk');
  const panelRef = useRef<HTMLDivElement>(null);

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'sdk', label: 'SDK', icon: <Zap className="w-3 h-3" /> },
    { id: 'dsp', label: 'DSP', icon: <Megaphone className="w-3 h-3" /> },
    { id: 'ssp', label: 'SSP', icon: <Server className="w-3 h-3" /> },
    { id: 'mmp', label: 'MMP', icon: <LineChart className="w-3 h-3" /> },
    { id: 'rtb', label: 'RTB', icon: <Gavel className="w-3 h-3" /> },
  ];

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl max-h-[70vh] rounded-xl border border-white/10 bg-black/95 backdrop-blur-md flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-mono text-amber-400 font-medium">AD LAB</span>
          <span className="text-[10px] text-white/30 font-mono">Mini Ad Platform</span>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 py-2 border-b border-white/5 shrink-0 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
              tab === t.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'sdk' && <SdkTab profile={profile} logs={pipelineLogs} onRerun={onRerunPipeline} />}
        {tab === 'dsp' && <DspTab />}
        {tab === 'ssp' && <SspTab />}
        {tab === 'mmp' && <MmpTab />}
        {tab === 'rtb' && <RtbTab profile={profile} />}
      </div>
    </motion.div>
  );
}

// ── SDK Tab ──

function SdkTab({
  profile,
  logs,
  onRerun,
}: {
  profile: UserProfile | null;
  logs: SdkPipelineLog[];
  onRerun: () => void;
}) {
  const maxDuration = Math.max(...logs.map((l) => l.duration), 1);
  const [sdkInsight, setSdkInsight] = useState<string | null>(null);
  const insightFetchedRef = useRef(false);

  useEffect(() => {
    if (profile && logs.length > 0 && !insightFetchedRef.current) {
      insightFetchedRef.current = true;
      interpretSdkPipeline({
        segment: profile.segment,
        browser: profile.browser,
        os: profile.os,
        referrer: profile.referrer,
        relevanceScore: profile.adRelevanceScore,
        totalPipelineTime: logs.reduce((s, l) => s + l.duration, 0),
        recommendedProjects: profile.interests,
      }).then(insight => {
        if (insight) setSdkInsight(insight);
      });
    }
  }, [profile, logs]);

  return (
    <div className="space-y-4">
      {/* Gemini SDK Insight */}
      {sdkInsight && (
        <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono text-amber-400 font-bold">{GEMINI_DISPLAY} 파이프라인 분석</span>
          </div>
          <p className="text-[11px] text-white/70 leading-relaxed">{sdkInsight}</p>
          <p className="text-[9px] text-white/20 mt-1.5 font-mono">{GEMINI_DISPLAY}가 실시간 분석했습니다</p>
        </div>
      )}

      {/* User Profile Card */}
      {profile && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-mono text-white/70">사용자 프로필</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono">
            <div className="text-white/40">Browser</div><div className="text-white/70">{profile.browser}</div>
            <div className="text-white/40">OS</div><div className="text-white/70">{profile.os}</div>
            <div className="text-white/40">Device</div><div className="text-white/70">{profile.deviceType} ({profile.screenSize})</div>
            <div className="text-white/40">Language</div><div className="text-white/70">{profile.language}</div>
            <div className="text-white/40">Timezone</div><div className="text-white/70">{profile.timezone}</div>
            <div className="text-white/40">Referrer</div><div className="text-white/70">{profile.referrer}</div>
            <div className="text-white/40">Color</div><div className="text-white/70">{profile.colorScheme}</div>
            <div className="text-white/40">Connection</div><div className="text-white/70">{profile.connectionType}</div>
            <div className="text-white/40">Touch</div><div className="text-white/70">{profile.touchSupport ? 'Yes' : 'No'}</div>
          </div>
          <div className="border-t border-white/5 mt-2 pt-2 flex items-center gap-3 text-xs">
            <span className="text-amber-400 font-mono">🎯 {profile.segment}</span>
            <span className="text-white/30">적합도: {profile.adRelevanceScore}/100</span>
          </div>
          <div className="flex gap-1 mt-1">
            {profile.interests.map((i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500/60">{i}</span>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline Timeline */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-white/50">파이프라인 타임라인</span>
          <button onClick={onRerun} className="text-[10px] text-amber-500/60 hover:text-amber-400 flex items-center gap-1 cursor-pointer">
            <RotateCcw className="w-3 h-3" /> SDK 재실행
          </button>
        </div>
        <div className="space-y-1">
          {logs.map((log) => (
            <div key={log.step} className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-white/40 w-16 text-right shrink-0">{STEP_LABELS[log.step]?.replace(/^./, '')}</span>
              <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(log.duration / maxDuration) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-full bg-amber-500/40 rounded-full"
                />
              </div>
              <span className="text-white/25 w-12 text-right shrink-0">{log.duration}ms</span>
            </div>
          ))}
        </div>
        {logs.length > 0 && (
          <div className="text-center text-[10px] font-mono text-white/25 mt-2">
            Total: {logs.reduce((s, l) => s + l.duration, 0).toLocaleString()}ms
          </div>
        )}
      </div>
    </div>
  );
}

// ── DSP Tab ──

function DspTab() {
  const [campaigns, setCampaigns] = useState(getCampaigns());
  const [showForm, setShowForm] = useState(false);
  const stats = getDspStats();

  const refreshCampaigns = () => setCampaigns(getCampaigns());

  const handleToggle = (id: string) => {
    toggleCampaign(id);
    refreshCampaigns();
  };

  return (
    <div className="space-y-4">
      {/* DSP Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: '활성 캠페인', value: stats.activeCampaigns },
          { label: '총 소진', value: `₩${stats.totalSpent.toLocaleString()}` },
          { label: 'CTR', value: `${stats.ctr.toFixed(1)}%` },
          { label: 'CVR', value: `${stats.cvr.toFixed(1)}%` },
        ].map((s) => (
          <div key={s.label} className="text-center p-2 rounded-lg bg-white/5">
            <p className="text-xs font-mono text-amber-400">{s.value}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-white/50">내 캠페인</span>
          <button onClick={() => setShowForm(!showForm)} className="text-[10px] text-amber-500/60 hover:text-amber-400 flex items-center gap-1 cursor-pointer">
            <Plus className="w-3 h-3" /> 새 캠페인
          </button>
        </div>

        {showForm && <CampaignForm onCreated={() => { refreshCampaigns(); setShowForm(false); }} />}

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {campaigns.map((c) => (
            <div key={c.id} className={`rounded-lg border p-2.5 text-xs ${c.active ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 bg-white/5 opacity-50'}`}>
              <div className="flex items-center justify-between">
                <span className="text-white/80 font-medium truncate">{c.name}</span>
                <button onClick={() => handleToggle(c.id)} className="cursor-pointer">
                  {c.active ? <Pause className="w-3 h-3 text-white/40" /> : <Play className="w-3 h-3 text-white/40" />}
                </button>
              </div>
              <div className="flex gap-3 mt-1 text-[10px] font-mono text-white/30">
                <span>{c.type}</span>
                <span>CPC ₩{c.bidCPC}</span>
                <span>QS {c.qualityScore}</span>
              </div>
              <div className="flex gap-3 mt-1 text-[10px] font-mono">
                <span className="text-white/40">노출 {c.impressions}</span>
                <span className="text-white/40">클릭 {c.clicks}</span>
                <span className="text-white/40">CTR {c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(1) : '0.0'}%</span>
                <span className="text-amber-500/50">₩{c.spent.toLocaleString()} / ₩{c.dailyBudget.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Campaign Form ──

function CampaignForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<AdSlotType>('display');
  const [keywords, setKeywords] = useState('');
  const [bidCPC, setBidCPC] = useState(150);
  const [budget, setBudget] = useState(3000);
  const [projectId, setProjectId] = useState('ads-result');

  const projectOptions = [
    'ads-result', 'coupon-flow', 'viral-ads', 'crm-campaign',
    'external-channel', 'seller-admin', 'data-structure', 'settlement-logic',
  ];

  const handleSubmit = () => {
    if (!name) return;
    addCampaign({
      name,
      type,
      keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
      bidCPC,
      dailyBudget: budget,
      projectId,
      active: true,
      qualityScore: +(Math.random() * 3 + 6).toFixed(1),
    });
    onCreated();
  };

  return (
    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 mb-3 space-y-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="캠페인 이름" className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white/80 placeholder:text-white/20 outline-none focus:border-amber-500/30" />
      <div className="flex gap-2">
        {(['display', 'search', 'reward'] as AdSlotType[]).map((t) => (
          <button key={t} onClick={() => setType(t)} className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer ${type === t ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white/30'}`}>{t}</button>
        ))}
      </div>
      {type === 'search' && (
        <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="키워드 (쉼표 구분)" className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white/80 placeholder:text-white/20 outline-none focus:border-amber-500/30" />
      )}
      <div className="flex gap-3 items-center text-[10px]">
        <label className="text-white/40">CPC ₩{bidCPC}</label>
        <input type="range" min={50} max={500} value={bidCPC} onChange={(e) => setBidCPC(+e.target.value)} className="flex-1 accent-amber-500" />
      </div>
      <div className="flex gap-3 items-center text-[10px]">
        <label className="text-white/40">예산 ₩{budget.toLocaleString()}</label>
        <input type="range" min={500} max={10000} step={500} value={budget} onChange={(e) => setBudget(+e.target.value)} className="flex-1 accent-amber-500" />
      </div>
      <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white/80 outline-none">
        {projectOptions.map((p) => <option key={p} value={p} className="bg-black">{p}</option>)}
      </select>
      <button onClick={handleSubmit} className="w-full py-1.5 rounded bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition-colors cursor-pointer">
        캠페인 생성
      </button>
    </div>
  );
}

// ── SSP Tab ──

function SspTab() {
  const stats = getSspStats();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Fill Rate', value: `${stats.fillRate.toFixed(1)}%` },
          { label: 'eCPM', value: `₩${stats.eCPM.toFixed(0)}` },
          { label: '총 수익', value: `₩${stats.totalRevenue.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="text-center p-2 rounded-lg bg-white/5">
            <p className="text-xs font-mono text-amber-400">{s.value}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono text-white/50">광고 슬롯 인벤토리</span>
        {stats.slots.map((slot) => (
          <div key={slot.id} className="rounded-lg border border-white/10 bg-white/5 p-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70 font-medium">{slot.name}</span>
              <span className="text-[10px] font-mono text-white/30">{slot.type} · Floor ₩{slot.floorPrice}</span>
            </div>
            <div className="flex gap-3 mt-1.5 text-[10px] font-mono text-white/40">
              <span>경매 {slot.totalAuctions}회</span>
              <span>낙찰 {slot.filledAuctions}회</span>
              <span>Fill {slot.totalAuctions > 0 ? ((slot.filledAuctions / slot.totalAuctions) * 100).toFixed(0) : 0}%</span>
              <span className="text-amber-500/50">₩{slot.totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MMP Tab ──

function MmpTab() {
  const stats = getMmpStats();
  const funnel = stats.funnel;
  const maxFunnel = Math.max(funnel.impressions, 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'CTR', value: `${stats.ctr.toFixed(1)}%` },
          { label: 'CVR', value: `${stats.cvr.toFixed(1)}%` },
          { label: 'ROAS', value: `${stats.roas.toFixed(0)}%` },
        ].map((s) => (
          <div key={s.label} className="text-center p-2 rounded-lg bg-white/5">
            <p className="text-xs font-mono text-amber-400">{s.value}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div>
        <span className="text-xs font-mono text-white/50 mb-2 block">전환 퍼널</span>
        {[
          { label: 'Impressions', value: funnel.impressions },
          { label: 'Clicks', value: funnel.clicks },
          { label: 'Conversions', value: funnel.conversions },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-2 mb-1 text-[11px] font-mono">
            <span className="text-white/40 w-24 text-right">{f.label}</span>
            <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500/30 rounded-full transition-all"
                style={{ width: `${maxFunnel > 0 ? (f.value / maxFunnel) * 100 : 0}%` }}
              />
            </div>
            <span className="text-white/30 w-8 text-right">{f.value}</span>
          </div>
        ))}
      </div>

      <div className="text-xs text-white/30 text-center font-mono">
        총 수익: ₩{stats.totalRevenue.toLocaleString()}
      </div>
    </div>
  );
}

// ── RTB Tab ──

function RtbTab({ profile }: { profile: UserProfile | null }) {
  const [history, setHistory] = useState<AuctionResult[]>(getAuctionHistory().slice(-5).reverse());
  const [liveAuction, setLiveAuction] = useState<AuctionResult | null>(null);
  const [auctionInsight, setAuctionInsight] = useState<string | null>(null);

  const runLive = () => {
    const segment: UserSegment = profile?.segment || 'casual';
    const result = runAuction('home_banner', 'display', undefined, segment);
    setLiveAuction(result);
    setHistory([result, ...getAuctionHistory().slice(-4).reverse()]);
    setAuctionInsight(null);

    if (result.winnerId) {
      const winner = result.participants.find(p => p.isWinner);
      if (winner) {
        interpretAuction({
          slotType: result.slotType,
          participants: result.participants.length,
          winner: winner.campaignName,
          winningEffectiveBid: winner.effectiveBid,
          secondPrice: result.secondPrice,
          savings: result.winningBid - result.secondPrice,
          qualityScore: winner.qualityScore,
          relevanceScore: winner.relevanceScore,
        }).then(insight => {
          if (insight) setAuctionInsight(insight);
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={runLive}
        className="w-full py-2 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-mono hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <Gavel className="w-3.5 h-3.5" />
        라이브 경매 시뮬레이션
      </button>

      {/* Live Auction Detail */}
      {liveAuction && <AuctionCard auction={liveAuction} isLive />}

      {/* Gemini Auction Insight */}
      {auctionInsight && (
        <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-mono text-amber-400 font-bold">{GEMINI_DISPLAY} 경매 분석</span>
          </div>
          <p className="text-[11px] text-white/70 leading-relaxed">{auctionInsight}</p>
          <p className="text-[9px] text-white/20 mt-1.5 font-mono">Powered by {GEMINI_DISPLAY}</p>
        </div>
      )}

      {/* History */}
      <div>
        <span className="text-xs font-mono text-white/50 mb-2 block">최근 경매 내역</span>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history.slice(liveAuction ? 1 : 0).map((a, i) => (
            <AuctionCard key={`${a.timestamp}-${i}`} auction={a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AuctionCard({ auction, isLive }: { auction: AuctionResult; isLive?: boolean }) {
  const maxBid = Math.max(...auction.participants.map((p) => p.effectiveBid), 1);

  return (
    <div className={`rounded-lg border p-3 ${isLive ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10 bg-white/5'}`}>
      <div className="flex items-center justify-between text-[10px] font-mono mb-2">
        <span className="text-white/50">{auction.slotId} · {auction.slotType}</span>
        <span className="text-white/30">Floor ₩{auction.floorPrice}</span>
      </div>

      {auction.participants.map((p) => (
        <div key={p.campaignId} className="mb-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className={p.isWinner ? 'text-amber-400' : 'text-white/40'}>
              {p.isWinner && '🏆 '}{p.campaignName.slice(0, 18)}
            </span>
            <span className="text-white/25">₩{p.effectiveBid}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(p.effectiveBid / maxBid) * 100}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${p.isWinner ? 'bg-amber-500/50' : 'bg-white/10'}`}
              />
            </div>
          </div>
          <div className="text-[9px] font-mono text-white/20 mt-0.5">
            ₩{p.bidAmount} × QS{p.qualityScore} × Rel{p.relevanceScore} = ₩{p.effectiveBid}
          </div>
        </div>
      ))}

      {auction.winnerId && (
        <div className="border-t border-white/5 pt-1.5 mt-1.5 text-[10px] font-mono text-white/30">
          Second-Price: ₩{auction.secondPrice} (절감: ₩{auction.winningBid - auction.secondPrice})
        </div>
      )}
    </div>
  );
}
