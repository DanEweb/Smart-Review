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
import { Maximize2, Settings } from "lucide-react";
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

  return (
    <NodeViewWrapper className="my-4">
      <div
        className={`relative group border border-border rounded-lg bg-card overflow-hidden ${
          isFullscreen
            ? "fixed inset-4 z-50 bg-background shadow-2xl"
            : ""
        }`}
      >
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => selectBlock(node.attrs.blockId)}
            className="p-1.5 rounded-md bg-background/80 hover:bg-accent border border-border"
            title={t.common.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md bg-background/80 hover:bg-accent border border-border"
            title={t.common.expand}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={chartRef}
          className={isFullscreen ? "w-full h-full" : "w-full h-[400px]"}
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
