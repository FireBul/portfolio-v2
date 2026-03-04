# Portfolio V2

Product Manager 포트폴리오 — React 19 + TypeScript SPA

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19, TypeScript 5.8 |
| Styling | Tailwind CSS 4, Framer Motion |
| AI Chat | Gemini API (`@google/genai`) |
| A/B Test | Supabase (event tracking + realtime stats) |
| Analytics | Custom behavioral analytics, Mouse heatmap |
| Build | Vite 6, GitHub Actions → GitHub Pages |

## Project Structure

```
portfolio-v2/
├── public/
├── src/
│   ├── components/
│   │   ├── ABTestReveal.tsx      # Live A/B test panel (Supabase)
│   │   ├── AnalyticsGimmick.tsx  # Session timer & font size tracker
│   │   ├── BehavioralPersona.tsx # Visitor behavior profiling
│   │   ├── Chatbot.tsx           # Gemini AI chatbot
│   │   ├── InAppMessages.tsx     # Contextual in-app messages
│   │   ├── Layout.tsx            # Global layout wrapper
│   │   └── MouseHeatmap.tsx      # Click heatmap overlay
│   ├── data/
│   │   ├── knowledge.ts          # AI chatbot knowledge base
│   │   └── projectDetails.ts     # Project detail content
│   ├── pages/
│   │   ├── Home.tsx              # Landing + CTA (A/B variant)
│   │   ├── About.tsx             # Profile & competencies
│   │   ├── Projects.tsx          # Project gallery grid
│   │   ├── ProjectDetail.tsx     # Individual project detail
│   │   ├── Leadership.tsx        # Leadership projects
│   │   ├── Contact.tsx           # Contact information
│   │   └── PortfolioPDF.tsx      # PDF export view
│   ├── utils/
│   │   ├── analytics.ts          # Session & page tracking
│   │   ├── chatNotify.ts         # Chat notification logic
│   │   ├── crm.ts                # CRM event pipeline
│   │   ├── gemini.ts             # Gemini API client
│   │   ├── markov.ts             # Markov chain predictions
│   │   └── supabase.ts           # Supabase client & A/B events
│   ├── constants.ts              # Project data & nav config
│   ├── App.tsx                   # Router & route definitions
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Pages auto-deploy
├── .env.example
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

## Features

- **A/B Testing** — CTA 버튼 문구를 실제로 분기하고 Supabase에 이벤트 추적
- **AI Chatbot** — Gemini API 기반 프로젝트/경력 Q&A
- **Behavioral Analytics** — 세션 시간, 페이지 전환, 마우스 히트맵, 행동 페르소나 분류
- **In-App Messages** — 방문자 행동에 따른 컨텍스트 메시지
- **Responsive** — 모바일/태블릿/데스크톱 반응형 디자인

## Setup

```bash
npm install
cp .env.example .env
# .env에 VITE_GEMINI_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 설정
npm run dev
```

## Deploy

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 → GitHub Pages 배포.

```
https://firebul.github.io/portfolio-v2/
```
