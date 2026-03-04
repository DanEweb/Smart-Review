import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ToggleBlockView } from "@/components/blocks/ToggleBlock/ToggleBlockView";

export const ToggleBlock = Node.create({
  name: "toggleBlock",
  group: "block",
  content: "block+",
  draggable: true,

  addAttributes() {
    return {
      summary: { default: "Toggle" },
      isOpen: { default: true },
      blockId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="toggle-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "toggle-block" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ToggleBlockView);
  },
});
