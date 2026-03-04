export type BlockType =
  | "chart"
  | "dashboardGrid"
  | "table"
  | "kpi"
  | "embed"
  | "filter"
  | "toggle"
  | "callout"
  | "tabSection";

export interface ChartAxisConfig {
  id: string;
  position: "left" | "right";
  offset: number;
  label: string;
  format: "number" | "currency" | "percent";
  scale: "linear" | "log";
  min?: number;
  max?: number;
}

export interface ChartSeriesConfig {
  id: string;
  label: string;
  chartType: "bar" | "line" | "scatter" | "area";
  axisIndex: number;
  dataKey: string;
  color?: string;
  smooth?: boolean;
  stack?: string;
}

export interface ChartConfig {
  title?: string;
  axes: ChartAxisConfig[];
  series: ChartSeriesConfig[];
  xAxisKey: string;
  showLegend: boolean;
  showTooltip: boolean;
  showDataZoom: boolean;
}

export interface KPIConfig {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  color?: string;
}

export interface EmbedConfig {
  url: string;
  title?: string;
  height?: number;
}

export interface DashboardWidget {
  id: string;
  type: "chart" | "kpi";
  chartConfig?: ChartConfig;
  data?: Record<string, any>[];
  kpiConfig?: KPIConfig;
  dataSourceId?: string;
}

export interface DashboardGridConfig {
  widgets: DashboardWidget[];
  layout: Array<{
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
  }>;
  cols: number;
  rowHeight: number;
}
