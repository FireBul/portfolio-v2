export const knowledgeBase = [
  {
    keywords: ['hello', 'hi', '안녕', '반가워', '안녕하세요'],
    response: "안녕하세요! 저는 Jarel의 포트폴리오 챗봇입니다. 프로젝트, 경력, 연락처 등에 대해 물어보세요."
  },
  {
    keywords: ['project', '프로젝트', '포트폴리오', 'portfolio', '작업'],
    response: "주요 프로젝트로는 '상품 최종 지면 광고 개선', '최저가 쿠폰 자동화 시스템', '외부 채널 추가 프로젝트' 등이 있습니다. Projects 페이지에서 자세한 내용을 확인하실 수 있습니다."
  },
  {
    keywords: ['ads', '광고', '지면'],
    response: "'상품 최종 지면 광고 개선' 프로젝트는 광고 효율을 높이기 위해 지면 UI/UX를 개선하고 추천 로직을 고도화한 프로젝트입니다. 전환율(CVR) 상승에 기여했습니다."
  },
  {
    keywords: ['coupon', '쿠폰', '최저가'],
    response: "'최저가 쿠폰 자동화 시스템'은 수동으로 발급하던 쿠폰을 자동화하여 운영 리소스를 크게 절감하고 타겟팅 효율을 높인 프로젝트입니다."
  },
  {
    keywords: ['contact', '연락', '이메일', 'email', '메일'],
    response: "Contact 페이지의 폼을 통해 메시지를 남겨주시거나, jarelrs@gmail.com 으로 이메일을 보내주시면 감사하겠습니다."
  },
  {
    keywords: ['tech', 'stack', '기술', '스택', 'react', 'typescript', '스킬'],
    response: "주로 React, TypeScript, Node.js, Tailwind CSS 등을 사용하며, 데이터 분석 및 자동화 파이프라인 구축 경험도 있습니다."
  },
  {
    keywords: ['crm', 'analytics', '데이터', '분석'],
    response: "현재 이 사이트에는 데모용 CRM 및 Analytics 시스템이 구축되어 있습니다. 귀하의 행동(페이지 뷰, 스크롤 등)이 로컬 dataLayer에 기록되고 있습니다!"
  },
  {
    keywords: ['about', '소개', '누구', 'who'],
    response: "저는 데이터 기반의 의사결정과 자동화를 통해 비즈니스 임팩트를 창출하는 Product Manager / Engineer 입니다. About 페이지에서 더 자세한 이야기를 확인해 보세요."
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
