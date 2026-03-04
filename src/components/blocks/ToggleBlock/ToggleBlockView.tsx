"use client";

import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export function ToggleBlockView({ node, updateAttributes }: any) {
  const [isOpen, setIsOpen] = useState(node.attrs.isOpen ?? true);

  const toggle = () => {
    setIsOpen(!isOpen);
    updateAttributes({ isOpen: !isOpen });
  };

  return (
    <NodeViewWrapper className="my-2">
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          onClick={toggle}
          className="flex items-center gap-2 w-full px-3 py-2 bg-muted/50 hover:bg-muted text-left text-sm font-medium"
          contentEditable={false}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
          />
          {node.attrs.summary || "Toggle"}
        </button>
        {isOpen && (
          <div className="px-4 py-3">
            <NodeViewContent />
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
