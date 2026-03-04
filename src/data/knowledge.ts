export const knowledgeBase = [
  {
    keywords: ['hello', 'hi', '안녕', '반가워', '안녕하세요'],
    response: "안녕하세요! 저는 최원혁의 포트폴리오 AI 어시스턴트입니다. 프로젝트, 경력, 기술 스택 등에 대해 물어보세요."
  },
  {
    keywords: ['project', '프로젝트', '포트폴리오', 'portfolio', '작업'],
    response: "인터파크 커머스 프로젝트 8개(광고 개선, 쿠폰 자동화, CPS 도입 등)와 개인 프로젝트 2개(AI 트레이딩 엔진, Teflon AI 검사)가 있습니다. Projects 페이지에서 확인하세요."
  },
  {
    keywords: ['ads', '광고', '지면'],
    response: "'상품 최종 지면 광고 개선' — A/B 테스트로 광고액 80%↑, CTR 100%↑ 달성. 사용자 경험을 유지하면서 광고 효율을 극대화했습니다."
  },
  {
    keywords: ['coupon', '쿠폰', '최저가'],
    response: "'최저가 쿠폰 자동화 시스템' — 네이버 EP API + Kafka 활용, 월 50억원 거래액, YoY 30% 성장, 수익성 20% 개선을 달성했습니다."
  },
  {
    keywords: ['트레이딩', 'trading', 'quant', '퀀트', 'ml', '엔진'],
    response: "AI 트레이딩 엔진은 92,000줄 Python 기반 24/7 자율 운영 퀀트 트레이딩 시스템입니다. 8개 ML 앙상블 모델, Sharpe 5.05, Win Rate 65.2%, 5중 안전 게이트, Catalyst 모니터링 데몬으로 실시간 운영 중입니다."
  },
  {
    keywords: ['teflon', '테플론', '검사', 'inspection', 'yolo', 'vision'],
    response: "Teflon AI 검사 시스템은 YOLOv8 기반 실시간 결함 검출(33ms), 멀티카메라 통합, GPIO/Modbus/OPC-UA 산업 프로토콜 연동 풀스택 시스템입니다. 26,700줄 Python, 97개 REST API."
  },
  {
    keywords: ['contact', '연락', '이메일', 'email', '메일'],
    response: "Contact 페이지에서 메시지를 남기시거나 jarelrs@gmail.com으로 이메일 보내주세요."
  },
  {
    keywords: ['tech', 'stack', '기술', '스택', 'react', 'typescript', '스킬'],
    response: "PM: GA4, Braze, SQL, A/B Testing, JIRA. 개발: Python, React, TypeScript, Node.js, Kafka, Supabase, Tailwind CSS. ML: XGBoost, LightGBM, CatBoost, YOLOv8."
  },
  {
    keywords: ['ab', 'a/b', '테스트', 'experiment'],
    response: "이 사이트에서 실제 A/B 테스트가 진행 중입니다! CTA 버튼 문구를 Supabase로 실시간 추적하고 있으며, 상단 배지를 클릭하면 라이브 결과를 확인할 수 있습니다."
  },
  {
    keywords: ['crm', 'analytics', '데이터', '분석', '방문자', 'visitor'],
    response: "이 사이트는 실시간 방문자 분석(OS/디바이스/국가/브라우저/유입경로), A/B 테스트, 행동 퍼소나 분류, 마우스 히트맵 등 그로스 PM 역량 데모가 탑재되어 있습니다."
  },
  {
    keywords: ['about', '소개', '누구', 'who', '원혁'],
    response: "최원혁 — 인터파크 커머스 PM 3.5년+. 데이터 기반 의사결정, A/B 테스트, 자동화 파이프라인, 그로스 전략이 핵심 역량입니다. About 페이지에서 확인하세요."
  }
];

export const getBotResponse = (message: string): string => {
  const lowerMsg = message.toLowerCase();
  for (const item of knowledgeBase) {
    if (item.keywords.some(kw => lowerMsg.includes(kw))) {
      return item.response;
    }
  }
  return "죄송합니다, 잘 이해하지 못했습니다. '프로젝트', '기술 스택', '연락처' 등에 대해 물어보시면 답변해 드릴 수 있습니다.";
};
