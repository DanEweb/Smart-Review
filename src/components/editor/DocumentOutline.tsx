"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useI18n } from "@/lib/i18n";
import type { Editor } from "@tiptap/react";

interface HeadingItem {
  level: number;
  text: string;
  pos: number;
}

interface DocumentOutlineProps {
  editor: Editor | null;
}

export function DocumentOutline({ editor }: DocumentOutlineProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    if (!editor) return;

    const updateHeadings = () => {
      const items: HeadingItem[] = [];
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "heading") {
          items.push({
            level: node.attrs.level,
            text: node.textContent,
            pos,
          });
        }
      });
      setHeadings(items);
    };

    updateHeadings();
    editor.on("update", updateHeadings);

    return () => {
      editor.off("update", updateHeadings);
    };
  }, [editor]);

  const scrollToHeading = (pos: number) => {
    if (!editor) return;
    editor.chain().focus().setTextSelection(pos).run();

    const domNode = editor.view.domAtPos(pos + 1);
    if (domNode.node instanceof HTMLElement) {
      domNode.node.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (domNode.node.parentElement) {
      domNode.node.parentElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (headings.length === 0) {
    return (
      <div className="px-3 py-4 text-xs text-muted-foreground">
        {t.outline.emptyHint}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="px-2 py-3">
        <p className="px-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t.outline.title}
        </p>
        <nav className="space-y-0.5">
          {headings.map((heading, i) => (
            <button
              key={i}
              onClick={() => scrollToHeading(heading.pos)}
              className="block w-full text-left px-2 py-1 rounded-md text-sm hover:bg-accent truncate"
              style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
            >
              {heading.text || t.outline.emptyHeading}
            </button>
          ))}
        </nav>
      </div>
    </ScrollArea>
  );
}
