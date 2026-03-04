"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GridLayout, useContainerWidth, verticalCompactor } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { nanoid } from "nanoid";
import * as echarts from "echarts/core";
import { BarChart, LineChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { buildChartOption } from "@/lib/charts/option-builder";
import { demoSalesData, demoChartConfig, demoKPIConfigs } from "@/lib/demo-data";
import { useI18n } from "@/lib/i18n";
import { Plus, Trash2, BarChart3, Gauge, Maximize2, Minimize2 } from "lucide-react";
import type { DashboardGridConfig, DashboardWidget, ChartConfig, KPIConfig } from "@/types/blocks";

echarts.use([
  BarChart,
  LineChart,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  CanvasRenderer,
]);

// Default grid config with demo data
function createDefaultGridConfig(): DashboardGridConfig {
  const chartId = nanoid();
  const kpi1Id = nanoid();
  const kpi2Id = nanoid();
  const kpi3Id = nanoid();

  return {
    widgets: [
      {
        id: chartId,
        type: "chart",
        chartConfig: { ...demoChartConfig, showDataZoom: false },
        data: demoSalesData,
      },
      {
        id: kpi1Id,
        type: "kpi",
        kpiConfig: demoKPIConfigs[0],
      },
      {
        id: kpi2Id,
        type: "kpi",
        kpiConfig: demoKPIConfigs[1],
      },
      {
        id: kpi3Id,
        type: "kpi",
        kpiConfig: demoKPIConfigs[2],
      },
    ],
    layout: [
      { i: kpi1Id, x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
      { i: kpi2Id, x: 4, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
      { i: kpi3Id, x: 8, y: 0, w: 4, h: 2, minW: 2, minH: 2 },
      { i: chartId, x: 0, y: 2, w: 12, h: 5, minW: 4, minH: 3 },
    ],
    cols: 12,
    rowHeight: 60,
  };
}

export function GridBlockView({ node, updateAttributes }: any) {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const { width: containerWidth, containerRef } = useContainerWidth();

  const gridConfig: DashboardGridConfig =
    node.attrs.gridConfig || createDefaultGridConfig();

  // If no gridConfig stored, persist the default
  useEffect(() => {
    if (!node.attrs.gridConfig) {
      updateAttributes({ gridConfig: createDefaultGridConfig() });
    }
  }, []);

  const updateGridConfig = useCallback(
    (newConfig: DashboardGridConfig) => {
      updateAttributes({ gridConfig: newConfig });
    },
    [updateAttributes]
  );

  const handleLayoutChange = useCallback(
    (newLayout: readonly any[]) => {
      updateGridConfig({
        ...gridConfig,
        layout: newLayout.map((l) => ({
          i: l.i,
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
          minW: l.minW,
          minH: l.minH,
        })),
      });
    },
    [gridConfig, updateGridConfig]
  );

  const addWidget = useCallback(
    (type: "chart" | "kpi") => {
      const id = nanoid();
      const widget: DashboardWidget =
        type === "chart"
          ? {
              id,
              type: "chart",
              chartConfig: {
                ...demoChartConfig,
                title: "",
                showDataZoom: false,
                showLegend: false,
              },
              data: demoSalesData,
            }
          : {
              id,
              type: "kpi",
              kpiConfig: {
                title: "New KPI",
                value: "0",
                color: "#5470c6",
              },
            };

      const maxY = gridConfig.layout.reduce(
        (max, l) => Math.max(max, l.y + l.h),
        0
      );

      const layoutItem = {
        i: id,
        x: 0,
        y: maxY,
        w: type === "chart" ? 6 : 4,
        h: type === "chart" ? 4 : 2,
        minW: type === "chart" ? 4 : 2,
        minH: type === "chart" ? 3 : 2,
      };

      updateGridConfig({
        ...gridConfig,
        widgets: [...gridConfig.widgets, widget],
        layout: [...gridConfig.layout, layoutItem],
      });
    },
    [gridConfig, updateGridConfig]
  );

  const removeWidget = useCallback(
    (widgetId: string) => {
      updateGridConfig({
        ...gridConfig,
        widgets: gridConfig.widgets.filter((w) => w.id !== widgetId),
        layout: gridConfig.layout.filter((l) => l.i !== widgetId),
      });
    },
    [gridConfig, updateGridConfig]
  );

  return (
    <NodeViewWrapper className="my-4">
      <div
        className={`relative border border-border rounded-lg bg-card overflow-hidden ${
          isExpanded ? "fixed inset-4 z-50 bg-background shadow-2xl overflow-y-auto" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <span className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {t.dataSource.dashboard}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => addWidget("kpi")}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-accent"
              title="Add KPI"
            >
              <Gauge className="w-3.5 h-3.5" />
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={() => addWidget("chart")}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-accent"
              title="Add Chart"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md hover:bg-accent"
              title={t.common.expand}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div ref={containerRef} className="p-2">
          {containerWidth > 0 && (
          <GridLayout
            layout={gridConfig.layout}
            gridConfig={{
              cols: gridConfig.cols,
              rowHeight: gridConfig.rowHeight,
              margin: [8, 8] as const,
              containerPadding: null,
              maxRows: Infinity,
            }}
            dragConfig={{ enabled: true, cancel: ".no-drag" }}
            width={containerWidth}
            onLayoutChange={handleLayoutChange}
            compactor={verticalCompactor}
          >
            {gridConfig.widgets.map((widget) => (
              <div key={widget.id} className="relative group">
                <div className="w-full h-full rounded-md border border-border bg-background overflow-hidden">
                  {widget.type === "chart" && (
                    <MiniChart
                      config={widget.chartConfig || demoChartConfig}
                      data={widget.data || demoSalesData}
                    />
                  )}
                  {widget.type === "kpi" && (
                    <MiniKPI config={widget.kpiConfig!} />
                  )}
                </div>
                <button
                  onClick={() => removeWidget(widget.id)}
                  className="no-drag absolute top-1 right-1 p-1 rounded-md bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </GridLayout>
          )}
        </div>

        {/* Expand close button */}
        {isExpanded && (
          <button
            onClick={() => setIsExpanded(false)}
            className="fixed top-6 right-6 px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground text-sm z-50"
          >
            {t.blocks.chart.closeEsc}
          </button>
        )}
      </div>
    </NodeViewWrapper>
  );
}

// Mini chart widget inside grid
function MiniChart({
  config,
  data,
}: {
  config: ChartConfig;
  data: Record<string, any>[];
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = buildChartOption(config, data);
    chartInstance.current.setOption(option, true);

    const handleResize = () => chartInstance.current?.resize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(chartRef.current);

    return () => {
      ro.disconnect();
    };
  }, [config, data]);

  return <div ref={chartRef} className="w-full h-full" />;
}

// Mini KPI widget inside grid
function MiniKPI({ config }: { config: KPIConfig }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-3 text-center">
      <p className="text-xs text-muted-foreground truncate w-full">
        {config.title}
      </p>
      <p
        className="text-2xl font-bold mt-1"
        style={{ color: config.color || "#5470c6" }}
      >
        {config.prefix}
        {config.value}
        {config.suffix}
      </p>
      {config.trend && (
        <div
          className={`flex items-center gap-1 text-xs mt-1 ${
            config.trend.direction === "up"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {config.trend.direction === "up" ? "▲" : "▼"}{" "}
          {config.trend.value}%
        </div>
      )}
    </div>
  );
}
