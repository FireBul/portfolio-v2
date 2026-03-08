import { GoogleGenAI } from '@google/genai';

// ── Constants ──

const MODEL_ID = 'gemini-2.0-flash';
export const GEMINI_DISPLAY = 'Gemini 2.0 Flash';
const MAX_SESSION_CALLS = 15;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const INSIGHT_SYSTEM_PROMPT = `당신은 최원혁(Choi Wonhyeok)의 포트폴리오 사이트에 내장된 실시간 AI 분석 엔진입니다.
포트폴리오 방문자의 행동 데이터를 받아 전문적인 인사이트를 생성합니다.

## 역할
- 방문자의 클릭, 스크롤, 체류시간, 페이지 이동 패턴을 분석하여 인사이트를 도출합니다.
- 광고 SDK 파이프라인, RTB 경매, 사용자 세그먼트를 해석합니다.
- 한국어로 답변하되, 영어 기술용어는 그대로 사용합니다.
- 2-3문장으로 간결하게, 반드시 숫자와 구체적 근거를 포함합니다.

## 최원혁 프로필 (인사이트 생성 시 참조)
- 직무: Product Manager / Growth PM
- 경력: 인터파크 커머스 PM 3.5년+
- 핵심 프로젝트 성과:
  1) 상품 지면 광고 개선: A/B 테스트 → 광고액 80% 증가, CTR 100% 증가
  2) 최저가 쿠폰 자동화: Kafka + EP API → 월 50억 거래액, YoY 30% 성장
  3) 바이럴 CPS 도입: 4개 제휴사 CPS 리워드 모델 0→1 기획
  4) CRM 개인화: Braze×GA4 → CPC 과금, MMP 어트리뷰션
  5) 광고센터 ADMIN: DSP/RTB 과금 최적화, Quality Score, Cap 정책
  6) 데이터 파이프라인: Kafka topic 분리 → ROAS 측정 정확도 향상
  7) 정산 로직 개선: 할인 전 판매가액 기준 수수료 체계
  8) AI 트레이딩 엔진: 92K줄 Python, 8개 ML 앙상블, Sharpe 5.05, Win Rate 65.2%
  9) Teflon AI 검사: YOLOv8, 33ms 추론, 97개 REST API

## 방문자 세그먼트 해석 기준
- recruiter (LinkedIn/Wanted/Saramin 유입): 성과 지표 중심 → 광고액, CTR, 거래액 강조
- developer (GitHub/Dev.to 유입): 기술 스택 중심 → Kafka, XGBoost, RTB 로직 강조
- mobile_user (모바일 접속): 모바일 UX 중심 → Braze 푸시, CRM 개인화 강조
- casual (직접 유입): 범용 → 핵심 성과 + 프로젝트 개요 강조

## Engagement Score 해석 기준
- 0-25점: 초기 탐색 단계 → 핵심 성과를 빠르게 전달
- 25-50점: 관심 단계 → 관련 프로젝트 추천
- 50-75점: 깊은 관심 → 기술적 상세, 아키텍처 인사이트
- 75-100점: 최고 참여 → 연락 유도, 맞춤 메시지

## 행동 퍼소나 해석 기준
- 꼼꼼한 리서처: 느린 스크롤 + 긴 체류 → 기술 리드/시니어 리크루터. 아키텍처와 설계 역량 강조
- 빠른 스캐너: 빠른 스크롤 + 짧은 체류 → HR/헤드헌터. 핵심 KPI와 성과 수치 강조
- 프로젝트 헌터: 상세 페이지 집중 → PM 채용 매니저/CTO. 프로젝트 리드 경험 강조
- 의사결정자: 빠른 Contact 도달 → C-Level/파트너. 비즈니스 임팩트 강조

## 광고 SDK/RTB 해석 기준
- SDK 파이프라인: 각 단계 소요시간을 업계 표준과 비교하여 해석
- RTB 경매: effectiveBid = CPC × QS × Relevance 계산 과정을 설명, Second-Price 절감 효과 해석
- 세그먼트 매칭: 왜 특정 프로젝트가 추천되었는지 논리적으로 설명

## Markov Chain 해석 기준
- 정확도 60% 이상: 안정적 수렴 단계, 예측 신뢰도가 높음
- 전환 확률 40% 이상: 해당 페이지에 대한 강한 관심 신호
- 예측 적중 패턴: 방문자의 탐색 경로가 일관되다는 증거

## 프로젝트 추천 로직
- 방문자의 세그먼트 + 퍼소나 + 이미 본 페이지를 종합하여 아직 안 본 관련 프로젝트를 추천
- 추천 시 프로젝트의 핵심 성과 수치를 반드시 포함

## 응답 규칙
- 2-3문장, 300자 이내
- 반드시 숫자/퍼센트 등 정량적 근거 포함
- "~입니다", "~합니다" 체 사용
- 이모지 사용 금지
- 추측보다는 데이터 기반 해석`;

