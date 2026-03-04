import type { TranslationKeys } from "../types";

const ja: TranslationKeys = {
  // -- Common --
  common: {
    close: "閉じる",
    settings: "設定",
    expand: "拡大",
    noResults: "結果なし",
    save: "保存",
    saved: "保存済み",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    embed: "埋め込み",
  },

  // -- Editor --
  editor: {
    placeholder: "'/' を入力してブロックを追加...",
    demoTitle: "3月売上レビュー",
    demoBody: "今月の売上状況を分析します。以下で主要指標とチャートをご確認ください。",
    demoHint: "'/' を入力してチャート、KPI、埋め込みなどを追加できます。",
  },

  // -- Sidebar --
  sidebar: {
    pages: "ページ",
    newPage: "新しいページ",
    demoPages: {
      marchReview: "3月売上レビュー",
      q1Goals: "Q1目標達成率",
      productAnalysis: "製品別分析",
    },
  },

  // -- Outline --
  outline: {
    title: "アウトライン",
    emptyHint: "見出しを追加するとアウトラインが表示されます",
    emptyHeading: "(空の見出し)",
  },

  // -- Tabs --
  tabs: {
    newTab: "新しいタブ",
    closeTab: "タブを閉じる",
    splitView: "分割表示",
    closeSplit: "分割を閉じる",
    untitled: "無題",
  },

  // -- Toolbar --
  toolbar: {
    undo: "元に戻す",
    redo: "やり直し",
    heading1: "見出し 1",
    heading2: "見出し 2",
    heading3: "見出し 3",
    bold: "太字",
    italic: "斜体",
    strikethrough: "取り消し線",
    inlineCode: "インラインコード",
    bulletList: "箇条書き",
    orderedList: "番号付きリスト",
    checklist: "チェックリスト",
    quote: "引用",
    divider: "区切り線",
  },

  // -- Slash Command Menu --
  slashCommand: {
    heading1: { title: "見出し 1", description: "大きな見出し" },
    heading2: { title: "見出し 2", description: "中くらいの見出し" },
    heading3: { title: "見出し 3", description: "小さな見出し" },
    paragraph: { title: "本文", description: "通常テキスト" },
    bulletList: { title: "リスト", description: "箇条書きリスト" },
    checklist: { title: "チェックリスト", description: "タスクリスト" },
    quote: { title: "引用", description: "引用ブロック" },
    code: { title: "コード", description: "コードブロック" },
    divider: { title: "区切り線", description: "水平区切り線" },
    chart: { title: "チャート", description: "データチャートを挿入" },
    kpi: { title: "KPI", description: "主要指標カード" },
    embed: { title: "埋め込み", description: "外部URLを埋め込み (Google Sheets, YouTube等)" },
    toggle: { title: "トグル", description: "折りたたみブロック" },
    callout: { title: "コールアウト", description: "強調ボックス" },
    dashboard: { title: "ダッシュボード", description: "ウィジェットグリッドを挿入" },
  },

  // -- Blocks --
  blocks: {
    chart: {
      closeEsc: "閉じる (ESC)",
    },
    embed: {
      urlPrompt: "埋め込むURLを入力してください (Google Sheets, YouTube等)",
      embedButton: "埋め込み",
      changeUrl: "URL変更",
    },
    toggle: {
      defaultSummary: "クリックして展開",
    },
    callout: {
      defaultText: "重要な内容を入力してください",
    },
  },

  // -- Chart Config --
  chartConfig: {
    title: "チャート設定",
    chartTitle: "タイトル",
    chartTitlePlaceholder: "チャートのタイトルを入力",
    series: "シリーズ",
    addSeries: "シリーズを追加",
    seriesName: "シリーズ名",
    chartType: "チャートタイプ",
    dataKey: "データキー",
    axis: "軸",
    color: "色",
    smooth: "スムーズ",
    stack: "スタック",
    stackGroup: "スタックグループ",
    axes: "軸設定",
    addAxis: "軸を追加",
    axisLabel: "軸ラベル",
    position: "位置",
    left: "左",
    right: "右",
    format: "フォーマット",
    number: "数値",
    currency: "通貨",
    percent: "パーセント",
    scale: "スケール",
    linear: "リニア",
    log: "対数",
    min: "最小値",
    max: "最大値",
    auto: "自動",
    options: "オプション",
    showLegend: "凡例を表示",
    showTooltip: "ツールチップを表示",
    showDataZoom: "データズームを表示",
    bar: "棒グラフ",
    line: "折れ線",
    area: "エリア",
    scatter: "散布図",
    xAxisKey: "X軸キー",
    removeSeries: "シリーズを削除",
    removeAxis: "軸を削除",
    apply: "適用",
  },

  // -- Demo Data --
  demo: {
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    chartTitle: "月別売上＆利益率",
    axisLabels: {
      revenue: "売上（万円）",
      profitRate: "利益率（%）",
    },
    seriesLabels: {
      revenue: "売上",
      profit: "利益",
      profitRate: "利益率",
    },
    kpi: {
      totalRevenue: "総売上",
      avgProfitRate: "平均利益率",
      totalOrders: "総注文数",
      monthlyAvgRevenue: "月平均売上",
    },
    embedTitle: "Google Sheets サンプル",
  },

  // -- Data Source --
  dataSource: {
    title: "データソース",
    clickToUpload: "クリックしてアップロード",
    uploading: "アップロード中...",
    noSources: "データソースがありません",
    rows: "行",
    cols: "列",
    preview: "プレビュー",
    dashboard: "ダッシュボード",
    selectSource: "データソースを選択",
    demoData: "デモデータ",
    bindData: "データバインド",
  },

  // -- Presentation --
  presentation: {
    startPresentation: "プレゼンテーション開始",
    exitPresentation: "プレゼンテーション終了",
    slideOf: "ページ",
    prevSlide: "前のスライド",
    nextSlide: "次のスライド",
    annotations: "注釈",
    pen: "ペン",
    highlighter: "蛍光ペン",
    eraser: "消しゴム",
    clearAll: "すべて消去",
    colors: "色",
    pressEscToExit: "ESCで終了",
  },

  // -- Collaboration --
  collaboration: {
    startCollab: "コラボレーション開始",
    stopCollab: "コラボレーション終了",
    roomId: "ルームID",
    connectedAs: "接続名",
    enterRoomId: "ルームIDを入力",
    join: "参加",
    leave: "退出",
    collaborating: "コラボレーション中",
  },

  // -- Export --
  exportDoc: {
    exportPDF: "PDFエクスポート",
    exportPNG: "PNGエクスポート",
    exporting: "エクスポート中...",
    exportDone: "エクスポート完了",
  },

  // -- Language --
  language: {
    label: "言語",
    ja: "日本語",
    ko: "한국어",
    en: "English",
  },
};

export type { TranslationKeys };
export default ja;
