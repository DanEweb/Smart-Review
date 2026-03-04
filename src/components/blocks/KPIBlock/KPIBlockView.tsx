"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function KPIBlockView({ node }: any) {
  const { title, value, prefix, suffix, trendValue, trendDirection, color } =
    node.attrs;

  return (
    <NodeViewWrapper className="my-2 inline-block">
      <div
        className="border border-border rounded-lg p-4 bg-card min-w-[180px] cursor-default"
        style={{ borderLeftColor: color || "#5470c6", borderLeftWidth: 4 }}
      >
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-bold mt-1">
          {prefix}
          {value}
          {suffix}
        </p>
        {trendValue != null && (
          <div
            className={`flex items-center gap-1 mt-1 text-sm ${
              trendDirection === "up" ? "text-green-600" : "text-red-500"
            }`}
          >
            {trendDirection === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {trendDirection === "up" ? "+" : "-"}
              {Math.abs(trendValue)}%
            </span>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
