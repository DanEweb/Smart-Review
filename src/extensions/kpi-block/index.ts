import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { KPIBlockView } from "@/components/blocks/KPIBlock/KPIBlockView";

export const KPIBlock = Node.create({
  name: "kpiBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      title: { default: "지표" },
      value: { default: "0" },
      prefix: { default: "" },
      suffix: { default: "" },
      trendValue: { default: null },
      trendDirection: { default: null },
      color: { default: "#5470c6" },
      blockId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="kpi-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "kpi-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(KPIBlockView);
  },
});
