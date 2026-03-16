import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ── Portfolio Data Store ──
const API_DATA = {
  profile: {
    name: "최원혁",
    title: "Product Manager",
    positioning: "Product Strategy · AI/ML · Growth Execution",
    email: "jarelrs@gmail.com",
    location: "Seoul, South Korea",
    status: "Open to opportunities",
    career: {
      company: "인터파크커머스",
      role: "광고 PM (SRM팀)",
      period: "2021.06 ~ 2025.12",
      duration: "4년 6개월"
    },
    independent_projects: [
      { name: "Teflon Inspection Automation", type: "Industrial AI Platform", scale: "26,700 lines · 23 modules · 97 REST APIs" },
      { name: "AURORA Trading Engine", type: "AI Trading System", scale: "92,000 lines · 8 ML models · 24/7 autonomous" }
    ],
    links: { portfolio: "https://firebul.github.io/portfolio-v2/", github: "https://github.com/pure-flon" }
  },
  projects: [
    { id: "ads-result", name: "광고 지면 개선 & A/B 테스트", category: "advertising", role: "PM", period: "2022~2023", kpi: { ad_revenue: "+80%", ctr: "+100%" } },
    { id: "coupon-flow", name: "최저가 쿠폰 자동화 시스템", category: "automation", role: "PM", period: "2023~2024", kpi: { monthly_gmv: "50억원", automation_rate: "95%" } },
    { id: "seller-center", name: "쎈PICK CPC 광고 상품", category: "advertising", role: "PM", period: "2021~2025", kpi: { advertisers: "3,000+" } },
    { id: "teflon-inspection", name: "Teflon 검사 자동화", category: "ai_platform", role: "Full-stack", period: "2025", kpi: { inference: "33ms", apis: 97, tests: 124 } },
    { id: "aurora-trading", name: "AURORA AI Trading Engine", category: "ai_platform", role: "Architect", period: "2025~", kpi: { sharpe: 5.05, win_rate: "65.2%", models: 8 } },
  ],
  skills: {
    product_management: ["서비스 기획", "PRD/BRD", "A/B 테스트", "KPI 설계", "정산 로직", "FO/BO 설계"],
    ai_ml: ["XGBoost", "LightGBM", "CatBoost", "YOLOv8", "Ensemble", "Feature Engineering"],
    data: ["Python", "SQL", "Tableau", "GA4"],
    system_design: ["REST API", "Docker", "CI/CD", "Protocol Integration"],
    advertising: ["CPC/CPM/CPS", "RTB", "Quality Score", "SSP", "Prebid"],
  },
  stats: {
    career_years: 4.5, total_code_lines: 118700, projects_completed: 7,
    ml_models_deployed: 8, rest_apis_designed: 97, test_cases: 124,
    ad_revenue_increase: "80%", monthly_gmv: "50억원",
    sharpe_ratio: 5.05, win_rate: "65.2%"
  }
};

interface Endpoint {
  method: string;
  path: string;
  description: string;
  params: { name: string; type: string; required: boolean; desc: string }[];
  getData: () => unknown;
}