// ── Session State ──

let sessionCallCount = 0;

// ── Client Singleton ──

let insightClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!insightClient) {
    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '') as string;
    insightClient = new GoogleGenAI({ apiKey });
  }
  return insightClient;
}

// ── Cache Helpers ──

interface CacheEntry {
  value: string;
  timestamp: number;
}

function getCached(key: string): string | null {
  try {
    const raw = localStorage.getItem(`gi_${key}`);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(`gi_${key}`);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

function setCache(key: string, value: string): void {
  try {
    const entry: CacheEntry = { value, timestamp: Date.now() };
    localStorage.setItem(`gi_${key}`, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — skip silently
  }
}

// ── Core Insight Generator ──

async function generateInsight(
  context: string,
  question: string,
  cacheKey?: string,
): Promise<string | null> {
  // Session cap check
  if (sessionCallCount >= MAX_SESSION_CALLS) {
    console.log(`[GeminiInsights] Session cap reached (${MAX_SESSION_CALLS})`);
    return null;
  }

  // Cache check
  if (cacheKey) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  try {
    sessionCallCount++;
    const client = getClient();

    const response = await client.models.generateContent({
      model: MODEL_ID,
      contents: [
        {
          role: 'user',
          parts: [{ text: `[컨텍스트]\n${context}\n\n[질문]\n${question}` }],
        },
      ],
      config: {
        systemInstruction: INSIGHT_SYSTEM_PROMPT,
        maxOutputTokens: 300,
        temperature: 0.6,
        topP: 0.85,
      },
    });

    const text = response.text?.trim() ?? null;
    if (text && cacheKey) {
      setCache(cacheKey, text);
    }
    return text;
  } catch (error) {
    console.error('[GeminiInsights] API error:', error);
    sessionCallCount--; // Don't count failed calls
    return null;
  }
}

// ── Specialized Functions ──

export interface EngagementMetrics {
  clicks: number;
  pageviews: number;
  timeSpent: number;
  maxScroll: number;
  detailViews: number;
  score: number;
}

export async function interpretEngagement(metrics: EngagementMetrics): Promise<string | null> {
  const context = `Engagement Score: ${metrics.score}/100, 클릭 ${metrics.clicks}회, 페이지뷰 ${metrics.pageviews}, 체류 ${metrics.timeSpent}초, 스크롤 ${metrics.maxScroll}%, 상세 ${metrics.detailViews}회`;
  const question = '이 방문자의 참여도 수준을 해석하고, 어떤 유형의 방문자인지 인사이트를 제공하세요.';
  return generateInsight(context, question, `eng_${Math.floor(metrics.score / 10)}`);
}

export interface PersonaData {
  persona: string;
  confidence: number;
  scrollSpeed: number;
  dwellPerPage: number;
  detailViews: number;
  totalPages: number;
}

export async function interpretPersona(data: PersonaData): Promise<string | null> {
  const context = `퍼소나: ${data.persona}, 신뢰도: ${data.confidence}%, 평균 스크롤 속도: ${data.scrollSpeed}px/s, 페이지당 체류: ${data.dwellPerPage}초, 상세 조회: ${data.detailViews}회, 총 페이지: ${data.totalPages}`;
  const question = '이 방문자의 퍼소나를 해석하고, 어떤 직업/역할의 사람인지, 이 방문자에게 가장 효과적인 콘텐츠 전략을 제안하세요.';
  return generateInsight(context, question, `persona_${data.persona}`);
}

export interface SdkPipelineData {
  segment: string;
  browser: string;
  os: string;
  referrer: string;
  relevanceScore: number;
  totalPipelineTime: number;
  recommendedProjects: string[];
}

export async function interpretSdkPipeline(data: SdkPipelineData): Promise<string | null> {
  const context = `세그먼트: ${data.segment}, 브라우저: ${data.browser}, OS: ${data.os}, 유입: ${data.referrer}, 적합도: ${data.relevanceScore}/100, SDK 처리시간: ${data.totalPipelineTime}ms, 추천 프로젝트: ${data.recommendedProjects.join(', ')}`;
  const question = 'SDK 파이프라인 결과를 해석하세요. 세그먼트 분류 근거, 처리시간의 업계 대비 수준, 추천 프로젝트가 적합한 이유를 설명하세요.';
  return generateInsight(context, question, `sdk_${data.segment}_${data.relevanceScore}`);
}

export interface AuctionData {
  slotType: string;
  participants: number;
  winner: string;
  winningEffectiveBid: number;
  secondPrice: number;
  savings: number;
  qualityScore: number;
  relevanceScore: number;
}

export async function interpretAuction(data: AuctionData): Promise<string | null> {
  const context = `슬롯: ${data.slotType}, 참여자: ${data.participants}개, 낙찰: ${data.winner}, Effective Bid: ${data.winningEffectiveBid}원, Second-Price: ${data.secondPrice}원, 절감: ${data.savings}원, QS: ${data.qualityScore}, Relevance: ${data.relevanceScore}`;
  const question = 'RTB 경매 결과를 해석하세요. Quality Score와 Relevance의 역할, Second-Price 절감 효과, 낙찰 결정 과정을 설명하세요.';
  return generateInsight(context, question, `auction_${data.slotType}_${data.winningEffectiveBid}`);
}

export interface BehaviorData {
  persona: string;
  segment: string;
  viewedPages: string[];
  timeOnSite: number;
  clicks: number;
}

export async function suggestNextProject(data: BehaviorData): Promise<string | null> {
  const context = `퍼소나: ${data.persona}, 세그먼트: ${data.segment}, 방문 페이지: ${data.viewedPages.join(', ')}, 체류: ${data.timeOnSite}초, 클릭: ${data.clicks}회`;
  const question = '이 방문자에게 아직 안 본 프로젝트 중 가장 적합한 하나를 추천하세요. 추천 이유와 해당 프로젝트의 핵심 성과 수치를 포함하세요.';
  return generateInsight(context, question, `rec_${data.persona}_${data.segment}`);
}

export interface MarkovData {
  predictions: { page: string; probability: number }[];
  accuracy: number;
  totalPredictions: number;
  hits: number;
}

export async function interpretMarkov(data: MarkovData): Promise<string | null> {
  const topPred = data.predictions.slice(0, 3).map(p => `${p.page}(${Math.round(p.probability * 100)}%)`).join(', ');
  const context = `예측 정확도: ${data.accuracy}%, ${data.totalPredictions}번 예측 중 ${data.hits}번 적중, 상위 예측: ${topPred}`;
  const question = 'Markov Chain 예측 결과를 해석하세요. 정확도 수준, 방문자의 탐색 패턴 일관성, 가장 높은 전환 확률 페이지의 의미를 설명하세요.';
  return generateInsight(context, question, `markov_${data.accuracy}_${data.hits}`);
}

export interface ContactAssistData {
  persona: string;
  segment: string;
  topViewedProjects: string[];
  engagementScore: number;
  timeOnSite: number;
}

export async function generateContactAssist(data: ContactAssistData): Promise<string | null> {
  const context = `퍼소나: ${data.persona}, 세그먼트: ${data.segment}, 관심 프로젝트: ${data.topViewedProjects.join(', ')}, Engagement: ${data.engagementScore}/100, 체류: ${data.timeOnSite}초`;
  const question = '이 방문자가 Contact 페이지에 도달했습니다. 방문자의 탐색 패턴을 요약하고, 관심사에 맞는 맞춤 인사이트를 제공하세요.';
  return generateInsight(context, question, `contact_${data.segment}_${data.engagementScore}`);
}

// ── Utility ──

export function getSessionCallCount(): number {
  return sessionCallCount;
}

export function getRemainingCalls(): number {
  return Math.max(0, MAX_SESSION_CALLS - sessionCallCount);
}
