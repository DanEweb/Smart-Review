"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
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
import { demoSalesData, demoChartConfig } from "@/lib/demo-data";
import { useEditorStore } from "@/stores/editor-store";
import { useI18n } from "@/lib/i18n";
import { BarChart3, Maximize2, Settings } from "lucide-react";
import type { ChartConfig } from "@/types/blocks";

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

export function ChartBlockView({ node, updateAttributes }: any) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const { t } = useI18n();

  const config: ChartConfig = node.attrs.chartConfig || demoChartConfig;
  const data = node.attrs.data?.length ? node.attrs.data : demoSalesData;

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = buildChartOption(config, data);
    chartInstance.current.setOption(option, true);

    const handleResize = () => chartInstance.current?.resize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [config, data]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.resize();
    }
  }, [isFullscreen]);

  const isDemo = !node.attrs.dataSourceId;

  return (
    <NodeViewWrapper className="my-4">
      <div
        className={`relative border border-border rounded-lg bg-card overflow-hidden ${
          isFullscreen
            ? "fixed inset-4 z-50 bg-background shadow-2xl"
            : ""
        }`}
      >
        {/* Always-visible toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="font-medium">
              {config.title || t.slashCommand.chart.title}
            </span>
            {isDemo && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                DEMO
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => selectBlock(node.attrs.blockId)}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title={t.common.settings}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.common.settings}</span>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              title={t.common.expand}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          ref={chartRef}
          className={isFullscreen ? "w-full h-full" : "w-full h-[400px] cursor-pointer"}
          onClick={() => !isFullscreen && selectBlock(node.attrs.blockId)}
        />

        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground text-sm"
          >
            {t.blocks.chart.closeEsc}
          </button>
        )}
      </div>
    </NodeViewWrapper>
  );
}