const ENDPOINTS: Record<string, Endpoint> = {
  profile: { method: 'GET', path: '/profile', description: '프로필 정보 조회', params: [], getData: () => API_DATA.profile },
  projects: { method: 'GET', path: '/projects', description: '전체 프로젝트 목록', params: [{ name: 'category', type: 'string', required: false, desc: 'advertising | automation | ai_platform' }], getData: () => ({ count: API_DATA.projects.length, projects: API_DATA.projects }) },
  'project-detail': { method: 'GET', path: '/projects/:id', description: '프로젝트 상세 조회', params: [{ name: 'id', type: 'string', required: true, desc: '프로젝트 ID (예: teflon-inspection)' }], getData: () => API_DATA.projects.find(p => p.id === 'teflon-inspection') },
  skills: { method: 'GET', path: '/skills', description: '기술 스택 조회', params: [{ name: 'domain', type: 'string', required: false, desc: 'product_management | ai_ml | data' }], getData: () => API_DATA.skills },
  stats: { method: 'GET', path: '/stats', description: '성과 지표 통계', params: [], getData: () => API_DATA.stats },
};

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-400'; // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'text-sky-300' : 'text-emerald-300'; // key : string
      } else if (/true|false/.test(match)) {
        cls = 'text-violet-400';
      } else if (/null/.test(match)) {
        cls = 'text-zinc-500';
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export function ApiDocs() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [activeEndpoint, setActiveEndpoint] = useState('profile');
  const [latency, setLatency] = useState('0');

  const tryEndpoint = (key: string) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setResponses(prev => ({ ...prev, [key]: '' }));

    setTimeout(() => {
      const t0 = performance.now();
      const data = ENDPOINTS[key].getData();
      const json = JSON.stringify(data, null, 2);
      const elapsed = (performance.now() - t0).toFixed(1);
      setLatency(elapsed);
      setResponses(prev => ({ ...prev, [key]: json }));
      setLoading(prev => ({ ...prev, [key]: false }));
    }, 250 + Math.random() * 200);
  };

  return (
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Open API</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          포트폴리오 데이터를 구조화된 JSON으로 조회할 수 있는 클라이언트 사이드 API입니다.
          <br />각 엔드포인트의 <span className="text-emerald-400">Try it</span> 버튼을 클릭하면 실시간 응답을 확인할 수 있습니다.
        </p>
      </motion.div>

      {/* Base URL */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 mb-8 flex items-center gap-4 font-mono text-sm">
        <span className="text-zinc-500 text-xs uppercase tracking-wider">Base URL</span>
        <span className="text-emerald-400">https://firebul.github.io/portfolio-v2/api</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-10">
        {[
          { v: '5', l: 'Endpoints' }, { v: '5', l: 'Projects' }, { v: '12', l: 'Skills' },
          { v: 'JSON', l: 'Format' }, { v: `${latency}ms`, l: 'Latency' }
        ].map(s => (
          <div key={s.l} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{s.v}</div>
            <div className="text-xs text-zinc-500 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Layout */}
      <div className="grid grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <div className="sticky top-24 self-start bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Endpoints</h3>
          <ul className="space-y-1">
            {Object.entries(ENDPOINTS).map(([key, ep]) => (
              <li key={key}>
                <button
                  onClick={() => {
                    setActiveEndpoint(key);
                    document.getElementById(`ep-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-mono text-sm flex items-center gap-2 transition-colors ${
                    activeEndpoint === key ? 'bg-emerald-500/20 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">GET</span>
                  {ep.path}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main */}
        <div className="space-y-6">
          {Object.entries(ENDPOINTS).map(([key, ep]) => (
            <motion.div
              key={key}
              id={`ep-${key}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-800 bg-zinc-900/80">
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">GET</span>
                <span className="font-mono font-semibold text-white">{ep.path}</span>
                <span className="ml-auto text-sm text-zinc-500">{ep.description}</span>
              </div>

              {/* Body */}
              <div className="grid grid-cols-2">
                {/* Params */}
                <div className="p-5 border-r border-zinc-800">
                  <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Parameters</h4>
                  {ep.params.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-zinc-500 text-xs">
                          <th className="text-left pb-2">Name</th>
                          <th className="text-left pb-2">Type</th>
                          <th className="text-left pb-2">Req</th>
                          <th className="text-left pb-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ep.params.map(p => (
                          <tr key={p.name} className="border-t border-zinc-800/50">
                            <td className="py-2 font-mono text-sky-300">{p.name}</td>
                            <td className="py-2"><span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{p.type}</span></td>
                            <td className="py-2 text-zinc-500">{p.required ? 'Yes' : 'No'}</td>
                            <td className="py-2 text-zinc-400">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-zinc-500 text-sm">No parameters</p>
                  )}
                </div>

                {/* Response */}
                <div>
                  <div className="flex items-center justify-between px-5 py-2 bg-[#0f172a] border-b border-zinc-800">
                    <span className="font-mono text-sm text-emerald-400">200 OK</span>
                    <button
                      onClick={() => tryEndpoint(key)}
                      className="px-3 py-1 border border-zinc-700 rounded-md font-mono text-xs text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      {loading[key] ? 'Loading...' : responses[key] ? `${latency}ms` : 'Try it'}
                    </button>
                  </div>
                  <pre className="bg-[#0f172a] p-5 font-mono text-xs leading-relaxed overflow-auto max-h-[400px] text-zinc-400">
                    {responses[key] ? (
                      <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(responses[key]) }} />
                    ) : (
                      <span className="text-zinc-600">{'// Click "Try it" to see the response'}</span>
                    )}
                  </pre>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
