"use client";

import { FileText, Plus, ChevronLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DocumentOutline } from "./DocumentOutline";
import { useEditorStore } from "@/stores/editor-store";
import { useI18n } from "@/lib/i18n";
import type { Editor } from "@tiptap/react";

interface SidebarProps {
  editor: Editor | null;
}

export function Sidebar({ editor }: SidebarProps) {
  const { isSidebarOpen, toggleSidebar, tabs, activeTabId, setActiveTab, addTab } =
    useEditorStore();
  const { t } = useI18n();

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="w-60 border-r border-border bg-sidebar flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground">
          Smart Review
        </h2>
        <button
          onClick={() => toggleSidebar(false)}
          className="p-1 rounded-md hover:bg-sidebar-accent"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="px-2 py-2">
        <p className="px-2 mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t.sidebar.pages}
        </p>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm ${
              tab.id === activeTabId
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="truncate">
              {tab.title || t.tabs.untitled}
            </span>
          </button>
        ))}
        <button
          onClick={() => addTab()}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-sidebar-accent/50 mt-1"
        >
          <Plus className="w-4 h-4" />
          <span>{t.sidebar.newPage}</span>
        </button>
      </div>

      <Separator />

      <div className="flex-1 overflow-hidden">
        <DocumentOutline editor={editor} />
      </div>
    </div>
  );
}
