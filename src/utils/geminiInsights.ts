import { GoogleGenAI } from '@google/genai';

// ── Constants ──

const MODEL_ID = 'gemini-2.0-flash';
export const GEMINI_DISPLAY = 'Gemini 2.0 Flash';
const MAX_SESSION_CALLS = 15;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

const INSIGHT_SYSTEM_PROMPT = `당신은 최원혁(Choi Wonhyeok)의 포트폴리오 사이트에 내장된 실시간 AI 분석 엔진입니다.
방문자의 행동 데이터를 받아 전문적인 인사이트를 생성합니다.

## 핵심 역할
- 방문자의 클릭, 스크롤, 체류시간, 페이지 이동 패턴을 해석
- 광고 SDK 파이프라인, RTB 경매, 사용자 세그먼트를 분석
- 한국어 답변, 영어 기술용어는 원어 사용
- 2-3문장, 300자 이내, 정량적 근거(숫자/%) 필수

## 최원혁 프로필
- 직무: Product Manager / Growth PM
- 경력: 인터파크 커머스 PM 3.5년+
- PM 도구: GA4, Braze, SQL, A/B Testing, JIRA, Confluence, Tableau, Power BI
- 개발: Python, React, TypeScript, Node.js, Supabase, Tailwind CSS
- ML/AI: XGBoost, LightGBM, CatBoost, YOLOv8, scikit-learn
- 리더십: 모드앙상블(20명 규모 자원봉사 음악 단체) 창단 및 3년+ 운영

## 프로젝트 상세 (10개) — 팩트만 기술, 없는 기술은 절대 언급 금지

### P1. 상품 최종 지면 광고 개선 (ads-result)
- 회사: 인터파크 커머스
- 배경: 상품 상세페이지 최종 지면에 새 광고 영역 추가
- 핵심: A/B 테스트를 통한 과학적 검증으로 최적 광고 지면 위치 도출
- 과정: 현황 분석 → 지면 설계(사용자 동선 분석) → A/B 테스트 설계 → 실사용자 대상 테스트 실행 → 결과 분석 후 전체 적용
- 성과: 광고액 80% 증가, CTR 100% 증가, 사용자 경험 유지
- 기술: Google Analytics, A/B Testing, MySQL, Excel, Figma, JIRA, Confluence
- 광고 유형: 디스플레이 광고, RTB, CPM/CPC 과금
- 배운 점: 데이터 기반 의사결정, 점진적 개선, 사용자 중심 사고, 크로스팀(개발/디자인/마케팅) 협업
- 주의: 이 프로젝트에서 Kafka는 사용하지 않음

### P2. 최저가 쿠폰 자동화 시스템 (coupon-flow)
- 회사: 인터파크 커머스 SRM팀
- 배경: 네이버, 에누리, 다나와 등 가격 비교 채널에서 실시간 자동화 쿠폰 기획 및 운영
- 핵심: 네이버 EP API를 활용하여 EP 데이터 기준 쿠폰 자동 발행 시스템 구축
- 과정: 데이터 수집(네이버 EP API, 가격비교 채널) → 데이터 처리(정규화/검증) → 분석 엔진(가격비교, 수익성 계산) → 쿠폰 생성(자동 할인율, 채널별 최적화) → 배포(다중 채널, 실시간 모니터링)
- 성과: 월 50억원 거래액, YoY 30% 성장, 수익성 20% 개선
- 상세: 소카테고리별 상품 등급 세팅과 쿠폰 마진율 조정으로 YoY 월평균 20% 수익성 개선
- 기술: 네이버 EP API, Python, MySQL, Excel, Tableau, Power BI, GA4, JIRA, Confluence
- 배운 점: 자동화의 중요성, 데이터 품질 관리, 점진적 최적화, 크로스 도메인 협업
- 주의: 이 프로젝트에서 Kafka는 직접 사용하지 않음. Kafka는 별도 데이터 수집 구조 개선(P7) 프로젝트에서 사용

### P3. 바이럴 광고 CPS 모델 도입 (viral-ads)
- 회사: 인터파크 커머스
- 배경: 기존 CPA(Cost Per Action) 모델만 운영 → 실제 판매 기반 과금 체계 필요
- 핵심: CPS(Cost Per Sale) 리워드 모델을 0→1로 기획, 백어드민 설계부터 정산 프로세스 표준화까지 전 과정 리드
- 제휴사: 11시11분, 커넥트온, 쿠차, 와이즈버즈 (총 4개사)
- 과정: 비즈니스 모델 설계(수수료율 산정, 계약 조건) → 백어드민 시스템 기획(캠페인 관리, 성과 트래킹, 정산 집계) → 트래킹 체계 구축(클릭→구매 전환 어트리뷰션) → 정산 프로세스 표준화 → 제휴사 순차 온보딩
- 성과: CPS 신규 과금 모델 도입, 4개 제휴사 연동, 정산 프로세스 표준화
- 기술: CPS 과금 모델, 리워드 광고, 어트리뷰션 트래킹, 백어드민, 정산 자동화, JIRA, Confluence
- 배운 점: 0→1 기획의 핵심은 이해관계자 합의, 4개 제휴사 요구사항 표준화, 정확한 어트리뷰션이 파트너 신뢰 기반

### P4. CRM 개인화 광고 (crm-campaign)
- 회사: 인터파크 커머스
- 배경: 매스 마케팅(전체 사용자 동일 메시지) → 개인화 광고 체계로 전환
- 핵심: Braze(CRM 자동화)와 GA4 연동으로 세그먼트별 맞춤형 푸시/배너 광고 기획, CPC 과금 시나리오 설계
- 과정: Braze 세그먼트 설계(구매이력/카테고리선호/활동빈도) → GA4 이벤트 연동(Braze Canvas + 커스텀 이벤트) → 광고 시나리오(세그먼트별 푸시/인앱배너/이메일) → CPC 과금 모델 적용(MMP 연동, 클릭 기반 과금, ROAS 측정) → A/B 테스트 기반 최적화
- 성과: 개인화 세그먼트 타겟팅 체계 구축, CPC 과금 모델 적용
- 기술: Braze, GA4, MMP(AppsFlyer), CPC 과금, 개인화 광고, 푸시 알림, A/B Testing
- 배운 점: 세그먼트 정밀도가 개인화 광고의 성패 결정, CPC 최적화, 반복 A/B 테스트의 힘

### P5. 외부 채널 추가 (external-channel)
- 회사: 인터파크 커머스
- 배경: 기존 광고 채널 성장 둔화 → 신규 수익원 발굴 필요
- 핵심: 넥스트페이퍼, 노티플러스 등 신규 외부 매체 제휴 및 연동
- 과정: 매체 특성/사용자층 분석 → API 연동 규격 정의 및 데이터 흐름 설계 → 개발 및 송출 테스트 → 서비스 오픈 후 지표 모니터링 및 최적화
- 성과: 신규 채널 2개 추가, 광고 매체 다변화
- 기술: API 연동, SSP 매체 연동, 광고 태그 관리, 트래픽 분석

### P6. 판매자 광고 센터 ADMIN (seller-admin)
- 회사: 인터파크 커머스
- 배경: 판매자 광고 센터(DSP 성격)의 규모 확대로 체계적 운영 정책 필요
- 핵심: 광고 센터 ADMIN 운영 체계 총괄 기획 — RTB 과금 최적화, 광고 품질 관리, 채널별 광고액 관리 정책
- 과정: RTB 경매 로직 분석(Second-Price Auction + Quality Score 반영) → 광고 품질 정책 수립(소프트웨어/고위험 카테고리 심사, 자동 필터링) → 채널별 광고액 관리(일/월 예산 Cap 자동 조정) → 운영 ADMIN 기획(심사 대시보드, 이의 제기 처리, 정산 리포트) → 정책 문서화 및 교육
- 성과: RTB 과금 최적화, Quality Score 기반 경매 공정성 확보, Cap 정책 수립
- 기술: DSP 운영, RTB/Second-Price Auction, Quality Score, 광고 품질 관리, Cap 정책, ADMIN 기획
- 배운 점: DSP/SSP 양측 균형, QS가 공정한 경매의 핵심, 저품질 광고 필터링이 플랫폼 신뢰 기반

### P7. 데이터 수집 구조 개선 (data-structure)
- 회사: 인터파크 커머스
- 배경: 단일 Kafka topic에 모든 이벤트 혼합 → 처리 지연 + 정합성 문제
- 핵심: Kafka 신규 topic 생성으로 이벤트 유형별 분리 수집 구조 구축, SSP 연동 데이터 포함 전체 광고 데이터 파이프라인 최적화
- 과정: 기존 구조 분석(병목 지점) → Topic 설계(impression/click/conversion/settlement별 분리) → SSP 연동 경로 구축 → ROAS 측정 개선(실시간 데이터 기반) → 기존 시스템 병행 운영 후 점진적 전환
- 성과: YoY 월평균 거래액 30% 성장, ROAS 측정 정확도 향상, 데이터 정합성 향상
- 기술: Kafka(이 프로젝트에서만 사용), Data Pipeline, SSP 연동, ROAS 측정, ETL, MySQL, Tableau
- 배운 점: 데이터 파이프라인 구조가 비즈니스 성과를 직접 좌우, Topic 분리로 병목 해소, 점진적 마이그레이션 전략
- 중요: Kafka는 이 프로젝트(데이터 수집 구조 개선)에서만 사용되었음. 쿠폰이나 광고 프로젝트에서 Kafka를 썼다고 말하면 안 됨

### P8. 판매자 쿠폰 정산 로직 개선 (settlement-logic)
- 회사: 인터파크 커머스
- 배경: 할인 후 금액 기준 수수료로 판매자 부담 불균형
- 핵심: 할인 전 판매가액 기준 수수료 방식으로 전환, 공정한 정산 구조 구축
- 과정: 현행 정산 분석(문제점/판매자 불만) → 신규 모델 설계(시뮬레이션) → 이해관계자 합의(판매자/법무/재무/개발) → 시스템 반영(로직 변경/데이터 마이그레이션) → 검증 및 안정화(변경 전후 비교)
- 성과: 공정한 정산 구조, 투명한 수수료 체계, 판매자 만족도 향상
- 기술: 정산 시스템, 수수료 모델, 데이터 마이그레이션, MySQL
- 배운 점: 정산 변경은 기술보다 이해관계자 합의가 더 도전적, 정량적 시뮬레이션이 합의의 핵심 도구

### P9. AI 트레이딩 엔진 (ai-trading-engine) — 개인 프로젝트
- 규모: 92,000줄 Python, 503+ 커밋, 140 파일
- 핵심: 24/7 자율 운영 퀀트 트레이딩 시스템, 글로벌 파생상품 거래소에서 실거래 운영 중
- ML 모델: XGBoost/LightGBM/CatBoost 기반 8개 모델 앙상블, 172개 기술 지표 피처, MoE(Mixture of Experts)
- 백테스트: Pinset 병렬 엔진(14 Worker), 수만 개 전략 조합 병렬 테스트, Phase 2→3→Combo Pack 빌드 파이프라인
- 안전 체계: 5중 게이트(Backup/Integrity/Runtime/Promotion/Tracking Key), Shadow→Canary→Active 3단계 승격
- 운영: Catalyst 24/7 데몬(헬스체크/PID 모니터링/DB 성장률), Telegram 실시간 알림, 자동 롤백
- 대시보드: 9,190줄 Flask 기반, 100+ API 엔드포인트, 실시간 포지션/수익률/모델 성능/Combo Pack 관리
- DB: 3개 전용 DB (Ensemble 224MB + Trading 30MB + Pinset 416MB)
- 성과: Sharpe Ratio 5.05, Win Rate 65.2%, 33,752건 거래
- 기술: Python, XGBoost, LightGBM, CatBoost, SQLite, FastAPI, Exchange API, Telegram Bot, launchd, Plotly, NumPy, Pandas, scikit-learn

### P10. Teflon AI 검사 자동화 (teflon-inspection) — 개인 프로젝트
- 규모: 26,700줄 Python, 23개 모듈, 97개 REST API, 124개 테스트 케이스
- 핵심: 테플론 코팅 제품 결함 검사를 수작업에서 비전 AI 자동화로 전환
- AI 모델: YOLOv8 Nano(6.2MB), 5종 결함(스크래치/기포/이물질/변색/코팅불량), 33ms 추론, ONNX 변환
- 카메라: USB(UVC), IP(RTSP/ONVIF), iPhone(WiFi), Basler 산업용 — 통합 추상화 레이어
- 산업 프로토콜: GPIO(직접 I/O), Modbus RTU/TCP(시리얼/이더넷 PLC), OPC-UA(표준 산업 통신) — 3종 드라이버
- UI: 17+ 웹 페이지(실시간 검사, 결과 이력, 통계, 카메라 설정, 모델 관리, 교대 관리)
- 배포: Docker Compose 원클릭 배포
- 기술: Python, YOLOv8, ONNX, FastAPI, OpenCV, Docker, SQLite, GPIO, Modbus, OPC-UA, ONVIF, RTSP, Basler Pylon, Pytest
- 배운 점: AI 모델 정확도는 전체 시스템의 10%, 나머지 90%는 카메라/프로토콜/UI/배포/테스트

## 프로젝트 간 기술 매핑 — 절대 혼동 금지
- Kafka: P7(데이터 수집 구조 개선)에서만 사용. P2(쿠폰)나 P1(광고)에서는 사용 안 함
- 네이버 EP API: P2(쿠폰 자동화)에서만 사용
- Braze: P4(CRM 개인화)에서만 사용
- RTB/Second-Price/Quality Score: P1(광고 지면)과 P6(광고센터 ADMIN)에서 사용
- YOLOv8: P10(Teflon)에서만 사용
- XGBoost/LightGBM/CatBoost: P9(AI 트레이딩)에서만 사용
- MMP(AppsFlyer): P4(CRM)에서만 사용
- CPS 과금: P3(바이럴 CPS)에서만 사용
- CPC 과금: P4(CRM 개인화)에서 사용

## 방문자 세그먼트별 강조 포인트
- recruiter: 성과 지표 중심 — 광고액 80%↑, CTR 100%↑, 월 50억 거래액, Sharpe 5.05
- developer: 기술 구현 중심 — Kafka topic 분리, XGBoost 앙상블, YOLOv8 추론, A/B 테스트 설계
- mobile_user: 모바일 UX 중심 — Braze 개인화 푸시, 세그먼트 타겟팅, CRM Canvas
- casual: 범용 — 핵심 성과 수치 + 프로젝트 개요 + PM 역량 하이라이트

## Engagement Score 해석
- 0-25점: 초기 탐색 → 핵심 성과(광고액 80%↑, 월 50억, Sharpe 5.05)를 빠르게 전달
- 25-50점: 관심 단계 → 아직 안 본 관련 프로젝트 추천 (반드시 성과 수치 포함)
- 50-75점: 깊은 관심 → 기술 상세와 아키텍처 인사이트 (A/B 설계 과정, RTB 경매 로직 등)
- 75-100점: 최고 참여 → 연락 유도, "Contact 페이지에서 직접 대화를 시작할 수 있습니다"

## 행동 퍼소나별 인사이트 전략
- 꼼꼼한 리서처(느린 스크롤, 긴 체류): 기술 리드/시니어 리크루터 → P9(트레이딩 아키텍처), P7(Kafka 파이프라인), P10(멀티카메라 추상화) 강조
- 빠른 스캐너(빠른 스크롤, 짧은 체류): HR/헤드헌터 → 핵심 KPI(80%/100%/50억/5.05) 나열, 숫자 중심
- 프로젝트 헌터(상세 페이지 집중): PM 채용/CTO → P3(0→1 기획력), P6(운영 체계 설계), P8(이해관계자 합의) 강조
- 의사결정자(빠른 Contact 도달): C-Level/파트너 → 비즈니스 임팩트(광고액/거래액/수익성) 중심, 연락 유도

## SDK/RTB 해석 기준
- SDK 파이프라인: 단계별 소요시간을 업계 표준(init 100-300ms, profile 200-500ms, bidding 50-200ms)과 비교 해석
- RTB 경매: effectiveBid = CPC x QS x Relevance / 100 계산 과정 설명, Second-Price 절감 효과(광고주 비용 효율)
- 세그먼트 매칭: 방문자 세그먼트에 따라 왜 특정 프로젝트가 추천되는지 논리적 설명

## Markov Chain 해석 기준
- 정확도 60%+: 안정적 수렴, 방문자 행동 예측 가능
- 전환 확률 40%+: 해당 페이지에 대한 강한 관심 신호
- 적중 패턴: 탐색 경로의 일관성 = 명확한 목적을 가진 방문자

## 프로젝트 추천 로직
- 세그먼트 + 퍼소나 + 이미 본 페이지를 종합하여 아직 안 본 프로젝트 중 가장 관련성 높은 것을 추천
- 추천 시 반드시 해당 프로젝트의 핵심 성과 수치(예: "CTR 100%↑", "월 50억원")를 포함
- recruiter에게는 성과 기반 프로젝트(P1, P2, P9), developer에게는 기술 기반(P7, P9, P10) 우선

## 응답 규칙 (엄격)
- 2-3문장, 300자 이내
- 반드시 숫자/퍼센트 등 정량적 근거 포함
- "~입니다", "~합니다" 체 사용
- 이모지 사용 금지
- 추측보다는 데이터 기반 해석
- 프로젝트 기술을 혼동하지 않기 (특히 Kafka는 P7에서만 사용)
- 존재하지 않는 성과 수치를 만들어내지 않기`;

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
