export const NAV_LINKS = [
  { name: '홈', path: '/' },
  { name: '소개', path: '/about' },
  { name: '프로젝트', path: '/projects' },
  { name: '리더십', path: '/leadership' },
  { name: '연락처', path: '/contact' },
];

export const PROJECTS = [
  {
    id: 'ads-result',
    title: '상품 최종 지면 광고 개선',
    category: 'advertising',
    description: '상품 최종 지면에 새로운 광고 영역을 추가하는 프로젝트를 진행했습니다. A/B 테스트를 통해 사용자 경험을 해치지 않으면서도 광고액 80% 상승과 CTR 100% 상승을 달성했습니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/ads-result.png',
    tags: ['PM', 'A/B 테스트', 'UX 개선', '디스플레이 광고'],
    link: '/projects/ads-result',
    metrics: [
      { label: '광고액', value: '80% ↑' },
      { label: 'CTR', value: '100% ↑' },
      { label: '기간', value: '3개월' }
    ]
  },
  {
    id: 'coupon-flow',
    title: '최저가 쿠폰 자동화 시스템',
    category: 'automation',
    description: '네이버, 에누리, 다나와 등 가격 비교 채널에서 실시간 자동화 쿠폰을 기획했습니다. 네이버 EP API를 활용하여 데이터 기반 의사결정으로 월 50억원 거래액 수준의 대규모 쿠폰 시스템을 구축했습니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/coupon-flow.png',
    tags: ['자동화', '빅데이터', 'PM'],
    link: '/projects/coupon-flow',
    metrics: [
      { label: '월 거래액', value: '50억원' },
      { label: 'YoY 성장', value: '30%' },
      { label: '수익성', value: '20% ↑' }
    ]
  },
  {
    id: 'viral-ads',
    title: '바이럴 광고 CPS 모델 도입',
    category: 'data',
    description: '11시11분, 커넥트온, 쿠차, 와이즈버즈 등 제휴사의 바이럴 광고에 CPS(Cost Per Sale) 모델을 새롭게 도입하여 수익 모델을 다변화했습니다. 백어드민 시스템 설계부터 정산 프로세스 표준화까지 전체 비즈니스 프로세스를 재설계했습니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/viral-ads-system.png',
    tags: ['CPS 리워드 광고', '0→1 기획', '정산 자동화'],
    link: '/projects/viral-ads',
    metrics: [
      { label: '혁신', value: 'CPS 모델' },
      { label: '시스템', value: '백어드민' },
      { label: '제휴사', value: '4개사' }
    ]
  },
  {
    id: 'crm-campaign',
    title: 'CRM 툴 활용 개인화 광고',
    category: 'crm',
    description: 'Braze와 GA를 연동하여 개인화 푸시 광고 및 배너 광고를 기획하고 운영했습니다. 사용자 행동 데이터를 분석하여 맞춤형 광고 시나리오를 설계하고 CPC 시나리오를 통해 광고 효율을 개선했습니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/crm-campaign.jpg',
    tags: ['Braze/MMP', '개인화 광고', 'CPC 과금'],
    link: '/projects/crm-campaign',
    metrics: [
      { label: '도구', value: 'Braze, GA' },
      { label: '유형', value: '푸시/배너' },
      { label: '성과', value: '개인화' }
    ]
  },
  {
    id: 'external-channel',
    title: '외부 채널 추가 프로젝트',
    category: 'advertising',
    description: '넥스트페이퍼, 노티플러스 등 신규 외부 채널을 추가하는 프로젝트를 담당했습니다. 각 채널의 특성을 분석하고 최적의 연동 방안을 설계하여 광고 채널 다변화를 통한 수익 확대를 달성했습니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/external-channel.png',
    tags: ['SSP 매체 연동', '광고 태그', 'PM'],
    link: '/projects/external-channel',
    metrics: [
      { label: '신규 채널', value: '2개' },
      { label: '기간', value: '4개월' },
      { label: '성과', value: '채널 확장' }
    ]
  },
  {
    id: 'seller-admin',
    title: '판매자 광고 센터 ADMIN 운영',
    category: 'policy',
    description: '판매자 광고 센터의 운영 체계를 총괄 기획하며 서비스 안정성과 수익성을 동시에 확보했습니다. 소프트웨어 등 고위험 광고에 대한 품질 관리 프로세스를 설계하고 RTB 과금 최적화 및 채널별 광고액 관리 정책 등 핵심 비즈니스 정책을 수립했습니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/seller-admin.png',
    tags: ['DSP/RTB', '광고 품질 관리', '과금 정책'],
    link: '/projects/seller-admin',
    metrics: [
      { label: '총괄기획', value: 'ADMIN 운영' },
      { label: '시스템설계', value: '품질관리' },
      { label: '정책수립', value: 'RTB, CAP' }
    ]
  },
  {
    id: 'data-structure',
    title: '데이터 수집 구조 개선',
    category: 'data',
    description: '기존 데이터 수집 구조의 한계를 개선하기 위해 Kafka 신규 topic을 생성하고 수집 구조를 변경했습니다. 이를 통해 YoY 월평균 거래액 30% 증가를 달성했으며, 더욱 안정적이고 확장 가능한 데이터 인프라를 구축했습니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/data-structure.png',
    tags: ['광고 데이터 파이프라인', 'Kafka', 'ROAS 측정'],
    link: '/projects/data-structure',
    metrics: [
      { label: 'YoY 성장', value: '30%' },
      { label: '기술', value: 'Kafka' },
      { label: '안정성', value: '향상' }
    ]
  },
  {
    id: 'settlement-logic',
    title: '판매자 쿠폰 정산 로직 개선',
    category: 'policy',
    description: '기존 쿠폰 정산 방식의 문제점을 해결하기 위해 정산 로직을 개선했습니다. 할인 전 판매가액 기준으로 수수료를 부과하는 방식으로 변경하여 판매자와 플랫폼 모두에게 공정한 정산 구조를 구축했습니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/settlement-logic.png',
    tags: ['광고 정산', '수수료 모델', '라이프사이클 리드'],
    link: '/projects/settlement-logic',
    metrics: [
      { label: '정산 방식', value: '개선' },
      { label: '공정성', value: '향상' },
      { label: '만족도', value: '증가' }
    ]
  },
  {
    id: 'ai-trading-engine',
    title: 'AI 트레이딩 엔진 (Private)',
    category: 'private',
    description: '92,000줄 Python 코드베이스의 24/7 자율 운영 퀀트 트레이딩 시스템입니다. XGBoost/LightGBM/CatBoost 기반 8개 ML 앙상블 모델, 172개 기술 지표, 5중 안전 게이트, Catalyst 24/7 모니터링 데몬으로 글로벌 파생상품 거래소에서 실시간 운영 중입니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/aurora-dashboard.png',
    tags: ['ML 앙상블', '자동화', 'Full-Stack'],
    link: '/projects/ai-trading-engine',
    metrics: [
      { label: 'ML 모델', value: '8개 앙상블' },
      { label: 'Sharpe', value: '5.05' },
      { label: 'Win Rate', value: '65.2%' }
    ]
  },
  {
    id: 'teflon-inspection',
    title: 'Teflon AI 검사 자동화 시스템 (Private)',
    category: 'private',
    description: 'YOLOv8 기반 실시간 결함 검출, 멀티카메라(USB/IP/Basler) 통합, GPIO/Modbus/OPC-UA 산업 프로토콜 연동까지 갖춘 풀스택 제조 검사 자동화 시스템입니다. 26,700줄 Python, 97개 REST API, 124개 테스트 케이스로 구성됩니다.',
    image: 'https://firebul.github.io/portfolio/assets/images/projects/teflon-dashboard.png',
    tags: ['YOLOv8', '산업 IoT', 'Full-Stack'],
    link: '/projects/teflon-inspection',
    metrics: [
      { label: '추론 속도', value: '33ms' },
      { label: 'REST API', value: '97개' },
      { label: '결함 검출', value: '5종 클래스' }
    ]
  }
];

