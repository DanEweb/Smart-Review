export interface TranslationKeys {
  common: {
    close: string;
    settings: string;
    expand: string;
    noResults: string;
    save: string;
    saved: string;
    cancel: string;
    delete: string;
    edit: string;
    embed: string;
  };
  editor: {
    placeholder: string;
    demoTitle: string;
    demoBody: string;
    demoHint: string;
  };
  sidebar: {
    pages: string;
    newPage: string;
    demoPages: {
      marchReview: string;
      q1Goals: string;
      productAnalysis: string;
    };
  };
  outline: {
    title: string;
    emptyHint: string;
    emptyHeading: string;
  };
  tabs: {
    newTab: string;
    closeTab: string;
    splitView: string;
    closeSplit: string;
    untitled: string;
  };
  toolbar: {
    undo: string;
    redo: string;
    heading1: string;
    heading2: string;
    heading3: string;
    bold: string;
    italic: string;
    strikethrough: string;
    inlineCode: string;
    bulletList: string;
    orderedList: string;
    checklist: string;
    quote: string;
    divider: string;
  };
  slashCommand: {
    heading1: { title: string; description: string };
    heading2: { title: string; description: string };
    heading3: { title: string; description: string };
    paragraph: { title: string; description: string };
    bulletList: { title: string; description: string };
    checklist: { title: string; description: string };
    quote: { title: string; description: string };
    code: { title: string; description: string };
    divider: { title: string; description: string };
    chart: { title: string; description: string };
    kpi: { title: string; description: string };
    embed: { title: string; description: string };
    toggle: { title: string; description: string };
    callout: { title: string; description: string };
    dashboard: { title: string; description: string };
  };
  blocks: {
    chart: {
      closeEsc: string;
    };
    embed: {
      urlPrompt: string;
      embedButton: string;
      changeUrl: string;
    };
    toggle: {
      defaultSummary: string;
    };
    callout: {
      defaultText: string;
    };
  };
  chartConfig: {
    title: string;
    chartTitle: string;
    chartTitlePlaceholder: string;
    series: string;
    addSeries: string;
    seriesName: string;
    chartType: string;
    dataKey: string;
    axis: string;
    color: string;
    smooth: string;
    stack: string;
    stackGroup: string;
    axes: string;
    addAxis: string;
    axisLabel: string;
    position: string;
    left: string;
    right: string;
    format: string;
    number: string;
    currency: string;
    percent: string;
    scale: string;
    linear: string;
    log: string;
    min: string;
    max: string;
    auto: string;
    options: string;
    showLegend: string;
    showTooltip: string;
    showDataZoom: string;
    bar: string;
    line: string;
    area: string;
    scatter: string;
    xAxisKey: string;
    removeSeries: string;
    removeAxis: string;
    apply: string;
  };
  demo: {
    months: readonly string[];
    chartTitle: string;
    axisLabels: {
      revenue: string;
      profitRate: string;
    };
    seriesLabels: {
      revenue: string;
      profit: string;
      profitRate: string;
    };
    kpi: {
      totalRevenue: string;
      avgProfitRate: string;
      totalOrders: string;
      monthlyAvgRevenue: string;
    };
    embedTitle: string;
  };
  dataSource: {
    title: string;
    clickToUpload: string;
    uploading: string;
    noSources: string;
    rows: string;
    cols: string;
    preview: string;
    dashboard: string;
    selectSource: string;
    demoData: string;
    bindData: string;
  };
  presentation: {
    startPresentation: string;
    exitPresentation: string;
    slideOf: string;
    prevSlide: string;
    nextSlide: string;
    annotations: string;
    pen: string;
    highlighter: string;
    eraser: string;
    clearAll: string;
    colors: string;
    pressEscToExit: string;
  };
  collaboration: {
    startCollab: string;
    stopCollab: string;
    roomId: string;
    connectedAs: string;
    enterRoomId: string;
    join: string;
    leave: string;
    collaborating: string;
  };
  exportDoc: {
    exportPDF: string;
    exportPNG: string;
    exporting: string;
    exportDone: string;
  };
  language: {
    label: string;
    ja: string;
    ko: string;
    en: string;
  };
}
