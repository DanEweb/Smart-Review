"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { useEditorStore } from "@/stores/editor-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
  AreaChart,
  ScatterChart as ScatterIcon,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import type {
  ChartConfig,
  ChartAxisConfig,
  ChartSeriesConfig,
} from "@/types/blocks";
import { nanoid } from "nanoid";
import { useDataStore } from "@/stores/data-store";
import { demoSalesData } from "@/lib/demo-data";
import { Database } from "lucide-react";

const PRESET_COLORS = [
  "#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de",
  "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc", "#5ab1ef",
];

const CHART_TYPE_ICONS: Record<string, any> = {
  bar: BarChart3,
  line: TrendingUp,
  area: AreaChart,
  scatter: ScatterIcon,
};

interface ChartConfigPanelProps {
  editor: Editor;
}

export function ChartConfigPanel({ editor }: ChartConfigPanelProps) {
  const { t } = useI18n();
  const tc = t.chartConfig;
  const { selectedBlockId, selectBlock } = useEditorStore();

  const { dataSources } = useDataStore();
  const [config, setConfig] = useState<ChartConfig | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [dataKeys, setDataKeys] = useState<string[]>([]);
  const [boundSourceId, setBoundSourceId] = useState<string | null>(null);
  const [expandedSeries, setExpandedSeries] = useState<string | null>(null);
  const [expandedAxis, setExpandedAxis] = useState<string | null>(null);

  // Find the chart block node in the editor and load its config
  useEffect(() => {
    if (!selectedBlockId || !editor) return;

    let found = false;
    editor.state.doc.descendants((node) => {
      if (found) return false;
      if (
        node.type.name === "chartBlock" &&
        node.attrs.blockId === selectedBlockId
      ) {
        const chartConfig = node.attrs.chartConfig;
        const nodeData = node.attrs.data;
        if (chartConfig) {
          setConfig(JSON.parse(JSON.stringify(chartConfig)));
        }
        if (nodeData?.length) {
          setData(nodeData);
          setDataKeys(Object.keys(nodeData[0]).filter((k) => k !== "__proto__"));
        }
        setBoundSourceId(node.attrs.dataSourceId || null);
        found = true;
        return false;
      }
    });
  }, [selectedBlockId, editor]);

  // Apply changes back to the editor node
  const applyChanges = useCallback(
    (newConfig: ChartConfig) => {
      if (!selectedBlockId || !editor) return;

      let targetPos: number | null = null;
      editor.state.doc.descendants((node, pos) => {
        if (targetPos !== null) return false;
        if (
          node.type.name === "chartBlock" &&
          node.attrs.blockId === selectedBlockId
        ) {
          targetPos = pos;
          return false;
        }
      });

      if (targetPos !== null) {
        const tr = editor.state.tr;
        tr.setNodeAttribute(targetPos, "chartConfig", newConfig);
        editor.view.dispatch(tr);
      }
    },
    [selectedBlockId, editor]
  );

  const updateConfig = useCallback(
    (updater: (prev: ChartConfig) => ChartConfig) => {
      setConfig((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        applyChanges(next);
        return next;
      });
    },
    [applyChanges]
  );

  const bindDataSource = useCallback(
    (sourceId: string | null) => {
      if (!selectedBlockId || !editor) return;
      setBoundSourceId(sourceId);

      let targetPos: number | null = null;
      editor.state.doc.descendants((node, pos) => {
        if (targetPos !== null) return false;
        if (
          node.type.name === "chartBlock" &&
          node.attrs.blockId === selectedBlockId
        ) {
          targetPos = pos;
          return false;
        }
      });

      if (targetPos === null) return;

      if (!sourceId) {
        // Unbind: revert to demo data
        const tr = editor.state.tr;
        tr.setNodeAttribute(targetPos, "dataSourceId", null);
        tr.setNodeAttribute(targetPos, "data", demoSalesData);
        editor.view.dispatch(tr);
        setData(demoSalesData);
        setDataKeys(Object.keys(demoSalesData[0]).filter((k) => k !== "__proto__"));
        return;
      }

      const source = dataSources.find((s) => s.id === sourceId);
      if (!source) return;

      const tr = editor.state.tr;
      tr.setNodeAttribute(targetPos, "dataSourceId", sourceId);
      tr.setNodeAttribute(targetPos, "data", source.data);
      editor.view.dispatch(tr);
      setData(source.data);
      setDataKeys(source.columns);
    },
    [selectedBlockId, editor, dataSources]
  );

  if (!config) return null;

  const addSeries = () => {
    const id = nanoid(8);
    const newSeries: ChartSeriesConfig = {
      id,
      label: `${tc.series} ${config.series.length + 1}`,
      chartType: "bar",
      axisIndex: 0,
      dataKey: dataKeys[0] || "",
      color: PRESET_COLORS[config.series.length % PRESET_COLORS.length],
    };
    updateConfig((c) => ({ ...c, series: [...c.series, newSeries] }));
    setExpandedSeries(id);
  };

  const removeSeries = (id: string) => {
    updateConfig((c) => ({
      ...c,
      series: c.series.filter((s) => s.id !== id),
    }));
    if (expandedSeries === id) setExpandedSeries(null);
  };

  const updateSeries = (id: string, patch: Partial<ChartSeriesConfig>) => {
    updateConfig((c) => ({
      ...c,
      series: c.series.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const addAxis = () => {
    const id = nanoid(8);
    const newAxis: ChartAxisConfig = {
      id,
      position: config.axes.length % 2 === 0 ? "left" : "right",
      offset: 0,
      label: `${tc.axis} ${config.axes.length + 1}`,
      format: "number",
      scale: "linear",
    };
    updateConfig((c) => ({ ...c, axes: [...c.axes, newAxis] }));
    setExpandedAxis(id);
  };

  const removeAxis = (id: string) => {
    updateConfig((c) => ({
      ...c,
      axes: c.axes.filter((a) => a.id !== id),
    }));
    if (expandedAxis === id) setExpandedAxis(null);
  };

  const updateAxis = (id: string, patch: Partial<ChartAxisConfig>) => {
    updateConfig((c) => ({
      ...c,
      axes: c.axes.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  };

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">{tc.title}</h3>
        <button
          onClick={() => selectBlock(null)}
          className="p-1 rounded-md hover:bg-accent"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Data Source Binding */}
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1">
              <Database className="w-3 h-3" />
              {t.dataSource.bindData}
            </Label>
            <Select
              value={boundSourceId || "__demo__"}
              onValueChange={(v) =>
                bindDataSource(v === "__demo__" ? null : v)
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__demo__">
                  {t.dataSource.demoData}
                </SelectItem>
                {dataSources.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.data.length} {t.dataSource.rows})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Chart Title */}
          <div className="space-y-1.5">
            <Label className="text-xs">{tc.chartTitle}</Label>
            <Input
              value={config.title || ""}
              onChange={(e) =>
                updateConfig((c) => ({ ...c, title: e.target.value }))
              }
              placeholder={tc.chartTitlePlaceholder}
              className="h-8 text-sm"
            />
          </div>

          {/* X-Axis Key */}
          <div className="space-y-1.5">
            <Label className="text-xs">{tc.xAxisKey}</Label>
            <Select
              value={config.xAxisKey}
              onValueChange={(v) =>
                updateConfig((c) => ({ ...c, xAxisKey: v }))
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Series Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tc.series}
              </h4>
              <button
                onClick={addSeries}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Plus className="w-3 h-3" />
                {tc.addSeries}
              </button>
            </div>

            <div className="space-y-1">
              {config.series.map((s) => {
                const isExpanded = expandedSeries === s.id;
                const TypeIcon = CHART_TYPE_ICONS[s.chartType] || BarChart3;
                return (
                  <div
                    key={s.id}
                    className="border border-border rounded-md overflow-hidden"
                  >
                    {/* Series Header */}
                    <button
                      onClick={() =>
                        setExpandedSeries(isExpanded ? null : s.id)
                      }
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-accent/50"
                    >
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: s.color || "#5470c6" }}
                      />
                      <TypeIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 truncate text-xs font-medium">
                        {s.label}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Series Detail */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-border bg-muted/30">
                        <div className="space-y-1">
                          <Label className="text-xs">{tc.seriesName}</Label>
                          <Input
                            value={s.label}
                            onChange={(e) =>
                              updateSeries(s.id, { label: e.target.value })
                            }
                            className="h-7 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">{tc.chartType}</Label>
                            <Select
                              value={s.chartType}
                              onValueChange={(v: any) =>
                                updateSeries(s.id, { chartType: v })
                              }
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bar">{tc.bar}</SelectItem>
                                <SelectItem value="line">{tc.line}</SelectItem>
                                <SelectItem value="area">{tc.area}</SelectItem>
                                <SelectItem value="scatter">{tc.scatter}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">{tc.dataKey}</Label>
                            <Select
                              value={s.dataKey}
                              onValueChange={(v) =>
                                updateSeries(s.id, { dataKey: v })
                              }
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {dataKeys
                                  .filter((k) => k !== config.xAxisKey)
                                  .map((key) => (
                                    <SelectItem key={key} value={key}>
                                      {key}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">{tc.axis}</Label>
                            <Select
                              value={String(s.axisIndex)}
                              onValueChange={(v) =>
                                updateSeries(s.id, { axisIndex: Number(v) })
                              }
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {config.axes.map((a, i) => (
                                  <SelectItem key={a.id} value={String(i)}>
                                    {a.label || `${tc.axis} ${i + 1}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">{tc.color}</Label>
                            <div className="flex gap-1 flex-wrap">
                              {PRESET_COLORS.slice(0, 5).map((c) => (
                                <button
                                  key={c}
                                  onClick={() => updateSeries(s.id, { color: c })}
                                  className={`w-5 h-5 rounded-sm border ${
                                    s.color === c
                                      ? "border-foreground ring-1 ring-foreground"
                                      : "border-border"
                                  }`}
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                              <input
                                type="color"
                                value={s.color || "#5470c6"}
                                onChange={(e) =>
                                  updateSeries(s.id, { color: e.target.value })
                                }
                                className="w-5 h-5 rounded-sm cursor-pointer border border-border"
                              />
                            </div>
                          </div>
                        </div>

                        {(s.chartType === "line" || s.chartType === "area") && (
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">{tc.smooth}</Label>
                            <Switch
                              checked={s.smooth ?? false}
                              onCheckedChange={(v) =>
                                updateSeries(s.id, { smooth: v })
                              }
                            />
                          </div>
                        )}

                        {(s.chartType === "bar" || s.chartType === "area") && (
                          <div className="space-y-1">
                            <Label className="text-xs">{tc.stackGroup}</Label>
                            <Input
                              value={s.stack || ""}
                              onChange={(e) =>
                                updateSeries(s.id, {
                                  stack: e.target.value || undefined,
                                })
                              }
                              placeholder={tc.auto}
                              className="h-7 text-xs"
                            />
                          </div>
                        )}

                        <button
                          onClick={() => removeSeries(s.id)}
                          className="flex items-center gap-1 text-xs text-destructive hover:underline mt-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          {tc.removeSeries}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Axes Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {tc.axes}
              </h4>
              <button
                onClick={addAxis}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Plus className="w-3 h-3" />
                {tc.addAxis}
              </button>
            </div>

            <div className="space-y-1">
              {config.axes.map((a, i) => {
                const isExpanded = expandedAxis === a.id;
                return (
                  <div
                    key={a.id}
                    className="border border-border rounded-md overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedAxis(isExpanded ? null : a.id)
                      }
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-accent/50"
                    >
                      <span className="text-xs text-muted-foreground">
                        {a.position === "left" ? "L" : "R"}
                      </span>
                      <span className="flex-1 truncate text-xs font-medium">
                        {a.label || `${tc.axis} ${i + 1}`}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-border bg-muted/30">
                        <div className="space-y-1">
                          <Label className="text-xs">{tc.axisLabel}</Label>
                          <Input
                            value={a.label}
                            onChange={(e) =>
                              updateAxis(a.id, { label: e.target.value })
                            }
                            className="h-7 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">{tc.position}</Label>
                            <Select
                              value={a.position}
                              onValueChange={(v: any) =>
                                updateAxis(a.id, { position: v })
                              }
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">{tc.left}</SelectItem>
                                <SelectItem value="right">{tc.right}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">{tc.format}</Label>
                            <Select
                              value={a.format}
                              onValueChange={(v: any) =>
                                updateAxis(a.id, { format: v })
                              }
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="number">{tc.number}</SelectItem>
                                <SelectItem value="currency">{tc.currency}</SelectItem>
                                <SelectItem value="percent">{tc.percent}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">{tc.scale}</Label>
                            <Select
                              value={a.scale}
                              onValueChange={(v: any) =>
                                updateAxis(a.id, { scale: v })
                              }
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="linear">{tc.linear}</SelectItem>
                                <SelectItem value="log">{tc.log}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">{tc.min}</Label>
                            <Input
                              type="number"
                              value={a.min ?? ""}
                              onChange={(e) =>
                                updateAxis(a.id, {
                                  min: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                })
                              }
                              placeholder={tc.auto}
                              className="h-7 text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">{tc.max}</Label>
                            <Input
                              type="number"
                              value={a.max ?? ""}
                              onChange={(e) =>
                                updateAxis(a.id, {
                                  max: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                })
                              }
                              placeholder={tc.auto}
                              className="h-7 text-xs"
                            />
                          </div>
                        </div>

                        {config.axes.length > 1 && (
                          <button
                            onClick={() => removeAxis(a.id)}
                            className="flex items-center gap-1 text-xs text-destructive hover:underline mt-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            {tc.removeAxis}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Options Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {tc.options}
            </h4>

            <div className="flex items-center justify-between">
              <Label className="text-xs">{tc.showLegend}</Label>
              <Switch
                checked={config.showLegend}
                onCheckedChange={(v) =>
                  updateConfig((c) => ({ ...c, showLegend: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">{tc.showTooltip}</Label>
              <Switch
                checked={config.showTooltip}
                onCheckedChange={(v) =>
                  updateConfig((c) => ({ ...c, showTooltip: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">{tc.showDataZoom}</Label>
              <Switch
                checked={config.showDataZoom}
                onCheckedChange={(v) =>
                  updateConfig((c) => ({ ...c, showDataZoom: v }))
                }
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
