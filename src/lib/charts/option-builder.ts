import type { ChartConfig, ChartAxisConfig, ChartSeriesConfig } from "@/types/blocks";
import type { EChartsOption } from "echarts";

const DEFAULT_COLORS = [
  "#5470c6", "#91cc75", "#fac858", "#ee6666",
  "#73c0de", "#3ba272", "#fc8452", "#9a60b4",
];

function buildAxisFormatter(format: ChartAxisConfig["format"]) {
  switch (format) {
    case "currency":
      return (value: number) => {
        if (Math.abs(value) >= 1e8) return `${(value / 1e8).toFixed(1)}억`;
        if (Math.abs(value) >= 1e4) return `${(value / 1e4).toFixed(0)}만`;
        return value.toLocaleString();
      };
    case "percent":
      return (value: number) => `${value}%`;
    default:
      return (value: number) => {
        if (Math.abs(value) >= 1e8) return `${(value / 1e8).toFixed(1)}억`;
        if (Math.abs(value) >= 1e4) return `${(value / 1e4).toFixed(0)}만`;
        return value.toLocaleString();
      };
  }
}

function resolveAxisOffsets(axes: ChartAxisConfig[]): ChartAxisConfig[] {
  const leftAxes = axes.filter((a) => a.position === "left");
  const rightAxes = axes.filter((a) => a.position === "right");

  leftAxes.forEach((axis, i) => {
    axis.offset = i * 60;
  });
  rightAxes.forEach((axis, i) => {
    axis.offset = i * 60;
  });

  return [...leftAxes, ...rightAxes];
}

export function buildChartOption(
  config: ChartConfig,
  data: Record<string, unknown>[]
): EChartsOption {
  const resolvedAxes = resolveAxisOffsets([...config.axes]);

  const yAxis = resolvedAxes.map((axis, index) => ({
    type: "value" as const,
    name: axis.label,
    position: axis.position,
    offset: axis.offset,
    axisLabel: {
      formatter: buildAxisFormatter(axis.format),
    },
    min: axis.min ?? undefined,
    max: axis.max ?? undefined,
    splitLine: { show: index === 0 },
    scale: axis.scale === "log",
  }));

  const xAxisData = data.map((row) => row[config.xAxisKey] as string);

  const series = config.series.map((s: ChartSeriesConfig, i: number) => {
    const isArea = s.chartType === "area";
    return {
      name: s.label,
      type: (isArea ? "line" : s.chartType) as "bar" | "line" | "scatter",
      yAxisIndex: s.axisIndex,
      data: data.map((row) => row[s.dataKey] as number),
      smooth: s.smooth ?? false,
      stack: s.stack ?? undefined,
      ...(isArea ? { areaStyle: { opacity: 0.3 } } : {}),
      itemStyle: {
        color: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      },
    };
  });

  const leftAxisCount = resolvedAxes.filter((a) => a.position === "left").length;
  const rightAxisCount = resolvedAxes.filter((a) => a.position === "right").length;

  return {
    tooltip: config.showTooltip
      ? { trigger: "axis", axisPointer: { type: "cross" } }
      : undefined,
    legend: config.showLegend
      ? { data: config.series.map((s) => s.label), bottom: 0 }
      : undefined,
    grid: {
      left: 20 + leftAxisCount * 60,
      right: 20 + rightAxisCount * 60,
      bottom: config.showLegend ? 40 : 20,
      top: config.title ? 40 : 20,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis,
    series,
    ...(config.showDataZoom
      ? {
          dataZoom: [
            { type: "inside", start: 0, end: 100 },
            { type: "slider", start: 0, end: 100 },
          ],
        }
      : {}),
    title: config.title ? { text: config.title, left: "center" } : undefined,
  };
}
