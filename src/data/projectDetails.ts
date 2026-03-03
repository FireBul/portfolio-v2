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
    techStack: ['Google Analytics', 'A/B Testing', 'MySQL', 'Excel', 'Figma', 'JIRA', 'Confluence'],
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
    techStack: ['API 연동', 'JIRA', 'Confluence', 'Data Analysis'],
    learnings: {
      highlight: '외부 파트너사와의 협업 과정에서 커뮤니케이션의 중요성을 다시 한번 깨달았습니다. 명확한 규격 정의와 사전 테스트가 안정적인 서비스 오픈의 핵심임을 확인했습니다.',
      points: [
        '파트너십 관리: 외부 매체와의 원활한 소통 및 협업',
        '시스템 안정성: 대규모 트래픽 처리를 고려한 설계',
        '데이터 모니터링: 오픈 초기 지표 분석을 통한 빠른 최적화'
      ]
    }
  },
  'aurora-automation': {
    subtitle: 'ML 모델의 안전한 운영 배포를 위한 검증 게이트 및 승격 체계 구축',
    overview: {
      background: 'ML 모델 실험 결과가 운영 환경으로 배포되는 과정에서 발생할 수 있는 리스크를 최소화하고, 배포 프로세스를 체계화할 필요성이 대두되었습니다.',
      goal: 'shadow → canary → active 흐름을 명확히 하고, run 단위 추적 및 리스크 통제를 강화하여 운영 안정성과 의사결정 속도를 동시에 개선하는 시스템을 구축했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/aurora-file-tree.svg'
    },
    problems: [
      { title: '배포 리스크', desc: '검증되지 않은 모델 배포로 인한 서비스 장애 위험' },
      { title: '프로세스 부재', desc: '체계적인 모델 승격(Promotion) 프로세스 미비' },
      { title: '추적 어려움', desc: '운영 중인 모델의 버전 및 성능 추적의 한계' }
    ],
    solutionGoal: '안전하고 자동화된 ML 모델 배포 파이프라인을 구축하여 운영 리스크를 줄이고 모델 업데이트 주기를 단축했습니다.',
    process: [
      { step: 1, title: '프로세스 설계', desc: 'Shadow, Canary, Active 단계별 검증 기준 수립' },
      { step: 2, title: '파이프라인 구축', desc: 'CI/CD 파이프라인과 연동된 자동화된 배포 흐름 구현' },
      { step: 3, title: '모니터링 체계', desc: '모델 성능 및 시스템 지표 모니터링 대시보드 구축' },
      { step: 4, title: '가드레일 적용', desc: '이상 징후 발생 시 자동 롤백 및 알림 시스템 적용' }
    ],
    results: {
      before: '수동/비정형 배포',
      after: '체계적 자동화 배포',
      metrics: [
        { value: '승격 체계', label: '운영 방식 정립' },
        { value: '안정성', label: '운영 리스크 감소' },
        { value: '가드레일', label: '통제력 강화' }
      ]
    },
    techStack: ['MLOps', 'CI/CD', 'Monitoring', 'Python', 'Kubernetes'],
    learnings: {
      highlight: '모델의 성능뿐만 아니라 운영 환경에서의 안정성과 배포 프로세스의 체계화가 ML 프로젝트의 성공에 필수적임을 확인했습니다.',
      points: [
        '운영 안정성: 서비스 장애를 최소화하는 방어적 배포 전략',
        '자동화의 힘: 수동 개입을 줄여 휴먼 에러 방지 및 속도 향상',
        '지속적 모니터링: 배포 후 모델 성능 저하(Drift)에 대한 빠른 대응'
      ]
    }
  },
  'teflon-inspection': {
    subtitle: '비전 기반 검사 자동화의 현장 적용성 및 운영 효율성 극대화',
    overview: {
      background: '제조 현장의 테플론 검사 공정을 자동화하기 위해 비전 모델을 도입했으나, 실제 현장 작업자들이 사용하기에 불편함이 있었고 유지보수가 어려웠습니다.',
      goal: '검사 자동화를 모델 성능 중심이 아니라 현장 배포 및 운영 관점으로 확장하여, 카메라 연결 안정화, 운영 UI 구조, 업그레이드 흐름까지 전체 시스템을 재설계했습니다.',
      image: 'https://firebul.github.io/portfolio/assets/images/projects/teflon-file-tree.svg'
    },
    problems: [
      { title: '현장 사용성 저하', desc: '작업자 친화적이지 않은 UI 및 복잡한 조작' },
      { title: '시스템 불안정', desc: '카메라 연결 끊김 등 하드웨어 연동 이슈' },
      { title: '유지보수 어려움', desc: '모델 업데이트 및 시스템 업그레이드 프로세스 부재' }
    ],
    solutionGoal: '현장 작업자가 쉽게 사용할 수 있는 직관적인 UI를 제공하고, 시스템 안정성을 확보하여 실제 제조 라인에 성공적으로 안착시켰습니다.',
    process: [
      { step: 1, title: '현장 요구사항 수집', desc: '실제 작업자 인터뷰 및 페인포인트 도출' },
      { step: 2, title: 'UI/UX 재설계', desc: '직관적이고 조작이 간편한 운영 화면 기획' },
      { step: 3, title: '안정성 강화', desc: '하드웨어 연동 로직 개선 및 예외 처리 강화' },
      { step: 4, title: '배포 프로세스', desc: '무중단 모델 업데이트 및 시스템 업그레이드 체계 구축' }
    ],
    results: {
      before: '모델 성능 중심',
      after: '현장 운영 중심',
      metrics: [
        { value: '비전 기반', label: '핵심 기술' },
        { value: '적용성 향상', label: '운영 성과' },
        { value: '배포 고려', label: '시스템 특징' }
      ]
    },
    techStack: ['Computer Vision', 'UI/UX Design', 'Hardware Integration', 'Python'],
    learnings: {
      highlight: 'AI 모델의 성능이 아무리 좋아도, 실제 현장에서 사용하기 불편하다면 가치를 창출할 수 없다는 것을 깊이 깨달았습니다. 기술 중심이 아닌 사용자 중심의 접근이 중요합니다.',
      points: [
        '사용자 중심 설계: 현장 작업자의 눈높이에 맞춘 UI/UX',
        '시스템 안정성: 예기치 않은 하드웨어 이슈에 대한 견고한 대응',
        '운영 관점: 개발 이후의 유지보수 및 업그레이드까지 고려한 설계'
      ]
    }
  }
};
