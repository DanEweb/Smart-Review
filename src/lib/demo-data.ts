import type { ChartConfig, KPIConfig, EmbedConfig } from "@/types/blocks";
import type { TranslationKeys } from "@/lib/i18n/types";

// Default demo data uses Japanese (base language)
export const demoSalesData = [
  { month: "1月", revenue: 45000, profit: 12000, profitRate: 26.7, orders: 320 },
  { month: "2月", revenue: 52000, profit: 15000, profitRate: 28.8, orders: 380 },
  { month: "3月", revenue: 61000, profit: 18500, profitRate: 30.3, orders: 450 },
  { month: "4月", revenue: 58000, profit: 16000, profitRate: 27.6, orders: 410 },
  { month: "5月", revenue: 72000, profit: 22000, profitRate: 30.6, orders: 520 },
  { month: "6月", revenue: 68000, profit: 19500, profitRate: 28.7, orders: 490 },
  { month: "7月", revenue: 78000, profit: 25000, profitRate: 32.1, orders: 580 },
  { month: "8月", revenue: 85000, profit: 28000, profitRate: 32.9, orders: 620 },
  { month: "9月", revenue: 92000, profit: 31000, profitRate: 33.7, orders: 700 },
  { month: "10月", revenue: 88000, profit: 27500, profitRate: 31.3, orders: 650 },
  { month: "11月", revenue: 95000, profit: 33000, profitRate: 34.7, orders: 730 },
  { month: "12月", revenue: 105000, profit: 38000, profitRate: 36.2, orders: 800 },
];

export const demoChartConfig: ChartConfig = {
  title: "月別売上＆利益率",
  axes: [
    {
      id: "revenue-axis",
      position: "left",
      offset: 0,
      label: "売上（万円）",
      format: "number",
      scale: "linear",
    },
    {
      id: "rate-axis",
      position: "right",
      offset: 0,
      label: "利益率（%）",
      format: "percent",
      scale: "linear",
    },
  ],
  series: [
    {
      id: "revenue",
      label: "売上",
      chartType: "bar",
      axisIndex: 0,
      dataKey: "revenue",
      color: "#5470c6",
    },
    {
      id: "profit",
      label: "利益",
      chartType: "bar",
      axisIndex: 0,
      dataKey: "profit",
      color: "#91cc75",
    },
    {
      id: "profitRate",
      label: "利益率",
      chartType: "line",
      axisIndex: 1,
      dataKey: "profitRate",
      color: "#ee6666",
      smooth: true,
    },
  ],
  xAxisKey: "month",
  showLegend: true,
  showTooltip: true,
  showDataZoom: false,
};

export const demoKPIConfigs: KPIConfig[] = [
  {
    title: "総売上",
    value: "8.99億",
    trend: { value: 15.3, direction: "up" },
    color: "#5470c6",
  },
  {
    title: "平均利益率",
    value: "31.1%",
    trend: { value: 2.4, direction: "up" },
    color: "#91cc75",
  },
  {
    title: "総注文数",
    value: "6,650",
    trend: { value: 8.7, direction: "up" },
    color: "#fac858",
  },
  {
    title: "月平均売上",
    value: "7,492万",
    trend: { value: 12.1, direction: "up" },
    color: "#73c0de",
  },
];

export const demoEmbedConfig: EmbedConfig = {
  url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQI7E_Z8o1GR_xN4jPfOmLvhI_cul1_2PZyFq5GhFMO0LS0z6JLORBlNEDo1MKGBA/pubhtml",
  title: "Google Sheets サンプル",
  height: 400,
};

// Helper to get localized demo data
export function getLocalizedDemoData(t: TranslationKeys) {
  const localizedSalesData = demoSalesData.map((item, i) => ({
    ...item,
    month: t.demo.months[i],
  }));

  const localizedChartConfig: ChartConfig = {
    ...demoChartConfig,
    title: t.demo.chartTitle,
    axes: [
      { ...demoChartConfig.axes[0], label: t.demo.axisLabels.revenue },
      { ...demoChartConfig.axes[1], label: t.demo.axisLabels.profitRate },
    ],
    series: [
      { ...demoChartConfig.series[0], label: t.demo.seriesLabels.revenue },
      { ...demoChartConfig.series[1], label: t.demo.seriesLabels.profit },
      { ...demoChartConfig.series[2], label: t.demo.seriesLabels.profitRate },
    ],
  };

  const localizedKPIConfigs: KPIConfig[] = [
    { ...demoKPIConfigs[0], title: t.demo.kpi.totalRevenue },
    { ...demoKPIConfigs[1], title: t.demo.kpi.avgProfitRate },
    { ...demoKPIConfigs[2], title: t.demo.kpi.totalOrders },
    { ...demoKPIConfigs[3], title: t.demo.kpi.monthlyAvgRevenue },
  ];

  return {
    salesData: localizedSalesData,
    chartConfig: localizedChartConfig,
    kpiConfigs: localizedKPIConfigs,
    embedTitle: t.demo.embedTitle,
  };
}
