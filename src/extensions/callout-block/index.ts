import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CalloutBlockView } from "@/components/blocks/CalloutBlock/CalloutBlockView";

export const CalloutBlock = Node.create({
  name: "calloutBlock",
  group: "block",
  content: "inline*",
  draggable: true,

  addAttributes() {
    return {
      type: { default: "info" }, // info, warning, error, success
      blockId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "callout-block" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutBlockView);
  },
});
