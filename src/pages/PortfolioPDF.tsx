import React from 'react';

const SITE_URL = 'https://firebul.github.io/portfolio-v2/';
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(SITE_URL)}`;

/* ── 핵심 프로젝트 (상세 노출) ── */
const FEATURED_PROJECTS = [
  {
    title: '최저가 쿠폰 자동화 시스템',
    role: 'PM · 기획 · 데이터 분석',
    org: '인터파크 SRM팀',
    desc: '네이버 EP API 활용, Kafka 기반 데이터 수집 구조 변경으로 가격 비교 채널(네이버·에누리·다나와) 실시간 자동화 쿠폰 시스템 구축',
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
    desc: '상품 상세페이지 광고 영역 신설 프로젝트. A/B 테스트를 통한 과학적 검증으로 사용자 경험을 해치지 않으면서 광고 효율 극대화',
    metrics: [
      { value: '+80%', label: '광고액' },
      { value: '+100%', label: 'CTR' },
      { value: '유지', label: 'UX 품질' },
    ],
    stack: ['A/B Testing', 'Google Analytics', 'MySQL'],
  },
  {
    title: 'AURORA — 퀀트 트레이딩 시스템',
    role: 'Full-Stack 설계 · ML · 운영',
    org: '개인 프로젝트',
    desc: '92,000줄 Python 코드베이스의 24/7 자율 운영 시스템. XGBoost/LightGBM/CatBoost 8개 모델 앙상블, 172개 기술 지표, 5중 안전 게이트, Catalyst 24/7 모니터링 데몬',
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
    desc: 'YOLOv8 Nano(6.2MB) 기반 5종 결함 실시간 검출. 멀티카메라(USB/IP/Basler) 통합, GPIO/Modbus/OPC-UA 산업 프로토콜 연동, 17+ 운영 웹 UI',
    metrics: [
      { value: '33ms', label: '추론 속도' },
      { value: '97개', label: 'REST API' },
      { value: '124개', label: '테스트' },
    ],
    stack: ['YOLOv8', 'ONNX', 'FastAPI', 'OpenCV', 'Docker', 'Modbus/OPC-UA'],
  },
];

/* ── 기타 프로젝트 (요약) ── */
const OTHER_PROJECTS = [
  { title: '바이럴 광고 CPS 모델 도입', desc: '4개 제휴사 CPS 수익 모델 설계, 백어드민 시스템 구축, 정산 프로세스 표준화' },
  { title: 'CRM 개인화 광고 운영', desc: 'Braze + GA 연동 개인화 푸시/배너 시나리오 설계 및 CPC 최적화' },
  { title: '외부 채널 매체 확장', desc: '넥스트페이퍼, 노티플러스 등 신규 채널 2곳 연동 — 광고 수익원 다변화' },
  { title: '판매자 광고센터 ADMIN', desc: '고위험 광고 품질관리, RTB 과금 최적화, 채널별 광고액 관리 정책 수립' },
  { title: '데이터 수집 구조 개선', desc: 'Kafka 신규 topic 설계로 데이터 파이프라인 재구축 — YoY 거래액 30%↑' },
  { title: '쿠폰 정산 로직 개선', desc: '할인 전 판매가 기준 수수료 부과 방식으로 변경 — 판매자·플랫폼 공정성 확보' },
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
            🖨️ PDF로 저장 (Ctrl+P)
          </button>
          <a
            href="/"
            className="px-4 py-1.5 border border-white/40 rounded-lg text-sm hover:bg-white/10 transition-colors"
          >
            ← 사이트로 돌아가기
          </a>
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
                <span>✉ jarelrs@gmail.com</span>
                <span>📱 010-5765-5765</span>
                <span>🔗 github.com/FireBul</span>
              </div>
            </div>
            <div className="text-center shrink-0">
              <img src={QR_URL} alt="Portfolio QR" className="w-[72px] h-[72px] rounded" />
              <p className="text-[8px] text-gray-400 mt-1">포트폴리오 사이트</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full mb-5" />

          {/* Summary */}
          <div className="mb-5">
            <p className="text-[11.5px] text-gray-700 leading-relaxed">
              인터파크 커머스 광고/SRM팀에서 <strong>3.5년간 PM으로 근무</strong>하며, 월 50억원 거래액의 쿠폰 자동화 시스템 구축, 광고액 80% 상승 등 데이터 기반 성과를 만들어왔습니다.
              현재는 <strong>ML 앙상블 기반 퀀트 시스템</strong>(92K줄)과 <strong>YOLOv8 기반 제조 검사 시스템</strong>(26.7K줄)을 직접 설계·운영하며 기술 역량을 확장하고 있습니다.
            </p>
          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[
              { value: '3.5년+', label: 'PM 경력' },
              { value: '50억원', label: '월 쿠폰 거래액' },
              { value: '+80%', label: '광고액 상승' },
              { value: '92K줄', label: 'AI 트레이딩' },
              { value: '26.7K줄', label: 'AI 검사 시스템' },
            ].map((m) => (
              <div key={m.label} className="text-center bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-1">
                <div className="text-[15px] font-extrabold text-indigo-600">{m.value}</div>
                <div className="text-[9px] text-gray-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Core Competencies */}
          <div className="mb-5">
            <h2 className="text-[13px] font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <span className="w-1 h-4 bg-indigo-500 rounded-full inline-block" />
              Core Competence
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: 'Problem Solving', desc: '현상에서 문제를 정의하고 원인을 분석하여 해결하는 추진력' },
                { title: 'Data Literacy', desc: '데이터 기반 인사이트 도출과 전략적 의사결정 역량' },
                { title: 'Service Planning', desc: '사용자 니즈 파악부터 기획, 실행, 운영까지 전체 관리' },
              ].map((c) => (
                <div key={c.title} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                  <h3 className="text-[10.5px] font-bold text-indigo-600 mb-1">{c.title}</h3>
                  <p className="text-[9.5px] text-gray-600 leading-snug">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="mb-2">
            <h2 className="text-[13px] font-bold text-gray-900 mb-2 flex items-center gap-1.5">
              <span className="w-1 h-4 bg-indigo-500 rounded-full inline-block" />
              Experience
            </h2>
            <div className="space-y-2">
              <div className="flex gap-3 items-start">
                <div className="text-[9px] text-gray-400 w-[80px] shrink-0 pt-0.5">2020.07 – 2024.01</div>
                <div>
                  <p className="font-bold text-[11px]">인터파크 커머스 <span className="font-normal text-gray-500">| 광고팀 · SRM팀 PM</span></p>
                  <p className="text-[9.5px] text-gray-600">광고 지면 기획, 쿠폰 자동화, CRM 캠페인, 외부 채널 연동, 데이터 수집 구조 개선, 정산 정책 수립</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="text-[9px] text-gray-400 w-[80px] shrink-0 pt-0.5">2024 – 현재</div>
                <div>
                  <p className="font-bold text-[11px]">개인 기술 프로젝트</p>
                  <p className="text-[9.5px] text-gray-600">AURORA 퀀트 트레이딩 시스템 (92K줄 Python, 8 ML 앙상블), Teflon AI 검사 시스템 (YOLOv8, 산업 프로토콜)</p>
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
                'GA4', 'Tableau', 'Braze', 'Figma', 'Git', 'GitHub Actions',
              ].map((s) => (
                <span key={s} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px] text-gray-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            PAGE 2 — 핵심 프로젝트 상세
        ════════════════════════════════════════════ */}
        <div className="page-break px-8 pt-6 pb-4">
          <h2 className="text-[16px] font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block" />
            주요 프로젝트
          </h2>

          <div className="space-y-5">
            {FEATURED_PROJECTS.map((p, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[13px] font-bold text-gray-900">{p.title}</h3>
                    <p className="text-[9.5px] text-gray-500">{p.role} · {p.org}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="text-center bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5 min-w-[52px]">
                        <div className="text-[12px] font-extrabold text-indigo-600">{m.value}</div>
                        <div className="text-[8px] text-indigo-400">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[10.5px] text-gray-700 leading-relaxed mb-2">{p.desc}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1">
                  {p.stack.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[8.5px] text-gray-500">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            PAGE 3 — 기타 프로젝트 + 리더십 + 마무리
        ════════════════════════════════════════════ */}
        <div className="page-break px-8 pt-6 pb-6">

          {/* Other Projects */}
          <h2 className="text-[16px] font-extrabold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block" />
            기타 프로젝트
          </h2>

          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {OTHER_PROJECTS.map((p) => (
              <div key={p.title} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h3 className="text-[10.5px] font-bold text-gray-800 mb-1">{p.title}</h3>
                <p className="text-[9.5px] text-gray-600 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Leadership */}
          <h2 className="text-[16px] font-extrabold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block" />
            리더십
          </h2>

          <div className="border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-gray-900">모드앙상블 창단 및 운영</h3>
                <p className="text-[9.5px] text-gray-500 mb-2">20명 규모 자원봉사 음악 단체 · 3년+ 운영</p>
                <p className="text-[10.5px] text-gray-700 leading-relaxed">
                  다양한 배경의 멤버를 모집·관리하며 정기 공연을 기획하고 실행하는 과정에서
                  조직 운영, 일정 관리, 갈등 조율 등 실질적인 리더십 역량을 키웠습니다.
                </p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <div className="text-center bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
                  <div className="text-[13px] font-extrabold text-emerald-600">20명</div>
                  <div className="text-[8px] text-emerald-400">조직 규모</div>
                </div>
                <div className="text-center bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
                  <div className="text-[13px] font-extrabold text-emerald-600">3년+</div>
                  <div className="text-[8px] text-emerald-400">운영 기간</div>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <h2 className="text-[16px] font-extrabold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-purple-500 rounded-full inline-block" />
            학력
          </h2>

          <div className="border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3 items-start">
              <div className="text-[9px] text-gray-400 w-[80px] shrink-0 pt-0.5">2014 – 2020</div>
              <div>
                <p className="font-bold text-[11px]">건국대학교</p>
                <p className="text-[9.5px] text-gray-600">경영학과 졸업</p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[12px] font-bold text-gray-900 mb-1">더 자세한 내용은 포트폴리오 사이트에서 확인하세요</p>
              <p className="text-[10px] text-gray-500">
                프로젝트별 상세 과정, 인터랙티브 기능, AI 챗봇 어시스턴트가 준비되어 있습니다.
              </p>
              <p className="text-[10px] text-indigo-600 font-mono mt-1">{SITE_URL}</p>
            </div>
            <div className="text-center shrink-0">
              <img src={QR_URL} alt="Portfolio QR" className="w-[80px] h-[80px] rounded-lg border border-indigo-200" />
              <p className="text-[8px] text-gray-400 mt-1">QR 스캔</p>
            </div>
          </div>

          {/* Footnote */}
          <p className="text-center text-[8px] text-gray-400 mt-4">
            이 문서는 포트폴리오 사이트({SITE_URL})에서 자동 생성되었습니다. · 최종 업데이트: {new Date().toLocaleDateString('ko-KR')}
          </p>
        </div>
      </div>
    </>
  );
}
