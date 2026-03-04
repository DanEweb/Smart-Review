import type { TranslationKeys } from "../types";

const en: TranslationKeys = {
  // -- Common --
  common: {
    close: "Close",
    settings: "Settings",
    expand: "Expand",
    noResults: "No results",
    save: "Save",
    saved: "Saved",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    embed: "Embed",
  },

  // -- Editor --
  editor: {
    placeholder: "Type '/' to add a block...",
    demoTitle: "March Sales Review",
    demoBody: "Analyzing this month's sales performance. Check the key metrics and charts below.",
    demoHint: "Type '/' to add charts, KPIs, embeds, and more.",
  },

  // -- Sidebar --
  sidebar: {
    pages: "Pages",
    newPage: "New page",
    demoPages: {
      marchReview: "March Sales Review",
      q1Goals: "Q1 Goal Achievement",
      productAnalysis: "Product Analysis",
    },
  },

  // -- Outline --
  outline: {
    title: "Outline",
    emptyHint: "Add headings to see the outline",
    emptyHeading: "(Empty heading)",
  },

  // -- Tabs --
  tabs: {
    newTab: "New tab",
    closeTab: "Close tab",
    splitView: "Split view",
    closeSplit: "Close split",
    untitled: "Untitled",
  },

  // -- Toolbar --
  toolbar: {
    undo: "Undo",
    redo: "Redo",
    heading1: "Heading 1",
    heading2: "Heading 2",
    heading3: "Heading 3",
    bold: "Bold",
    italic: "Italic",
    strikethrough: "Strikethrough",
    inlineCode: "Inline code",
    bulletList: "Bullet list",
    orderedList: "Numbered list",
    checklist: "Checklist",
    quote: "Quote",
    divider: "Divider",
  },

  // -- Slash Command Menu --
  slashCommand: {
    heading1: { title: "Heading 1", description: "Large heading" },
    heading2: { title: "Heading 2", description: "Medium heading" },
    heading3: { title: "Heading 3", description: "Small heading" },
    paragraph: { title: "Text", description: "Plain text" },
    bulletList: { title: "List", description: "Bullet list" },
    checklist: { title: "Checklist", description: "Task list" },
    quote: { title: "Quote", description: "Quote block" },
    code: { title: "Code", description: "Code block" },
    divider: { title: "Divider", description: "Horizontal divider" },
    chart: { title: "Chart", description: "Insert a data chart" },
    kpi: { title: "KPI", description: "Key metric card" },
    embed: { title: "Embed", description: "Embed external URL (Google Sheets, YouTube, etc.)" },
    toggle: { title: "Toggle", description: "Collapsible block" },
    callout: { title: "Callout", description: "Highlight box" },
    dashboard: { title: "Dashboard", description: "Insert a widget grid" },
  },

  // -- Blocks --
  blocks: {
    chart: {
      closeEsc: "Close (ESC)",
    },
    embed: {
      urlPrompt: "Enter URL to embed (Google Sheets, YouTube, etc.)",
      embedButton: "Embed",
      changeUrl: "Change URL",
    },
    toggle: {
      defaultSummary: "Click to expand",
    },
    callout: {
      defaultText: "Enter important content here",
    },
  },

  // -- Chart Config --
  chartConfig: {
    title: "Chart Settings",
    chartTitle: "Title",
    chartTitlePlaceholder: "Enter chart title",
    series: "Series",
    addSeries: "Add series",
    seriesName: "Series name",
    chartType: "Chart type",
    dataKey: "Data key",
    axis: "Axis",
    color: "Color",
    smooth: "Smooth",
    stack: "Stack",
    stackGroup: "Stack group",
    axes: "Axes",
    addAxis: "Add axis",
    axisLabel: "Axis label",
    position: "Position",
    left: "Left",
    right: "Right",
    format: "Format",
    number: "Number",
    currency: "Currency",
    percent: "Percent",
    scale: "Scale",
    linear: "Linear",
    log: "Logarithmic",
    min: "Min",
    max: "Max",
    auto: "Auto",
    options: "Options",
    showLegend: "Show legend",
    showTooltip: "Show tooltip",
    showDataZoom: "Show data zoom",
    bar: "Bar",
    line: "Line",
    area: "Area",
    scatter: "Scatter",
    xAxisKey: "X-axis key",
    removeSeries: "Remove series",
    removeAxis: "Remove axis",
    apply: "Apply",
  },

  // -- Demo Data --
  demo: {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chartTitle: "Monthly Revenue & Profit Rate",
    axisLabels: {
      revenue: "Revenue (10K)",
      profitRate: "Profit Rate (%)",
    },
    seriesLabels: {
      revenue: "Revenue",
      profit: "Profit",
      profitRate: "Profit Rate",
    },
    kpi: {
      totalRevenue: "Total Revenue",
      avgProfitRate: "Avg Profit Rate",
      totalOrders: "Total Orders",
      monthlyAvgRevenue: "Monthly Avg Revenue",
    },
    embedTitle: "Google Sheets Sample",
  },

  // -- Data Source --
  dataSource: {
    title: "Data Sources",
    clickToUpload: "Click to upload",
    uploading: "Uploading...",
    noSources: "No data sources yet",
    rows: "rows",
    cols: "cols",
    preview: "Preview",
    dashboard: "Dashboard",
    selectSource: "Select data source",
    demoData: "Demo data",
    bindData: "Data binding",
  },

  // -- Presentation --
  presentation: {
    startPresentation: "Start Presentation",
    exitPresentation: "Exit Presentation",
    slideOf: "of",
    prevSlide: "Previous slide",
    nextSlide: "Next slide",
    annotations: "Annotations",
    pen: "Pen",
    highlighter: "Highlighter",
    eraser: "Eraser",
    clearAll: "Clear all",
    colors: "Colors",
    pressEscToExit: "Press ESC to exit",
  },

  // -- Collaboration --
  collaboration: {
    startCollab: "Start collaboration",
    stopCollab: "Stop collaboration",
    roomId: "Room ID",
    connectedAs: "Connected as",
    enterRoomId: "Enter room ID",
    join: "Join",
    leave: "Leave",
    collaborating: "Collaborating",
  },

  // -- Export --
  exportDoc: {
    exportPDF: "Export PDF",
    exportPNG: "Export PNG",
    exporting: "Exporting...",
    exportDone: "Export complete",
  },

  // -- Language --
  language: {
    label: "Language",
    ja: "日本語",
    ko: "한국어",
    en: "English",
  },
} as const;

export default en;
