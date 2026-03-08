// Ad SDK Simulator — 쿠키 동의, 사용자 데이터 수집, 세그먼트 분류, 파이프라인 로그

export type SdkStep =
  | 'idle'
  | 'init'
  | 'cookie_check'
  | 'collect'
  | 'profile'
  | 'ad_request'
  | 'bidding'
  | 'serve'
  | 'track';

export interface SdkPipelineLog {
  step: SdkStep;
  timestamp: number;
  duration: number;
  detail: string;
  data?: Record<string, unknown>;
}

export type ConsentLevel = 'full' | 'essential' | 'none';

export interface UserProfile {
  browser: string;
  os: string;
  language: string;
  screenSize: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  referrer: string;
  timezone: string;
  colorScheme: 'dark' | 'light';
  connectionType: string;
  touchSupport: boolean;
  // 파생
  segment: UserSegment;
  interests: string[];
  adRelevanceScore: number;
}

export type UserSegment = 'recruiter' | 'developer' | 'mobile_user' | 'casual';

export interface SdkState {
  initialized: boolean;
  cookieConsented: boolean;
  consentLevel: ConsentLevel;
  userProfile: UserProfile | null;
  pipelineLog: SdkPipelineLog[];
  currentStep: SdkStep;
}

type StepChangeCallback = (step: SdkStep, log: SdkPipelineLog) => void;

// 세그먼트별 추천 프로젝트
export const SEGMENT_AD_PRIORITY: Record<UserSegment, string[]> = {
  recruiter: ['ads-result', 'seller-admin', 'crm-campaign', 'viral-ads'],
  developer: ['coupon-flow', 'data-structure', 'viral-ads', 'settlement-logic'],
  mobile_user: ['crm-campaign', 'ads-result', 'external-channel'],
  casual: ['ads-result', 'coupon-flow', 'viral-ads', 'crm-campaign'],
};

// 세그먼트별 개인화 메시지
export const SEGMENT_MESSAGES: Record<UserSegment, string> = {
  recruiter: 'A/B 테스트로 광고액 80%↑ 달성한 PM입니다',
  developer: 'Kafka 기반 데이터 파이프라인으로 YoY 30% 성장',
  mobile_user: 'Braze 개인화 푸시로 모바일 전환율 최적화',
  casual: '인터파크 커머스 광고 PM의 실전 프로젝트를 확인하세요',
};

const STORAGE_KEY_CONSENT = 'wh_ad_consent';
const STORAGE_KEY_PROFILE = 'wh_ad_profile';

// ── singleton state ──

let state: SdkState = {
  initialized: false,
  cookieConsented: false,
  consentLevel: 'none',
  userProfile: null,
  pipelineLog: [],
  currentStep: 'idle',
};

let listeners: StepChangeCallback[] = [];

function emit(step: SdkStep, log: SdkPipelineLog) {
  state.currentStep = step;
  state.pipelineLog.push(log);
  listeners.forEach((cb) => cb(step, log));
}

// ── helpers ──

function parseBrowser(ua: string): string {
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  return 'Unknown';
}

function parseOS(ua: string): string {
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux') && !ua.includes('Android')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  return 'Unknown';
}

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.screen.width;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function classifySegment(profile: Pick<UserProfile, 'referrer' | 'deviceType'>): UserSegment {
  const ref = profile.referrer.toLowerCase();
  if (/linkedin|wanted|saramin|jobkorea|rallit|jumpit/.test(ref)) return 'recruiter';
  if (/github|stackoverflow|dev\.to|velog|tistory/.test(ref)) return 'developer';
  if (profile.deviceType === 'mobile') return 'mobile_user';
  return 'casual';
}

function deriveInterests(segment: UserSegment): string[] {
  const map: Record<UserSegment, string[]> = {
    recruiter: ['광고 PM', '성과 지표', '경력', 'A/B 테스트'],
    developer: ['기술 스택', '데이터 파이프라인', 'Kafka', 'ML'],
    mobile_user: ['모바일 UX', 'CRM', '푸시 광고'],
    casual: ['프로젝트', '포트폴리오', '인터파크'],
  };
  return map[segment];
}

function calcRelevance(segment: UserSegment, consentLevel: ConsentLevel): number {
  const base: Record<UserSegment, number> = { recruiter: 92, developer: 78, mobile_user: 70, casual: 60 };
  const score = base[segment];
  if (consentLevel === 'full') return Math.min(score + 8, 100);
  if (consentLevel === 'essential') return score;
  return Math.max(score - 15, 30);
}

// ── public API ──

export function getSdkState(): SdkState {
  return { ...state };
}

export function getCurrentStep(): SdkStep {
  return state.currentStep;
}

export function getPipelineLog(): SdkPipelineLog[] {
  return [...state.pipelineLog];
}

export function onStepChange(cb: StepChangeCallback): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

