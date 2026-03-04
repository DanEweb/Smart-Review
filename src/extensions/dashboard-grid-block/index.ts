import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { GridBlockView } from "@/components/blocks/DashboardGridBlock/GridBlockView";

export const DashboardGridBlock = Node.create({
  name: "dashboardGridBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      gridConfig: {
        default: null,
        parseHTML: (element) => {
          const val = element.getAttribute("data-grid-config");
          return val ? JSON.parse(val) : null;
        },
        renderHTML: (attributes) => ({
          "data-grid-config": JSON.stringify(attributes.gridConfig),
        }),
      },
      blockId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="dashboard-grid-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "dashboard-grid-block" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GridBlockView);
  },
});
