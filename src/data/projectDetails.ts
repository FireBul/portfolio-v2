export const PROJECT_DETAILS: Record<string, any> = {
  'ads-result': {
    subtitle: 'A/B 테스트를 통한 체계적 검증으로 광고액 80% 상승, CTR 100% 상승을 달성한 지면 개선 프로젝트',
    overview: {
      background: '인터파크 상품 상세페이지의 최종 지면에 새로운 광고 영역을 추가하는 프로젝트를 진행했습니다. 기존 광고 영역의 효율이 정체되어 있는 상황에서 새로운 수익 창출 방안이 필요했습니다.',
      goal: '사용자 경험을 해치지 않으면서도 광고 효과를 극대화할 수 있는 최적의 지면을 찾기 위해 A/B 테스트를 통한 체계적인 검증을 진행했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/ads-overview.png'
    },
    problems: [
      { title: '광고 수익 정체', desc: '기존 광고 지면의 성과가 한계에 도달' },
      { title: '새로운 수익원 필요', desc: '추가적인 광고 인벤토리 확보 필요성' },
      { title: '사용자 경험 고려', desc: 'UX를 해치지 않는 광고 배치 방안 필요' },
      { title: '최적화 필요', desc: '광고 효과를 극대화할 수 있는 지면 설계' }
    ],
    solutionGoal: 'A/B 테스트를 통한 과학적 접근으로 사용자 경험을 해치지 않으면서도 광고 효율을 극대화할 수 있는 최적의 지면을 찾는 것이 목표였습니다.',
    process: [
      { step: 1, title: '현황 분석', desc: '기존 광고 지면의 성과를 분석하고 새로운 지면 추가 가능성을 검토했습니다.' },
      { step: 2, title: '지면 설계', desc: '상품 상세페이지의 사용자 동선을 분석하여 최적의 광고 지면 위치를 설계했습니다.' },
      { step: 3, title: 'A/B 테스트 설계', desc: '기존 지면과 새로운 지면을 비교할 수 있는 A/B 테스트 시나리오를 설계했습니다.' },
      { step: 4, title: '테스트 실행', desc: '실제 사용자를 대상으로 A/B 테스트를 실행하고 데이터를 수집했습니다.' },
      { step: 5, title: '결과 분석 및 적용', desc: '테스트 결과를 분석하고 검증된 지면을 전체 서비스에 적용했습니다.' }
    ],
    results: {
      before: '기존 광고 성과',
      after: '+80% (광고액 상승)',
      metrics: [
        { value: '+80%', label: '광고액 개선' },
        { value: '+100%', label: 'CTR 개선' },
        { value: '유지', label: '사용자 경험' },
        { value: '성공', label: 'A/B 테스트' }
      ]
    },
    techStack: ['Google Analytics', 'A/B Testing', 'MySQL', 'Excel', 'Figma', 'JIRA', 'Confluence', '디스플레이 광고', 'RTB', 'CPM/CPC 과금'],
    learnings: {
      highlight: '이 프로젝트를 통해 A/B 테스트를 통한 데이터 기반 의사결정이 얼마나 중요한지 깨달았습니다. 가설만으로는 예측할 수 없었던 사용자 반응을 실제 데이터로 확인할 수 있었고, 작은 변경이라도 체계적인 검증을 통해 큰 성과를 만들어낼 수 있다는 것을 배웠습니다.',
      points: [
        '데이터 기반 의사결정: 추측이 아닌 실제 데이터를 바탕으로 한 의사결정의 중요성',
        '점진적 개선: 급진적 변화보다는 단계적 접근이 더 안전하고 효과적',
        '사용자 중심 사고: 광고 효율성과 사용자 경험의 균형점 찾기',
        '크로스 팀 협업: 개발, 디자인, 마케팅 팀과의 원활한 소통과 협업'
      ]
    }
  },
  'coupon-flow': {
    subtitle: '네이버 EP API 활용과 데이터 기반 의사결정으로 구축한 월 50억원 거래액 수준의 쿠폰 시스템',
    overview: {
      background: '인터파크 SRM팀에서 네이버, 에누리, 다나와 등 가격 비교 채널에서 실시간 자동화 쿠폰을 기획하고 운영하는 프로젝트를 담당했습니다. 기존 수동 프로세스의 한계를 극복하고 효율성을 극대화하기 위해 시작되었습니다.',
      goal: '네이버 EP API를 활용하여 제휴사에서 지급되는 EP 데이터를 기준으로 쿠폰을 자동 발행하는 시스템을 구축했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/coupon-overview.png'
    },
    problems: [
      { title: '이익율 하락', desc: '쿠폰 발행으로 인한 수익성 저하 문제' },
      { title: '데이터 정합성', desc: '다양한 채널에서 수집되는 데이터의 일관성 확보' },
      { title: '실시간 처리', desc: '대용량 데이터의 실시간 분석 및 처리' },
      { title: '채널별 정책', desc: '각 가격 비교 채널의 상이한 정책 대응' }
    ],
    solutionGoal: '소카테고리별 상품 등급 세팅과 쿠폰 마진율 조정을 통해 YoY 월평균 20% 개선을 달성했습니다. 또한 Kafka 신규 topic 생성을 통한 데이터 수집 구조 변경으로 YoY 월평균 거래액 30% 증가를 이뤄냈습니다.',
    process: [
      { step: 1, title: '데이터 수집', desc: '네이버 EP API, 가격 비교 채널' },
      { step: 2, title: '데이터 처리', desc: '정규화 및 검증, Kafka 연동' },
      { step: 3, title: '분석 엔진', desc: '가격 비교 분석, 수익성 계산' },
      { step: 4, title: '쿠폰 생성', desc: '자동 할인율 계산, 채널별 최적화' },
      { step: 5, title: '배포', desc: '다중 채널 발행, 실시간 모니터링' }
    ],
    results: {
      before: '수동 쿠폰 발행',
      after: '50억원 (월 거래액)',
      metrics: [
        { value: '50억원', label: '월 거래액' },
        { value: '30%', label: 'YoY 성장' },
        { value: '20%', label: '수익성 개선' },
        { value: '자동화', label: '업무 효율' }
      ]
    },
    techStack: ['네이버 EP API', 'Python', 'MySQL', 'Kafka', 'Excel', 'Tableau', 'Power BI', 'GA4', 'JIRA', 'Confluence', 'Slack'],
    learnings: {
      highlight: '네이버 EP API와 Kafka를 활용한 자동화 시스템 구축을 통해 월 50억원 규모의 거래액을 효율적으로 관리할 수 있었습니다. 데이터 기반 의사결정이 비즈니스에 미치는 강력한 임팩트를 실감했습니다.',
      points: [
        '자동화의 중요성: 반복적인 업무의 자동화를 통한 효율성 극대화',
        '데이터 품질 관리: 정확한 데이터가 전체 시스템의 성공 요인',
        '점진적 개선: 단계별 최적화를 통한 지속적인 성과 향상',
        '크로스 도메인 협업: 개발, 마케팅, 영업팀과의 긴밀한 협업 경험'
      ]
    }
  },
  'external-channel': {
    subtitle: '신규 외부 채널 연동을 통한 광고 수익 다변화 및 매체 확장 프로젝트',
    overview: {
      background: '기존 광고 채널의 성장이 둔화됨에 따라 새로운 수익원 발굴이 필요했습니다. 넥스트페이퍼, 노티플러스 등 신규 외부 매체와의 제휴를 통해 광고 채널을 다변화하고자 했습니다.',
      goal: '각 채널의 특성을 분석하고 최적의 연동 방안을 설계하여 안정적인 광고 송출 환경을 구축하고 수익을 확대하는 것이 목표였습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/external-channel.png'
    },
    problems: [
      { title: '수익원 다변화 필요', desc: '기존 채널 의존도 감소 및 신규 수익원 발굴' },
      { title: '채널별 특성 상이', desc: '각 매체의 UI/UX 및 사용자 특성에 맞는 연동 방식 필요' },
      { title: '안정성 확보', desc: '대량의 트래픽을 처리할 수 있는 안정적인 연동 시스템 구축' }
    ],
    solutionGoal: '신규 채널 2곳을 성공적으로 연동하여 월간 광고 수익을 증대시키고, 매체 확장을 통한 비즈니스 성장을 이끌어냈습니다.',
    process: [
      { step: 1, title: '매체 분석', desc: '신규 채널의 특성 및 사용자 층 분석' },
      { step: 2, title: '연동 기획', desc: 'API 연동 규격 정의 및 데이터 흐름 설계' },
      { step: 3, title: '개발 및 테스트', desc: '연동 개발 진행 및 송출 테스트' },
      { step: 4, title: '오픈 및 모니터링', desc: '서비스 오픈 후 지표 모니터링 및 최적화' }
    ],
    results: {
      before: '기존 채널 한정',
      after: '신규 채널 2개 추가',
      metrics: [
        { value: '2개', label: '신규 채널' },
        { value: '4개월', label: '프로젝트 기간' },
        { value: '채널 확장', label: '광고 매체 다변화' }
      ]
    },
    techStack: ['API 연동', 'SSP 매체 연동', '광고 태그 관리', '트래픽 분석', 'JIRA', 'Confluence', 'Data Analysis'],
    learnings: {
      highlight: '외부 파트너사와의 협업 과정에서 커뮤니케이션의 중요성을 다시 한번 깨달았습니다. 명확한 규격 정의와 사전 테스트가 안정적인 서비스 오픈의 핵심임을 확인했습니다.',
      points: [
        '파트너십 관리: 외부 매체와의 원활한 소통 및 협업',
        '시스템 안정성: 대규모 트래픽 처리를 고려한 설계',
        '데이터 모니터링: 오픈 초기 지표 분석을 통한 빠른 최적화'
      ]
    }
  },
  'viral-ads': {
    subtitle: '11시11분, 커넥트온 등 4개 제휴사에 CPS(Cost Per Sale) 리워드 모델을 0→1으로 도입하고, 백어드민 설계부터 정산까지 전 과정을 리드한 광고 상품 기획 프로젝트',
    overview: {
      background: '인터파크 커머스의 바이럴 광고는 기존에 CPA(Cost Per Action) 모델만 운영하고 있어, 제휴사별 성과 측정이 어렵고 수익 구조가 불투명한 상황이었습니다. 새로운 CPS 모델을 도입하여 실제 판매 기반의 광고 과금 체계를 구축할 필요가 있었습니다.',
      goal: '제휴사 광고에 CPS(Cost Per Sale) 과금 모델을 신규 도입하여 성과 기반 정산 체계를 구축하고, 백어드민 시스템 설계부터 정산 프로세스 표준화까지 서비스 라이프사이클 전체를 리드했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/viral-ads-system.png'
    },
    problems: [
      { title: 'CPA 모델의 한계', desc: '액션 기반 과금으로는 실제 매출 기여도를 정확히 측정할 수 없음' },
      { title: '정산 프로세스 부재', desc: 'CPS 모델에 맞는 정산 체계가 없어 수동 정산에 의존' },
      { title: '제휴사별 정책 상이', desc: '4개 제휴사마다 수수료율, 정산 주기, 리포팅 요건이 다름' },
      { title: '백어드민 시스템 필요', desc: '캠페인 관리, 성과 추적, 정산 처리를 위한 운영 도구 필요' }
    ],
    solutionGoal: 'CPS 모델 도입을 통해 실제 판매 기반의 정확한 성과 측정 체계를 구축하고, 4개 제휴사에 대한 표준화된 정산 프로세스를 완성했습니다.',
    process: [
      { step: 1, title: '비즈니스 모델 설계', desc: 'CPS 과금 체계 정의, 수수료율 산정, 제휴사별 계약 조건 정리' },
      { step: 2, title: '백어드민 시스템 기획', desc: '캠페인 생성/관리, 실시간 성과 트래킹, 정산 데이터 집계 기능 설계' },
      { step: 3, title: '트래킹 체계 구축', desc: '클릭 → 구매 전환 추적을 위한 어트리뷰션 로직 구현' },
      { step: 4, title: '정산 프로세스 표준화', desc: '제휴사별 정산 주기, 리포트 양식, 검증 프로세스 수립' },
      { step: 5, title: '제휴사 온보딩', desc: '11시11분, 커넥트온, 쿠차, 와이즈버즈 순차 연동 및 안정화' }
    ],
    results: {
      before: 'CPA 단일 모델',
      after: 'CPS 리워드 모델 도입',
      metrics: [
        { value: 'CPS', label: '신규 과금 모델' },
        { value: '4개사', label: '제휴사 연동' },
        { value: '0→1', label: '서비스 기획' },
        { value: '표준화', label: '정산 프로세스' }
      ]
    },
    techStack: ['CPS 과금 모델', '리워드 광고', '어트리뷰션 트래킹', '백어드민', '정산 자동화', 'JIRA', 'Confluence'],
    learnings: {
      highlight: '0에서 1을 만드는 과정에서 가장 중요한 것은 이해관계자 간의 합의입니다. 제휴사, 내부 개발팀, 정산팀, 법무팀 등 다양한 이해관계자의 요구사항을 조율하고 표준화된 프로세스를 만들어내는 것이 PM의 핵심 역량임을 체감했습니다.',
      points: [
        '0→1 기획의 핵심: 비즈니스 모델 설계부터 운영 도구까지 전체 라이프사이클을 리드하는 경험',
        '이해관계자 관리: 4개 제휴사의 상이한 요구사항을 표준화된 프로세스로 수렴',
        '정산 체계의 중요성: 정확한 어트리뷰션과 투명한 정산이 파트너 신뢰의 기반',
        '확장 가능한 설계: 신규 제휴사 추가 시 최소 비용으로 온보딩할 수 있는 표준 체계 구축'
      ]
    }
  },
  'crm-campaign': {
    subtitle: 'Braze와 GA4를 연동하여 개인화 푸시/배너 광고를 기획하고, CPC 시나리오를 통해 광고 효율을 개선한 CRM 마케팅 프로젝트',
    overview: {
      background: '인터파크 커머스의 기존 광고는 전체 사용자에게 동일한 메시지를 전달하는 매스 마케팅 방식이었습니다. 사용자 행동 데이터를 활용한 개인화 광고 체계를 구축하여 광고 효율을 극대화할 필요가 있었습니다.',
      goal: 'Braze(CRM 자동화 플랫폼)와 Google Analytics를 연동하여 사용자 세그먼트별 맞춤형 푸시/배너 광고를 기획하고, CPC(Cost Per Click) 과금 시나리오를 설계했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/crm-campaign.jpg'
    },
    problems: [
      { title: '매스 마케팅의 한계', desc: '전체 사용자 동일 메시지로 클릭률과 전환율이 저조' },
      { title: '사용자 세그먼트 부재', desc: '행동 기반 사용자 분류 체계가 없어 타겟팅 불가' },
      { title: 'CPC 과금 체계 미흡', desc: '광고 효율을 정확히 측정할 수 있는 과금 모델 필요' },
      { title: 'MMP 연동 부재', desc: '광고 성과를 정확히 어트리뷰션할 수 있는 측정 체계 필요' }
    ],
    solutionGoal: 'Braze의 세그먼테이션 기능과 GA4의 이벤트 데이터를 결합하여 정밀한 사용자 타겟팅 체계를 구축하고, CPC 기반 광고 효율을 극대화했습니다.',
    process: [
      { step: 1, title: 'Braze 세그먼트 설계', desc: '구매 이력, 카테고리 선호, 활동 빈도 기반 사용자 세그먼트 정의' },
      { step: 2, title: 'GA4 이벤트 연동', desc: 'Braze Canvas와 GA4 커스텀 이벤트를 연동하여 전환 추적' },
      { step: 3, title: '광고 시나리오 설계', desc: '세그먼트별 푸시 알림, 인앱 배너, 이메일 캠페인 시나리오 기획' },
      { step: 4, title: 'CPC 과금 모델 적용', desc: 'MMP(Mobile Measurement Partner) 연동으로 클릭 기반 과금 및 ROAS 측정' },
      { step: 5, title: '성과 분석 및 최적화', desc: 'A/B 테스트를 통한 메시지/타이밍/타겟 최적화 반복' }
    ],
    results: {
      before: '매스 마케팅',
      after: '개인화 광고 체계',
      metrics: [
        { value: 'Braze', label: 'CRM 플랫폼' },
        { value: 'GA4', label: '분석 연동' },
        { value: 'CPC', label: '과금 모델' },
        { value: '개인화', label: '세그먼트 타겟팅' }
      ]
    },
    techStack: ['Braze', 'GA4', 'MMP(AppsFlyer)', 'CPC 과금', '개인화 광고', '푸시 알림', 'A/B Testing', 'JIRA', 'Confluence'],
    learnings: {
      highlight: '개인화 광고의 성패는 세그먼트 정의의 정밀도에 달려있습니다. 너무 넓으면 매스 마케팅과 차이가 없고, 너무 좁으면 도달률이 떨어집니다. Braze의 세그먼트 기능과 GA4 데이터를 결합하여 최적의 타겟팅 균형점을 찾는 것이 핵심 인사이트였습니다.',
      points: [
        'CRM 자동화의 효과: Braze Canvas로 사용자 행동 트리거 기반 자동 캠페인 구현',
        'MMP 연동의 가치: 정확한 어트리뷰션으로 광고 채널별 ROAS를 투명하게 측정',
        'CPC 최적화: 클릭 단가를 낮추면서 전환율을 높이는 균형점 발견',
        '반복 테스트의 힘: A/B 테스트를 통한 메시지/타이밍/타겟의 지속적 최적화'
      ]
    }
  },
  'seller-admin': {
    subtitle: '판매자 광고 센터의 운영 체계를 총괄 기획하고, RTB 과금 최적화 및 광고 품질 관리 프로세스를 수립한 DSP/광고 플랫폼 관리 프로젝트',
    overview: {
      background: '인터파크 커머스의 판매자 광고 센터는 판매자가 직접 광고를 생성하고 관리하는 DSP(Demand Side Platform) 성격의 서비스입니다. 서비스 규모가 커지면서 광고 품질 관리, RTB 과금 최적화, 채널별 광고액 관리 등 체계적인 운영 정책이 필요했습니다.',
      goal: '광고 센터 ADMIN 운영 체계를 총괄 기획하여 서비스 안정성과 수익성을 동시에 확보하고, 소프트웨어 등 고위험 광고에 대한 품질 관리 프로세스를 설계했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/seller-admin.png'
    },
    problems: [
      { title: 'RTB 과금 비효율', desc: '경매 로직의 비효율로 인한 광고주/매체 양측의 불만' },
      { title: '광고 품질 이슈', desc: '소프트웨어 등 고위험 카테고리의 광고 품질 관리 미흡' },
      { title: '채널별 관리 부재', desc: '채널별 광고액 상한/하한 관리 정책이 없어 편중 현상 발생' },
      { title: '운영 체계 부재', desc: '광고 심사, 이의 제기, 정산 관련 운영 프로세스 미흡' }
    ],
    solutionGoal: '광고 품질 관리 프로세스와 RTB 과금 최적화를 통해 광고주 만족도와 매체 수익성을 동시에 개선하는 운영 체계를 구축했습니다.',
    process: [
      { step: 1, title: 'RTB 경매 로직 분석', desc: '기존 Second-Price Auction의 비효율 포인트를 분석하고 Quality Score 반영 로직 개선' },
      { step: 2, title: '광고 품질 정책 수립', desc: '소프트웨어/고위험 카테고리 심사 기준, 자동 필터링 규칙 정의' },
      { step: 3, title: '채널별 광고액 관리', desc: '채널별 일/월 예산 상한(Cap) 설정 및 자동 조정 정책 수립' },
      { step: 4, title: '운영 ADMIN 기획', desc: '광고 심사 대시보드, 이의 제기 처리, 정산 리포트 기능 기획' },
      { step: 5, title: '정책 문서화 및 교육', desc: '운영 가이드라인 문서화 및 내부 운영팀 교육' }
    ],
    results: {
      before: '비체계적 운영',
      after: '체계적 광고 운영 체계',
      metrics: [
        { value: 'RTB', label: '과금 최적화' },
        { value: 'QS', label: '품질 관리' },
        { value: 'Cap', label: '광고액 관리' },
        { value: 'ADMIN', label: '운영 체계' }
      ]
    },
    techStack: ['DSP 운영', 'RTB/Second-Price Auction', 'Quality Score', '광고 품질 관리', 'Cap 정책', 'ADMIN 기획', 'JIRA', 'Confluence'],
    learnings: {
      highlight: '광고 플랫폼 운영의 핵심은 광고주(DSP)와 매체(SSP) 양측의 균형입니다. RTB 과금을 최적화하면 광고주 만족도는 올라가지만 매체 수익이 줄 수 있고, 반대도 마찬가지입니다. Quality Score를 활용하여 양측 모두에게 공정한 경매 환경을 만드는 것이 가장 큰 도전이었습니다.',
      points: [
        'DSP/SSP 양측 균형: 광고주 비용 효율성과 매체 수익성의 최적 균형점 설계',
        'RTB 과금의 섬세함: Second-Price + Quality Score 모델이 공정한 경매의 핵심',
        '광고 품질이 생태계를 지킨다: 저품질 광고를 걸러내는 것이 플랫폼 신뢰의 기반',
        '정책 수립의 중요성: 명확한 가이드라인이 운영 효율성과 일관성을 보장'
      ]
    }
  },
  'data-structure': {
    subtitle: 'Kafka 신규 topic 기반 데이터 수집 구조를 변경하여 YoY 월평균 거래액 30% 성장을 달성한 광고 데이터 파이프라인 개선 프로젝트',
    overview: {
      background: '기존 데이터 수집 구조는 단일 topic에 모든 이벤트가 혼합되어 있어, 데이터 처리 지연과 정합성 문제가 빈번했습니다. 광고 성과 측정(ROAS, CTR)의 정확도를 높이기 위해 수집 구조 자체를 재설계할 필요가 있었습니다.',
      goal: 'Kafka 신규 topic을 생성하여 이벤트 유형별 분리된 수집 구조를 구축하고, SSP 연동 데이터를 포함한 전체 광고 데이터 파이프라인을 최적화했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/data-structure.png'
    },
    problems: [
      { title: '단일 topic 병목', desc: '모든 이벤트가 하나의 topic에 혼합되어 처리 지연 발생' },
      { title: 'ROAS 측정 부정확', desc: '데이터 지연으로 인한 광고 성과 측정의 정합성 문제' },
      { title: 'SSP 데이터 누락', desc: '외부 매체(SSP) 연동 데이터의 수집 경로가 불안정' },
      { title: '확장성 한계', desc: '신규 광고 채널 추가 시 기존 구조로는 대응이 어려움' }
    ],
    solutionGoal: '이벤트 유형별 분리된 Kafka topic 체계를 구축하여 데이터 처리 속도와 정합성을 대폭 개선하고, YoY 월평균 거래액 30% 성장을 달성했습니다.',
    process: [
      { step: 1, title: '기존 구조 분석', desc: '현행 데이터 흐름과 병목 지점을 분석하고 개선 방향 수립' },
      { step: 2, title: 'Topic 설계', desc: '이벤트 유형별(impression, click, conversion, settlement) 분리된 topic 구조 설계' },
      { step: 3, title: 'SSP 연동 경로 구축', desc: '외부 매체 데이터를 안정적으로 수집할 수 있는 전용 파이프라인 구축' },
      { step: 4, title: 'ROAS 측정 개선', desc: '실시간 데이터 기반의 정확한 광고 성과 측정 체계 구축' },
      { step: 5, title: '마이그레이션 및 검증', desc: '기존 시스템과 병행 운영 후 점진적 전환 및 정합성 검증' }
    ],
    results: {
      before: '단일 topic 구조',
      after: '이벤트별 분리 구조',
      metrics: [
        { value: '30%', label: 'YoY 거래액 성장' },
        { value: 'Kafka', label: '신규 topic' },
        { value: 'ROAS', label: '측정 정확도 ↑' },
        { value: '안정성', label: '데이터 정합성 ↑' }
      ]
    },
    techStack: ['Kafka', 'Data Pipeline', 'SSP 연동', 'ROAS 측정', 'ETL', 'MySQL', 'Tableau', 'JIRA', 'Confluence'],
    learnings: {
      highlight: '데이터 파이프라인의 구조가 비즈니스 성과를 직접 좌우합니다. 수집 구조를 이벤트별로 분리한 것만으로 처리 속도가 개선되고, 정확한 ROAS 측정이 가능해졌으며, 이것이 의사결정 품질 향상으로 이어져 거래액 30% 성장의 기반이 되었습니다.',
      points: [
        'Topic 분리의 효과: 이벤트 유형별 독립적인 처리로 병목 해소와 확장성 확보',
        'ROAS 측정의 핵심: 정확한 데이터가 정확한 의사결정의 전제조건',
        'SSP 데이터 통합: 외부 매체 데이터까지 포함한 통합 파이프라인이 전체 그림을 완성',
        '점진적 마이그레이션: 병행 운영 후 전환하는 안전한 마이그레이션 전략의 중요성'
      ]
    }
  },
  'settlement-logic': {
    subtitle: '할인 전 판매가액 기준 수수료 방식으로 전환하여 판매자와 플랫폼 모두에게 공정한 정산 구조를 구축한 서비스 라이프사이클 리드 프로젝트',
    overview: {
      background: '기존 쿠폰 정산 방식은 할인 후 금액을 기준으로 수수료를 부과하여, 쿠폰 할인이 커질수록 판매자의 수수료 부담이 불균형해지는 문제가 있었습니다. 판매자와 플랫폼 양측의 공정한 정산 구조를 설계할 필요가 있었습니다.',
      goal: '정산 로직을 할인 전 판매가액 기준으로 전환하여 공정한 수수료 체계를 구축하고, 전체 정산 프로세스의 투명성을 높였습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/settlement-logic.png'
    },
    problems: [
      { title: '불공정한 수수료', desc: '할인 후 금액 기준 수수료로 인한 판매자 불만' },
      { title: '정산 투명성 부족', desc: '복잡한 계산 로직으로 인한 정산 결과 검증 어려움' },
      { title: '정책 변경 리스크', desc: '기존 계약과의 호환성 및 법무 검토 필요' },
      { title: '시스템 영향도', desc: '정산 로직 변경에 따른 전체 시스템 파급 효과 관리' }
    ],
    solutionGoal: '할인 전 판매가액 기준의 투명한 수수료 모델을 설계하고, 판매자/플랫폼 양측의 합의를 이끌어내 전체 정산 체계를 개선했습니다.',
    process: [
      { step: 1, title: '현행 정산 분석', desc: '기존 정산 로직의 문제점과 판매자 불만 사항을 체계적으로 분석' },
      { step: 2, title: '신규 모델 설계', desc: '할인 전 판매가액 기준 수수료 모델 설계 및 시뮬레이션' },
      { step: 3, title: '이해관계자 합의', desc: '판매자, 법무팀, 재무팀, 개발팀 간 합의 도출 및 정책 확정' },
      { step: 4, title: '시스템 반영', desc: '정산 시스템 로직 변경 및 기존 데이터 마이그레이션' },
      { step: 5, title: '검증 및 안정화', desc: '변경 전/후 정산 결과 비교 검증 및 모니터링' }
    ],
    results: {
      before: '할인 후 금액 기준',
      after: '할인 전 판매가액 기준',
      metrics: [
        { value: '공정성', label: '정산 구조 개선' },
        { value: '투명성', label: '계산 로직 명확화' },
        { value: '만족도', label: '판매자 만족도 ↑' },
        { value: '리드', label: '전 과정 주도' }
      ]
    },
    techStack: ['정산 시스템', '수수료 모델', '데이터 마이그레이션', 'MySQL', '이해관계자 관리', 'JIRA', 'Confluence'],
    learnings: {
      highlight: '정산 로직 변경은 기술적 난이도보다 이해관계자 합의가 더 큰 도전입니다. 판매자의 공정성 요구, 플랫폼의 수익성, 법적 요건을 모두 충족하는 모델을 설계하려면 정량적 시뮬레이션과 명확한 커뮤니케이션이 필수입니다.',
      points: [
        '서비스 라이프사이클 리드: 문제 정의부터 설계, 합의, 구현, 검증까지 전 과정을 주도',
        '이해관계자 관리의 핵심: 정량적 데이터(시뮬레이션)가 합의를 이끌어내는 가장 강력한 도구',
        '정산의 투명성: 계산 로직이 명확해야 판매자 신뢰와 플랫폼 정합성이 확보됨',
        '변경 관리의 중요성: 기존 시스템과의 호환성을 유지하면서 점진적으로 전환하는 전략'
      ]
    }
  },
  'ai-trading-engine': {
    subtitle: '92,000줄 Python 코드베이스 · 8개 ML 모델 앙상블 · 5중 안전 게이트로 24/7 자율 운영되는 퀀트 트레이딩 시스템',
    overview: {
      background: '글로벌 파생상품 시장을 대상으로 24시간 자율 운영되는 알고리즘 트레이딩 시스템입니다. 단순 백테스트 수준이 아니라, ML 모델 학습 → 백테스트 검증 → 실시간 시그널 생성 → 주문 실행 → 리스크 관리까지 전체 파이프라인을 직접 설계하고 운영하고 있습니다. 503회 이상의 커밋과 140개 파일, 92,000줄의 코드로 구성된 프로덕션 시스템입니다.',
      goal: '단일 모델의 과적합 리스크를 줄이기 위해 XGBoost, LightGBM, CatBoost 기반 8개 모델을 앙상블하고, 172개 기술 지표 피처를 활용한 다중 전략 시그널을 Combo Pack 단위로 관리합니다. shadow → canary → active 3단계 승격 체계와 5중 안전 게이트(Backup/Integrity/Runtime/Promotion/Tracking)를 통해 운영 안정성을 극대화했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/aurora-dashboard.png'
    },
    problems: [
      { title: '단일 모델 과적합', desc: '하나의 ML 모델에 의존하면 시장 변화에 취약 — 8개 모델 앙상블과 다수결 투표(Consensus) 방식으로 해결' },
      { title: '배포 리스크', desc: '검증 없이 실거래에 투입하면 자금 손실 위험 — Shadow/Canary/Active 3단계 승격 체계 도입' },
      { title: '24/7 무인 운영', desc: '사람이 모니터링하지 않는 시간대의 장애 대응 — Catalyst 데몬 + Telegram 실시간 알림 + 자동 롤백' },
      { title: '대규모 백테스트 관리', desc: '수만 개의 전략 조합을 병렬 테스트하고 추적 — Pinset 병렬 엔진(14 Worker) + run_id 기반 트래킹' }
    ],
    solutionGoal: '3개의 전용 데이터베이스(Ensemble 224MB + Trading 30MB + Pinset 416MB)로 분리된 아키텍처 위에 100개 이상의 API 엔드포인트와 9,190줄 규모의 운영 대시보드를 구축하여, 모델 실험부터 실거래까지 전 과정을 자동화하고 실시간 모니터링할 수 있는 체계를 완성했습니다.',
    process: [
      { step: 1, title: '피처 엔지니어링 & 모델 학습', desc: '172개 기술 지표(RSI, MACD, Bollinger, ATR 등) 기반 피처를 설계하고, XGBoost/LightGBM/CatBoost 3종 엔진으로 8개 모델을 학습. MoE(Mixture of Experts) 앙상블로 시그널 품질 극대화' },
      { step: 2, title: 'Pinset 대규모 병렬 백테스트', desc: '14개 Worker 프로세스로 수만 개의 전략 조합을 병렬 백테스트. Phase 2(개별 검증) → Phase 3(생존율 집계) → Combo Pack 빌드의 3단계 파이프라인으로 33,752건 거래, Sharpe 5.05, 승률 65.2% 달성' },
      { step: 3, title: '안전 승격 체계 & 리스크 관리', desc: 'Draft → Shadow(모의 거래) → Canary(소액 실거래) → Active(정규 운영) 4단계 승격. 5중 게이트(Backup/Integrity/Runtime/Promotion/Tracking Key) 모두 통과해야 다음 단계로 진입' },
      { step: 4, title: '실시간 운영 & 모니터링', desc: '5개 Canary Trader 인스턴스가 거래소에서 동시 운영. Catalyst 24/7 데몬이 헬스체크, PID 모니터링, DB 성장률 감시를 수행하고 Telegram으로 실시간 알림 전송' },
      { step: 5, title: '대시보드 & 의사결정 지원', desc: '9,190줄 규모의 풀스택 대시보드에서 포지션 현황, 수익률 차트, 모델 성능 비교, Combo Pack 관리, 시스템 설정까지 원스톱 운영. 100+ API 엔드포인트로 모든 데이터를 실시간 제공' }
    ],
    results: {
      before: '수동 분석 & 단일 모델',
      after: '24/7 자율 운영 시스템',
      metrics: [
        { value: '8개', label: 'ML 앙상블 모델' },
        { value: '5.05', label: 'Sharpe Ratio' },
        { value: '65.2%', label: 'Win Rate' },
        { value: '92K줄', label: 'Python 코드' }
      ]
    },
    techStack: ['Python', 'XGBoost', 'LightGBM', 'CatBoost', 'SQLite (3 DB)', 'FastAPI', 'Exchange API', 'Telegram Bot', 'launchd', 'GitHub Actions', 'Plotly', 'NumPy', 'Pandas', 'scikit-learn'],
    learnings: {
      highlight: '트레이딩 시스템은 모델 정확도보다 운영 안정성과 리스크 관리가 핵심입니다. 아무리 백테스트 성과가 좋아도 프로덕션에서 장애가 나면 실제 자금 손실로 이어지기 때문에, 5중 안전 게이트와 자동 롤백 체계를 구축한 것이 가장 값진 설계 결정이었습니다.',
      points: [
        '다중 모델 전략이 안정성을 높인다: 여러 관점의 시그널을 종합해 과적합 리스크를 낮추는 운영 체계 구축',
        '안전 게이트가 수익을 지킨다: Shadow → Canary → Active 승격 체계로 검증되지 않은 전략의 실거래 투입을 원천 차단',
        '24/7 무인 운영의 핵심은 관측성: Catalyst 데몬 + Telegram 알림 + 대시보드 3중 모니터링이 없었다면 야간 장애 대응이 불가능했을 것',
        '대규모 병렬 백테스트의 트래킹: run_id/pack_id/decision_uid 기반 추적 체계가 없으면 수만 건의 실험 결과가 의미를 잃음'
      ]
    }
  },
  'teflon-inspection': {
    subtitle: '26,700줄 Python · YOLOv8 실시간 결함 검출 · 97개 REST API · 멀티카메라 · 산업 프로토콜 통합의 풀스택 제조 검사 자동화 시스템',
    overview: {
      background: '테플론 코팅 제품의 결함 검사를 수작업으로 진행하던 제조 현장에서, 검사 속도와 일관성을 높이기 위해 비전 AI 기반 자동화 시스템을 도입했습니다. 단순히 AI 모델만 만드는 것이 아니라, 현장 작업자가 실제로 사용할 수 있는 완전한 시스템(카메라 연동, 산업 프로토콜 통신, 운영 UI, 관리자 대시보드)을 처음부터 끝까지 직접 설계하고 구축했습니다.',
      goal: 'YOLOv8 Nano 모델(6.2MB)로 5종 결함(스크래치, 기포, 이물질, 변색, 코팅 불량)을 33ms 이내에 실시간 검출하고, USB/IP/iPhone/Basler 등 다양한 산업용 카메라를 통합 지원하며, GPIO/Modbus/OPC-UA 프로토콜을 통해 제조 라인의 PLC와 직접 통신하는 엔드투엔드 검사 시스템을 완성했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/teflon-dashboard.png'
    },
    problems: [
      { title: '수작업 검사의 한계', desc: '사람 눈에 의존한 검사는 피로도에 따라 검출률이 크게 변동 — AI 모델로 일관된 품질 확보' },
      { title: '다양한 카메라 환경', desc: 'USB, IP, iPhone, Basler 등 현장마다 다른 카메라 — 통합 카메라 추상화 레이어로 기종 무관 대응' },
      { title: '산업 프로토콜 통합', desc: '제조 라인의 PLC와 실시간 연동 필요 — GPIO/Modbus RTU/TCP/OPC-UA 3종 프로토콜 드라이버 구현' },
      { title: '현장 작업자 사용성', desc: 'IT 비전문가인 작업자가 3교대로 사용 — 17개 이상의 직관적 웹 UI 페이지와 원클릭 Docker 배포' }
    ],
    solutionGoal: '23개 모듈, 26,700줄의 Python 코드로 구성된 풀스택 시스템을 구축했습니다. 97개의 REST API 엔드포인트로 검사 실행, 결과 조회, 카메라 제어, 시스템 설정까지 모든 기능을 제공하고, 124개의 테스트 케이스로 안정성을 검증했습니다.',
    process: [
      { step: 1, title: 'AI 모델 설계 & 학습', desc: 'YOLOv8 Nano(6.2MB) 경량 모델로 5종 결함을 학습. 33ms 이내 추론 속도로 실시간 라인 검사 가능. ONNX 포맷 변환으로 다양한 하드웨어에서 배포 가능' },
      { step: 2, title: '멀티카메라 통합', desc: 'USB 카메라(UVC), IP 카메라(RTSP/ONVIF), iPhone(WiFi), Basler 산업용 카메라를 통합 지원하는 추상화 레이어 설계. 현장별 카메라 기종에 무관하게 동일한 검사 파이프라인 적용' },
      { step: 3, title: '산업 프로토콜 & 하드웨어 연동', desc: 'GPIO(직접 I/O), Modbus RTU/TCP(시리얼/이더넷 PLC), OPC-UA(표준 산업 통신) 3종 프로토콜 드라이버를 구현하여 제조 라인의 PLC, 센서, 액추에이터와 실시간 양방향 통신' },
      { step: 4, title: '운영 웹 UI & 대시보드', desc: '17개 이상의 웹 페이지로 실시간 검사 화면, 결과 이력, 통계 대시보드, 카메라 설정, 모델 관리, 사용자/교대 관리 등 전체 운영 기능 제공. 3교대 작업자 계정 관리 및 교대별 검사 이력 추적' },
      { step: 5, title: '배포 & 품질 보증', desc: 'Docker Compose 기반 원클릭 배포로 현장 설치 간소화. 124개 테스트 케이스(단위/통합/E2E)로 코드 안정성 확보. 97개 REST API로 외부 MES/ERP 시스템 연동 가능' }
    ],
    results: {
      before: '수작업 육안 검사',
      after: 'AI 실시간 자동 검사',
      metrics: [
        { value: '33ms', label: '추론 속도' },
        { value: '5종', label: '결함 검출 클래스' },
        { value: '97개', label: 'REST API' },
        { value: '124개', label: '테스트 케이스' }
      ]
    },
    techStack: ['Python', 'YOLOv8', 'ONNX', 'FastAPI', 'OpenCV', 'Docker', 'SQLite', 'GPIO', 'Modbus RTU/TCP', 'OPC-UA', 'ONVIF', 'RTSP', 'Basler Pylon', 'HTML/CSS/JS', 'Pytest'],
    learnings: {
      highlight: 'AI 모델의 정확도는 전체 시스템의 10%에 불과합니다. 나머지 90%는 카메라 연동, 산업 프로토콜 통신, 현장 UI, 배포 자동화, 테스트 등 "모델 바깥의 엔지니어링"입니다. 현장에서 실제로 쓸 수 있는 시스템을 만드는 것이 진짜 가치입니다.',
      points: [
        'Edge AI의 현실: 6.2MB YOLOv8 Nano로 33ms 추론 — 경량 모델이 현장에서는 더 실용적',
        '산업 프로토콜의 복잡성: GPIO/Modbus/OPC-UA 각각의 타이밍, 에러 핸들링, 재연결 로직이 모델 개발보다 더 도전적',
        '멀티카메라 추상화의 가치: 카메라 기종에 무관한 통합 레이어 덕분에 새로운 현장 배포 시 설정만 변경하면 즉시 적용',
        '테스트가 현장 신뢰를 만든다: 124개 테스트 케이스가 현장 배포 시 "동작 보장"에 대한 확신을 제공'
      ]
    }
  }
};