/** 저장된 쿠키 동의 복원 */
export function restoreConsent(): ConsentLevel {
  const stored = localStorage.getItem(STORAGE_KEY_CONSENT) as ConsentLevel | null;
  if (stored && ['full', 'essential'].includes(stored)) {
    state.cookieConsented = true;
    state.consentLevel = stored;
    // 프로필도 복원
    const profileJson = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (profileJson) {
      try {
        state.userProfile = JSON.parse(profileJson);
      } catch { /* ignore */ }
    }
    return stored;
  }
  return 'none';
}

/** 쿠키 동의 */
export function grantConsent(level: ConsentLevel) {
  state.cookieConsented = level !== 'none';
  state.consentLevel = level;
  if (level !== 'none') {
    localStorage.setItem(STORAGE_KEY_CONSENT, level);
  } else {
    localStorage.removeItem(STORAGE_KEY_CONSENT);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
  }
}

/** 사용자 데이터 수집 */
export function collectUserData(): UserProfile {
  const ua = navigator.userAgent;
  const browser = parseBrowser(ua);
  const os = parseOS(ua);
  const deviceType = getDeviceType();
  const referrer = document.referrer || 'direct';
  const segment = classifySegment({ referrer, deviceType });
  const consentLevel = state.consentLevel;

  const profile: UserProfile = {
    browser,
    os,
    language: navigator.language || 'unknown',
    screenSize: `${screen.width}x${screen.height}`,
    deviceType,
    referrer,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    connectionType: (navigator as any).connection?.effectiveType || 'unknown',
    touchSupport: 'ontouchstart' in window,
    segment,
    interests: deriveInterests(segment),
    adRelevanceScore: calcRelevance(segment, consentLevel),
  };

  state.userProfile = profile;
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  return profile;
}

/** 전체 SDK 파이프라인 실행 (async, 단계별 emit) */
export async function runPipeline(): Promise<UserProfile | null> {
  state.pipelineLog = [];

  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // 1. Init
  const t0 = Date.now();
  await delay(randomBetween(100, 180));
  emit('init', { step: 'init', timestamp: t0, duration: Date.now() - t0, detail: 'WH Ad SDK v1.0 초기화 완료' });

  // 2. Cookie Check
  const t1 = Date.now();
  await delay(randomBetween(40, 80));
  const consentOk = state.cookieConsented;
  emit('cookie_check', {
    step: 'cookie_check',
    timestamp: t1,
    duration: Date.now() - t1,
    detail: consentOk ? `동의 확인 (${state.consentLevel})` : '동의 필요',
    data: { consentLevel: state.consentLevel },
  });

  if (!consentOk) {
    state.initialized = true;
    return null;
  }

  // 3. Collect
  const t2 = Date.now();
  await delay(randomBetween(250, 400));
  const profile = collectUserData();
  emit('collect', {
    step: 'collect',
    timestamp: t2,
    duration: Date.now() - t2,
    detail: '사용자 데이터 수집 완료',
    data: {
      browser: profile.browser,
      os: profile.os,
      screen: profile.screenSize,
      language: profile.language,
      referrer: profile.referrer,
      timezone: profile.timezone,
      device: profile.deviceType,
    },
  });

  // 4. Profile
  const t3 = Date.now();
  await delay(randomBetween(150, 250));
  emit('profile', {
    step: 'profile',
    timestamp: t3,
    duration: Date.now() - t3,
    detail: `세그먼트: ${profile.segment}`,
    data: { segment: profile.segment, interests: profile.interests, relevance: profile.adRelevanceScore },
  });

  // 5. Ad Request
  const t4 = Date.now();
  await delay(randomBetween(80, 130));
  emit('ad_request', {
    step: 'ad_request',
    timestamp: t4,
    duration: Date.now() - t4,
    detail: 'Ad Exchange에 광고 요청 전송',
    data: { targetSegment: profile.segment, slots: ['home_banner', 'search_sponsored', 'reward_interstitial'] },
  });

  // 6. Bidding
  const t5 = Date.now();
  await delay(randomBetween(400, 700));
  emit('bidding', {
    step: 'bidding',
    timestamp: t5,
    duration: Date.now() - t5,
    detail: 'RTB 경매 완료',
    data: { participants: 3, auctionType: 'second-price' },
  });

  // 7. Serve
  const t6 = Date.now();
  await delay(randomBetween(40, 80));
  emit('serve', {
    step: 'serve',
    timestamp: t6,
    duration: Date.now() - t6,
    detail: '낙찰 광고 송출',
    data: { adType: 'display', position: 'home_banner' },
  });

  // 8. Track
  const t7 = Date.now();
  await delay(randomBetween(20, 50));
  emit('track', {
    step: 'track',
    timestamp: t7,
    duration: Date.now() - t7,
    detail: '노출 이벤트 기록',
    data: { eventType: 'impression', timestamp: Date.now() },
  });

  state.initialized = true;
  return profile;
}

/** SDK 초기화 리셋 */
export function resetSdk() {
  state = {
    initialized: false,
    cookieConsented: false,
    consentLevel: 'none',
    userProfile: null,
    pipelineLog: [],
    currentStep: 'idle',
  };
  localStorage.removeItem(STORAGE_KEY_CONSENT);
  localStorage.removeItem(STORAGE_KEY_PROFILE);
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