export const LEADERSHIP_PROJECTS = [
  {
    id: 'mode-ensemble',
    title: '모드앙상블 창단 및 운영',
    description: '20명 규모의 자원봉사 음악 단체를 창단하고 체계적으로 운영하는 리더십 프로젝트',
    image: 'https://firebul.github.io/portfolio/assets/images/music/mode-ensemble.jpg',
    tags: ['Leadership', 'Community', 'Music'],
    metrics: [
      { label: '조직 규모', value: '20명' },
      { label: '운영 기간', value: '3년+' }
    ]
  }
];

export const CORE_COMPETENCIES = [
  {
    title: 'Problem Solving',
    description: '현상에서 문제를 정의하고 원인을 고민하며 이를 해결해내는 추진력을 갖추었습니다.'
  },
  {
    title: 'Data Literacy',
    description: '데이터를 이해하고 분석하여 인사이트를 도출하고, 이를 바탕으로 전략적인 의사결정을 내릴 수 있습니다.'
  },
  {
    title: 'Service Planning and Execution',
    description: '사용자 니즈를 파악하고 이를 반영한 서비스 기획부터 실행까지 전체 과정을 효과적으로 관리할 수 있습니다.'
  }
];

export const KEY_METRICS = [
  { label: '광고액 상승', value: '80%' },
  { label: '월 쿠폰 거래액', value: '50억' },
  { label: '커머스 PM 리드 경험', value: '3.5년+' },
  { label: '모드앙상블 조직 규모', value: '20명' }
];
