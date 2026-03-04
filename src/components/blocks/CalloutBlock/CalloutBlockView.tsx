"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Info, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

const CALLOUT_STYLES = {
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    icon: Info,
    iconColor: "text-blue-600",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    icon: XCircle,
    iconColor: "text-red-600",
  },
  success: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
};

export function CalloutBlockView({ node, updateAttributes }: any) {
  const type = (node.attrs.type || "info") as keyof typeof CALLOUT_STYLES;
  const style = CALLOUT_STYLES[type];
  const Icon = style.icon;

  return (
    <NodeViewWrapper className="my-3">
      <div
        className={`flex gap-3 px-4 py-3 rounded-lg border ${style.bg} ${style.border}`}
      >
        <div className="pt-0.5" contentEditable={false}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
        <div className="flex-1 text-sm">
          <NodeViewContent />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
