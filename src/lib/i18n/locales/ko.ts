import type { TranslationKeys } from "../types";

const ko: TranslationKeys = {
  // -- Common --
  common: {
    close: "닫기",
    settings: "설정",
    expand: "확대",
    noResults: "결과 없음",
    save: "저장",
    cancel: "취소",
    delete: "삭제",
    edit: "편집",
    embed: "임베드",
  },

  // -- Editor --
  editor: {
    placeholder: "'/' 를 입력하여 블록을 추가하세요...",
    demoTitle: "3월 매출 리뷰",
    demoBody: "이번 달 매출 현황을 분석합니다. 아래에서 주요 지표와 차트를 확인하세요.",
    demoHint: "'/' 를 입력하여 차트, KPI, 임베드 등을 추가할 수 있습니다.",
  },

  // -- Sidebar --
  sidebar: {
    pages: "페이지",
    newPage: "새 페이지",
    demoPages: {
      marchReview: "3월 매출 리뷰",
      q1Goals: "Q1 목표 달성률",
      productAnalysis: "제품별 분석",
    },
  },

  // -- Outline --
  outline: {
    title: "아웃라인",
    emptyHint: "제목을 추가하면 아웃라인이 표시됩니다",
    emptyHeading: "(빈 제목)",
  },

  // -- Tabs --
  tabs: {
    newTab: "새 탭",
    closeTab: "탭 닫기",
    splitView: "분할 보기",
    closeSplit: "분할 닫기",
    untitled: "제목 없음",
  },

  // -- Toolbar --
  toolbar: {
    undo: "실행 취소",
    redo: "다시 실행",
    heading1: "제목 1",
    heading2: "제목 2",
    heading3: "제목 3",
    bold: "굵게",
    italic: "기울임",
    strikethrough: "취소선",
    inlineCode: "인라인 코드",
    bulletList: "글머리 기호",
    orderedList: "번호 목록",
    checklist: "체크리스트",
    quote: "인용",
    divider: "구분선",
  },

  // -- Slash Command Menu --
  slashCommand: {
    heading1: { title: "제목 1", description: "큰 제목" },
    heading2: { title: "제목 2", description: "중간 제목" },
    heading3: { title: "제목 3", description: "작은 제목" },
    paragraph: { title: "본문", description: "일반 텍스트" },
    bulletList: { title: "목록", description: "글머리 기호 목록" },
    checklist: { title: "체크리스트", description: "할 일 목록" },
    quote: { title: "인용", description: "인용문 블록" },
    code: { title: "코드", description: "코드 블록" },
    divider: { title: "구분선", description: "수평 구분선" },
    chart: { title: "차트", description: "데이터 차트 삽입" },
    kpi: { title: "KPI", description: "핵심 지표 카드" },
    embed: { title: "임베드", description: "외부 URL 임베드 (Google Sheets, YouTube 등)" },
    toggle: { title: "토글", description: "접기/펴기 블록" },
    callout: { title: "콜아웃", description: "강조 박스" },
    dashboard: { title: "대시보드", description: "위젯 그리드 삽입" },
  },

  // -- Blocks --
  blocks: {
    chart: {
      closeEsc: "닫기 (ESC)",
    },
    embed: {
      urlPrompt: "임베드할 URL을 입력하세요 (Google Sheets, YouTube 등)",
      embedButton: "임베드",
      changeUrl: "URL 변경",
    },
    toggle: {
      defaultSummary: "클릭하여 펼치기",
    },
    callout: {
      defaultText: "중요한 내용을 입력하세요",
    },
  },

  // -- Chart Config --
  chartConfig: {
    title: "차트 설정",
    chartTitle: "제목",
    chartTitlePlaceholder: "차트 제목을 입력하세요",
    series: "시리즈",
    addSeries: "시리즈 추가",
    seriesName: "시리즈명",
    chartType: "차트 타입",
    dataKey: "데이터 키",
    axis: "축",
    color: "색상",
    smooth: "스무스",
    stack: "스택",
    stackGroup: "스택 그룹",
    axes: "축 설정",
    addAxis: "축 추가",
    axisLabel: "축 라벨",
    position: "위치",
    left: "왼쪽",
    right: "오른쪽",
    format: "포맷",
    number: "숫자",
    currency: "통화",
    percent: "퍼센트",
    scale: "스케일",
    linear: "리니어",
    log: "로그",
    min: "최소값",
    max: "최대값",
    auto: "자동",
    options: "옵션",
    showLegend: "범례 표시",
    showTooltip: "툴팁 표시",
    showDataZoom: "데이터 줌 표시",
    bar: "막대 그래프",
    line: "꺾은선",
    area: "영역",
    scatter: "산점도",
    xAxisKey: "X축 키",
    removeSeries: "시리즈 삭제",
    removeAxis: "축 삭제",
    apply: "적용",
  },

  // -- Demo Data --
  demo: {
    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    chartTitle: "월별 매출 & 이익률",
    axisLabels: {
      revenue: "매출 (만원)",
      profitRate: "이익률 (%)",
    },
    seriesLabels: {
      revenue: "매출",
      profit: "이익",
      profitRate: "이익률",
    },
    kpi: {
      totalRevenue: "총 매출",
      avgProfitRate: "평균 이익률",
      totalOrders: "총 주문수",
      monthlyAvgRevenue: "월평균 매출",
    },
    embedTitle: "Google Sheets 샘플",
  },

  // -- Data Source --
  dataSource: {
    title: "데이터 소스",
    clickToUpload: "클릭하여 업로드",
    uploading: "업로드 중...",
    noSources: "데이터 소스가 없습니다",
    rows: "행",
    cols: "열",
    preview: "미리보기",
    dashboard: "대시보드",
    selectSource: "데이터 소스 선택",
    demoData: "데모 데이터",
    bindData: "데이터 바인드",
  },

  // -- Presentation --
  presentation: {
    startPresentation: "프레젠테이션 시작",
    exitPresentation: "프레젠테이션 종료",
    slideOf: "페이지",
    prevSlide: "이전 슬라이드",
    nextSlide: "다음 슬라이드",
    annotations: "주석",
    pen: "펜",
    highlighter: "형광펜",
    eraser: "지우개",
    clearAll: "전체 지우기",
    colors: "색상",
    pressEscToExit: "ESC로 종료",
  },

  // -- Collaboration --
  collaboration: {
    startCollab: "협업 시작",
    stopCollab: "협업 종료",
    roomId: "룸 ID",
    connectedAs: "접속명",
    enterRoomId: "룸 ID를 입력하세요",
    join: "참가",
    leave: "나가기",
    collaborating: "협업 중",
  },

  // -- Export --
  exportDoc: {
    exportPDF: "PDF 내보내기",
    exportPNG: "PNG 내보내기",
    exporting: "내보내는 중...",
    exportDone: "내보내기 완료",
  },

  // -- Language --
  language: {
    label: "언어",
    ja: "日本語",
    ko: "한국어",
    en: "English",
  },
} as const;

export default ko;
