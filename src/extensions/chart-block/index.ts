import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ChartBlockView } from "@/components/blocks/ChartBlock/ChartBlockView";

export const ChartBlock = Node.create({
  name: "chartBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      chartConfig: {
        default: null,
        parseHTML: (element) => {
          const val = element.getAttribute("data-chart-config");
          return val ? JSON.parse(val) : null;
        },
        renderHTML: (attributes) => ({
          "data-chart-config": JSON.stringify(attributes.chartConfig),
        }),
      },
      data: {
        default: [],
        parseHTML: (element) => {
          const val = element.getAttribute("data-chart-data");
          return val ? JSON.parse(val) : [];
        },
        renderHTML: (attributes) => ({
          "data-chart-data": JSON.stringify(attributes.data),
        }),
      },
      blockId: {
        default: null,
      },
      dataSourceId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="chart-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "chart-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartBlockView);
  },
});
