import React from 'react';
import { Link } from 'react-router-dom';

const SITE_URL = 'https://firebul.github.io/portfolio-v2/';
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(SITE_URL)}`;
const IMG_BASE = 'https://firebul.github.io/portfolio/assets/images';
const PROFILE_IMG = `${IMG_BASE}/profile.jpg`;

/* ── 핵심 프로젝트 (상세 노출) ── */
const FEATURED_PROJECTS = [
  {
    title: '최저가 쿠폰 자동화 시스템',
    role: 'PM · 기획 · 데이터 분석',
    org: '인터파크 SRM팀',
    image: `${IMG_BASE}/projects/coupon-flow.png`,
    desc: '수동 쿠폰 운영의 비효율을 제거하기 위해, 3개 가격 비교 채널(네이버·에누리·다나와)의 실시간 가격 데이터를 Kafka 파이프라인으로 연결. 네이버 EP API 기반 자동화 쿠폰 시스템을 설계하여 월 50억원 규모의 거래를 데이터 기반으로 운영',
    metrics: [
      { value: '50억원', label: '월 거래액' },
      { value: '+30%', label: 'YoY 거래액' },
      { value: '+20%', label: '수익성 개선' },
    ],
    stack: ['네이버 EP API', 'Kafka', 'Python', 'MySQL', 'Tableau'],
  },
  {
    title: '상품 최종 지면 광고 개선',
    role: 'PM · A/B 테스트 설계 · 분석',
    org: '인터파크 광고팀',
    image: `${IMG_BASE}/projects/ads-result.png`,
    desc: '기존 광고 지면 성과가 정체된 상황에서, 상품 상세 페이지 하단에 새로운 광고 영역을 설계. 세션 80%/가중치 20% A/B 테스트로 클릭률 0.36→0.70%(+94%)를 검증하고, UX를 유지하면서 광고액 80% 성장 달성',
    metrics: [
      { value: '+80%', label: '광고액' },
      { value: '+100%', label: 'CTR' },
      { value: '유지', label: 'UX 품질' },
    ],
    stack: ['A/B Testing', 'Google Analytics', 'MySQL', 'Figma'],
  },
  {
    title: 'AURORA — 퀀트 트레이딩 시스템',
    role: 'Full-Stack 설계 · ML · 운영',
    org: '개인 프로젝트',
    image: `${IMG_BASE}/projects/aurora-file-tree.svg`,
    desc: 'PM 경험에서 쌓은 데이터 분석·시스템 설계 역량을 기술로 확장한 프로젝트. 92,000줄 Python 코드베이스에서 8개 ML 앙상블, 5중 안전 게이트, 24/7 운영 데몬까지 전체 아키텍처를 독립 설계·운영',
    metrics: [
      { value: '8개', label: 'ML 앙상블' },
      { value: '5.05', label: 'Sharpe' },
      { value: '65.2%', label: 'Win Rate' },
    ],
    stack: ['Python', 'XGBoost', 'LightGBM', 'CatBoost', 'FastAPI', 'SQLite'],
  },
  {
    title: 'Teflon AI 검사 자동화 시스템',
    role: 'Full-Stack 설계 · CV · 하드웨어 연동',
    org: '개인 프로젝트',
    image: `${IMG_BASE}/projects/teflon-file-tree.svg`,
    desc: '제조 현장의 육안 검사를 AI로 대체한 산업용 풀스택 시스템. YOLOv8 모델 학습부터 멀티카메라 통합, GPIO/Modbus 연동, 97개 REST API의 운영 대시보드까지 단독 구축',
    metrics: [
      { value: '33ms', label: '추론 속도' },
      { value: '5종', label: '결함 검출' },
      { value: '97개', label: 'REST API' },
    ],
    stack: ['YOLOv8', 'ONNX', 'FastAPI', 'OpenCV', 'Docker', 'Modbus/OPC-UA'],
  },
];

/* ── 기타 프로젝트 (요약) ── */
const OTHER_PROJECTS = [
  { title: '바이럴 광고 CPS 모델 도입', desc: '11시11분·커넥트온·쿠차·와이즈버즈 4개 제휴사 CPS 수익 모델 설계, 백어드민 구축, 정산 표준화', highlight: true },
  { title: 'CRM 개인화 광고 운영', desc: 'Braze + GA 연동 개인화 푸시/배너 시나리오 설계 및 CPC 최적화', highlight: true },
  { title: '외부 채널 매체 확장', desc: '넥스트페이퍼, 노티플러스 등 신규 채널 2곳 연동 — 광고 수익원 다변화', highlight: false },
  { title: '판매자 광고센터 ADMIN', desc: '고위험 광고 품질관리, RTB 과금 최적화, 채널별 광고액 관리 정책 수립', highlight: false },
  { title: '데이터 수집 구조 개선', desc: 'Kafka 신규 topic 설계로 데이터 파이프라인 재구축 — YoY 거래액 30%↑', highlight: false },
  { title: '쿠폰 정산 로직 개선', desc: '할인 전 판매가 기준 수수료 부과 방식으로 변경 — 판매자·플랫폼 공정성 확보', highlight: false },
];

export function PortfolioPDF() {
  return (
    <>
      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          @page { size: A4; margin: 16mm 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break { break-before: page; }
          img { break-inside: avoid; }
          .project-card { break-inside: avoid; }
        }
        @media screen {
          .pdf-root { max-width: 210mm; margin: 0 auto; background: white; }
        }
      `}</style>

      <div className="pdf-root bg-white text-gray-900 text-[11px] leading-[1.55] font-[system-ui,sans-serif]">

        {/* ── Print Button (화면에서만) ── */}
        <div className="no-print sticky top-0 z-50 bg-indigo-600 text-white text-center py-3 px-4 flex items-center justify-center gap-4">
          <span className="text-sm font-medium">인쇄 미리보기 모드</span>
          <button
            onClick={() => window.print()}
            className="px-5 py-1.5 bg-white text-indigo-700 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors"
          >
            PDF로 저장 (Ctrl+P)
          </button>
          <Link
            to="/"
            className="px-4 py-1.5 border border-white/40 rounded-lg text-sm hover:bg-white/10 transition-colors"
          >
            사이트로 돌아가기
          </Link>
        </div>

        {/* ════════════════════════════════════════════
            PAGE 1 — 프로필 + 핵심 지표 + 역량
        ════════════════════════════════════════════ */}
        <div className="px-8 pt-8 pb-4">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[28px] font-extrabold tracking-tight leading-none text-gray-900">
                최원혁 <span className="text-[15px] font-medium text-gray-500 ml-2">CHOI WONHYEOK</span>
              </h1>
              <p className="text-[13px] text-indigo-600 font-semibold mt-1.5">
                Product Manager · 데이터 기반 제품 전략
              </p>
              <div className="flex gap-4 mt-2.5 text-gray-500 text-[10px]">
                <span>jarelrs@gmail.com</span>
                <span>010-3810-9130</span>
                <span>github.com/FireBul</span>
              </div>
            </div>
            {/* 프로필 사진 + QR 코드 */}
            <div className="flex items-start gap-3 shrink-0">
              <img
                src={PROFILE_IMG}
                alt="프로필 사진"
                referrerPolicy="no-referrer"
                className="w-[60px] h-[75px] object-cover rounded-lg border border-gray-200"
              />
              <div className="text-center">
                <img src={QR_URL} alt="Portfolio QR" className="w-[56px] h-[56px] rounded" />
                <p className="text-[7px] text-gray-400 mt-0.5">포트폴리오 사이트</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full mb-5" />

          {/* Summary — 개선된 워딩 */}
          <div className="mb-5">
            <p className="text-[11.5px] text-gray-700 leading-relaxed">
              <strong className="text-gray-900">데이터로 문제를 정의하고 제품으로 해결하는 PM</strong>입니다.
              인터파크커머스에서 월 50억원 쿠폰 자동화 시스템을 설계하고 A/B 테스트로 광고액 80%를 끌어올렸습니다.
              현재는 <strong>92,000줄 AI 트레이딩 시스템</strong>과 <strong>YOLOv8 산업용 검사 시스템</strong>을 직접 구축하며, 기획과 기술을 연결하는 PM으로 성장하고 있습니다.
            </p>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[
              { value: '4년 6개월', label: 'PM 경력' },
              { value: '50억원', label: '월 쿠폰 거래액' },
              { value: '+80%', label: '광고액 상승' },
              { value: '8개 모델', label: 'ML 앙상블' },
              { value: '5종 검출', label: 'AI 검사 시스템' },
            ].map((m, i) => (
              <div key={m.label} className="text-center bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-1">
                <div className={`text-[15px] font-extrabold ${i < 3 ? 'text-indigo-600' : 'text-indigo-400'}`}>{m.value}</div>
                <div className="text-[9px] text-gray-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Core Competencies — 개선된 워딩 */}
          <div className="mb-5">
            <h2 className="text-[13px] font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <span className="w-1 h-4 bg-indigo-500 rounded-full inline-block" />
              Core Competence
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: 'Problem Solving', desc: '광고 수익 정체를 A/B 테스트로 80% 반전시킨 실전 문제 해결력. 원인 분석에서 끝나지 않고 실행까지 책임' },
                { title: 'Data Literacy', desc: 'GA·Kafka·Tableau로 사용자 행동을 숫자로 읽고, 데이터가 가리키는 방향으로 제품을 움직이는 역량' },
                { title: 'Planning & Execution', desc: '기획서에서 끝나지 않는 PM. 시스템 아키텍처, 정산 로직, A/B 시나리오까지 실행 설계를 직접 그림' },
              ].map((c) => (
                <div key={c.title} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                  <h3 className="text-[10.5px] font-bold text-indigo-600 mb-1">{c.title}</h3>
                  <p className="text-[9.5px] text-gray-600 leading-snug">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="mb-3">
            <h2 className="text-[13px] font-bold text-gray-900 mb-2.5 flex items-center gap-1.5">
              <span className="w-1 h-4 bg-indigo-500 rounded-full inline-block" />
              Experience
            </h2>
            <div className="space-y-2.5">
              {/* 인터파크 */}
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-bold text-[11.5px]">인터파크커머스</p>
                  <span className="text-[9px] text-gray-400">2021.06 – 2025.12 (4년 6개월)</span>
                </div>
                <p className="text-[10px] text-indigo-600 font-semibold mb-1.5">Product Manager · SRM팀</p>
                <p className="text-[9.5px] text-gray-600 mb-1.5 leading-snug">
                  광고·쿠폰·제휴 도메인의 PM으로서 월 50억원 규모 쿠폰 시스템, 연간 수십억 광고 상품을 총괄.
                  A/B 테스트와 데이터 분석을 표준 의사결정 프로세스로 정착시켜 팀의 일하는 방식을 바꿈.
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {[
                    { text: '최저가 쿠폰 자동화 시스템 구축 — 월 50억원 거래액, YoY +30%', bold: true },
                    { text: '상품 상세 광고 지면 신설 — A/B 테스트로 광고액 +80%, CTR +100%', bold: true },
                    { text: 'Kafka 데이터 파이프라인 재설계 — YoY 거래액 +30%', bold: true },
                    { text: 'CPS 바이럴 광고 모델 도입 — 11시11분·커넥트온·쿠차·와이즈버즈 4개 제휴사', bold: false },
                    { text: 'Braze + GA 연동 CRM 개인화 푸시/배너 광고 시나리오 설계·운영', bold: false },
                    { text: '판매자 광고센터 ADMIN 총괄 — RTB 과금 정책, 광고액 CAP, 리스크 검수', bold: false },
                    { text: '소카테고리별 상품 등급 세팅 — YoY 월평균 수익성 20% 개선', bold: false },
                    { text: '바이럴 광고 실적 관리 시스템 — Power BI 활용 채널·지면별 성과 체계화', bold: false },
                    { text: '신규 제휴사 역 EP 활용 자동화 쿠폰 시스템 기획·운영', bold: false },
                  ].map((item, i) => (
                    <p key={i} className={`text-[9px] leading-snug flex gap-1 ${item.bold ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      <span className={`shrink-0 ${item.bold ? 'text-indigo-500' : 'text-gray-300'}`}>▸</span> {item.text}
                    </p>
                  ))}
                </div>
              </div>

              {/* 하나금융티아이 */}
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-bold text-[11.5px]">하나금융티아이</p>
                  <span className="text-[9px] text-gray-400">2020.09 – 2021.02 (6개월)</span>
                </div>
                <p className="text-[10px] text-indigo-600 font-semibold mb-1.5">DT University팀 · 인턴</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {[
                    '하나금융 그룹(전사) 임직원 대상 DT 교육 기획 보조 및 운영',
                    '오프라인 교육 진행 및 교육 관련 민원 처리',
                    '사내·외 교육 파트너 커뮤니케이션 (엘리스, 멀티캠퍼스, 패스트캠퍼스)',
                    '신입사원 교육 프로그램 운영 보조',
                  ].map((item, i) => (
                    <p key={i} className="text-[9px] text-gray-500 leading-snug flex gap-1">
                      <span className="text-gray-300 shrink-0">▸</span> {item}
                    </p>
                  ))}
                </div>
              </div>

              {/* 개인 프로젝트 */}
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-bold text-[11.5px]">개인 기술 프로젝트 (Full-Stack)</p>
                  <span className="text-[9px] text-gray-400">2025 – 현재</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {[
                    'AURORA — 92,000줄, 8개 ML 앙상블, 24/7 자율 운영 퀀트 트레이딩 시스템',
                    'Teflon — YOLOv8 5종 결함 검출, 멀티카메라, 산업 프로토콜 연동 검사 시스템',
                  ].map((item, i) => (
                    <p key={i} className="text-[9px] text-gray-700 font-medium leading-snug flex gap-1">
                      <span className="text-indigo-500 shrink-0">▸</span> {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-[13px] font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <span className="w-1 h-4 bg-indigo-500 rounded-full inline-block" />
              Skills & Tools
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Python', 'SQL', 'XGBoost', 'LightGBM', 'CatBoost', 'YOLOv8',
                'FastAPI', 'Docker', 'Kafka', 'OpenCV', 'Pandas', 'scikit-learn',
                'GA4', 'Tableau', 'Power BI', 'Braze', 'Figma', 'Git',
              ].map((s) => (
                <span key={s} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px] text-gray-700">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Page Number */}
          <p className="text-[8px] text-gray-300 text-center pt-4">1 / 3</p>
        </div>

        {/* ════════════════════════════════════════════
            PAGE 2 — 핵심 프로젝트 상세 (이미지 포함)
        ════════════════════════════════════════════ */}
        <div className="page-break px-8 pt-5 pb-3">
          <h2 className="text-[14px] font-extrabold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block" />
            주요 프로젝트
          </h2>

          <div className="space-y-3">
            {FEATURED_PROJECTS.map((p, idx) => (
              <div key={idx} className="project-card border border-gray-200 rounded-xl p-3">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[12px] font-bold text-gray-900">{p.title}</h3>
                    <p className="text-[9px] text-gray-500">{p.role} · {p.org}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {p.metrics.map((m, mi) => (
                      <div key={m.label} className={`text-center border rounded-lg px-2 py-1 min-w-[48px] ${mi === 0 ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-200'}`}>
                        <div className={`text-[11px] font-extrabold ${mi === 0 ? 'text-indigo-600' : 'text-indigo-400'}`}>{m.value}</div>
                        <div className={`text-[7.5px] ${mi === 0 ? 'text-indigo-400' : 'text-gray-400'}`}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image + Description */}
                <div className="flex gap-3 mb-1.5">
                  <img
                    src={p.image}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    className="w-[130px] h-[78px] object-cover rounded-lg border border-gray-200 shrink-0 bg-gray-50"
                  />
                  <p className="text-[10px] text-gray-700 leading-relaxed flex-1">{p.desc}</p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1">
                  {p.stack.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[8px] text-gray-500">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Page Number */}
          <p className="text-[8px] text-gray-300 text-center pt-3">2 / 3</p>
        </div>

        {/* ════════════════════════════════════════════
            PAGE 3 — 기타 프로젝트 + 활동 + 학력 + 자격증
        ════════════════════════════════════════════ */}
        <div className="page-break px-8 pt-5 pb-4">

          {/* Other Projects */}
          <h2 className="text-[14px] font-extrabold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block" />
            기타 프로젝트
          </h2>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {OTHER_PROJECTS.map((p) => (
              <div key={p.title} className={`bg-gray-50 border border-gray-200 rounded-lg p-2.5 ${p.highlight ? 'border-l-[3px] border-l-indigo-400' : ''}`}>
                <h3 className="text-[10px] font-bold text-gray-800 mb-0.5">{p.title}</h3>
                <p className="text-[9px] text-gray-600 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* 활동 & 봉사 */}
          <h2 className="text-[14px] font-extrabold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block" />
            활동 & 봉사
          </h2>

          <div className="border border-gray-200 rounded-xl p-3 mb-4 space-y-2">
            {/* Mode Ensemble — 이미지 포함 */}
            <div className="flex gap-3 items-start">
              <div className="text-[9px] text-gray-400 w-[85px] shrink-0 pt-0.5">2024.11 – 현재</div>
              <div className="flex-1">
                <p className="font-bold text-[10.5px]">Mode Ensemble 창단 · 단장</p>
                <p className="text-[9px] text-gray-600 leading-snug">
                  20명 규모의 자원봉사 음악 단체를 직접 창단.
                  단원 모집·연습 스케줄·예산·공연 기획까지 전 과정을 주도하며 3년+ 지속 운영 중.
                  푸르메재단 넥슨어린이재활병원 등에서 정기 재능기부 공연
                </p>
              </div>
              <img
                src={`${IMG_BASE}/music/mode-ensemble.jpg`}
                alt="Mode Ensemble 단체사진"
                referrerPolicy="no-referrer"
                className="w-[100px] h-[66px] object-cover rounded-lg border border-gray-200 shrink-0"
              />
            </div>
            {/* 청각장애인 멘토링 */}
            <div className="border-t border-gray-100 pt-2 flex gap-3 items-start">
              <div className="text-[9px] text-gray-400 w-[85px] shrink-0 pt-0.5">2019.09 – 2019.12</div>
              <div className="flex-1">
                <p className="font-bold text-[10.5px]">청각장애인 학생 멘토링</p>
                <p className="text-[9px] text-gray-600 leading-snug">
                  서울애화학교 청각장애 학생 대상 재능기부 멘토링 활동
                </p>
              </div>
            </div>
            {/* 오케스트라 단장 */}
            <div className="border-t border-gray-100 pt-2 flex gap-3 items-start">
              <div className="text-[9px] text-gray-400 w-[85px] shrink-0 pt-0.5">2018.11 – 2019.11</div>
              <div className="flex-1">
                <p className="font-bold text-[10.5px]">대학 오케스트라 단장 · 재능기부</p>
                <p className="text-[9px] text-gray-600 leading-snug">
                  오케스트라 단장으로서 푸르메재단 넥슨어린이재활병원 재능기부 활동 기획·운영
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <h2 className="text-[14px] font-extrabold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-purple-500 rounded-full inline-block" />
            학력
          </h2>

          <div className="border border-gray-200 rounded-xl p-3 mb-3 space-y-2">
            <div className="flex gap-3 items-start">
              <div className="text-[9px] text-gray-400 w-[85px] shrink-0 pt-0.5">2014.03 – 2021.02</div>
              <div>
                <p className="font-bold text-[10.5px]">한성대학교</p>
                <p className="text-[9px] text-gray-600">정보시스템공학과 · 학점 3.01 / 4.5</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-2 flex gap-3 items-start">
              <div className="text-[9px] text-gray-400 w-[85px] shrink-0 pt-0.5">2011.03 – 2014.02</div>
              <div>
                <p className="font-bold text-[10.5px]">부광고등학교</p>
                <p className="text-[9px] text-gray-600">인천</p>
              </div>
            </div>
          </div>

          {/* 자격증 & 수상 */}
          <h2 className="text-[14px] font-extrabold text-gray-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block" />
            자격증 & 수상
          </h2>

          <div className="border border-gray-200 rounded-xl p-3 mb-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {[
                { date: '2018.10', title: '창업경진대회 우수상', org: '한성대학교' },
                { date: '2018.09', title: '공학경진대회 동상', org: '한성대학교' },
                { date: '2010.07', title: '워드프로세서 1급', org: '대한상공회의소' },
                { date: '2010.12', title: '한자능력검정 2급', org: '한자교육진흥회' },
              ].map((c) => (
                <div key={c.title} className="flex gap-2 items-baseline">
                  <span className="text-[8.5px] text-gray-400 w-[48px] shrink-0">{c.date}</span>
                  <span className="text-[9.5px] font-semibold text-gray-800">{c.title}</span>
                  <span className="text-[8.5px] text-gray-400">· {c.org}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-900 mb-0.5">더 자세한 내용은 포트폴리오 사이트에서 확인하세요</p>
              <p className="text-[9.5px] text-gray-500">
                프로젝트별 상세 과정, 인터랙티브 기능, AI 챗봇 어시스턴트가 준비되어 있습니다.
              </p>
              <p className="text-[9.5px] text-indigo-600 font-mono mt-0.5">{SITE_URL}</p>
            </div>
            <div className="text-center shrink-0">
              <img src={QR_URL} alt="Portfolio QR" className="w-[70px] h-[70px] rounded-lg border border-indigo-200" />
              <p className="text-[7.5px] text-gray-400 mt-0.5">QR 스캔</p>
            </div>
          </div>

          {/* Page Number */}
          <p className="text-[8px] text-gray-300 text-center pt-3">3 / 3</p>
        </div>
      </div>
    </>
  );
}
