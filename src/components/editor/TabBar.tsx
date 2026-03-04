"use client";

import { useEditorStore, type PageTab } from "@/stores/editor-store";
import { useI18n } from "@/lib/i18n";
import { Plus, X, Columns2, PanelRightClose } from "lucide-react";
import { useRef, useState, useCallback } from "react";

export function TabBar() {
  const { t } = useI18n();
  const {
    tabs,
    activeTabId,
    splitTabId,
    addTab,
    removeTab,
    setActiveTab,
    renameTab,
    setSplitTab,
  } = useEditorStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = useCallback(
    (tabId: string) => {
      setEditingId(tabId);
      setTimeout(() => inputRef.current?.select(), 0);
    },
    []
  );

  const commitRename = useCallback(
    (tabId: string, value: string) => {
      renameTab(tabId, value.trim());
      setEditingId(null);
    },
    [renameTab]
  );

  const getDisplayTitle = (tab: PageTab) =>
    tab.title || t.tabs.untitled;

  return (
    <div className="flex items-center border-b border-border bg-muted/30 text-sm">
      <div className="flex items-center flex-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isSplit = tab.id === splitTabId;

          return (
            <div
              key={tab.id}
              className={`group relative flex items-center gap-1 px-3 py-1.5 cursor-pointer border-r border-border select-none whitespace-nowrap ${
                isActive
                  ? "bg-background text-foreground"
                  : isSplit
                  ? "bg-accent/50 text-foreground"
                  : "text-muted-foreground hover:bg-accent/30"
              }`}
              onClick={() => setActiveTab(tab.id)}
              onDoubleClick={() => handleDoubleClick(tab.id)}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}

              {editingId === tab.id ? (
                <input
                  ref={inputRef}
                  defaultValue={tab.title}
                  className="w-24 bg-transparent outline-none text-xs font-medium"
                  onBlur={(e) => commitRename(tab.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename(tab.id, (e.target as HTMLInputElement).value);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <span className="text-xs font-medium max-w-[120px] truncate">
                  {getDisplayTitle(tab)}
                </span>
              )}

              {/* Split indicator */}
              {isSplit && (
                <span className="text-[10px] text-primary font-medium">S</span>
              )}

              {/* Close button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-opacity"
                  title={t.tabs.closeTab}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Tab actions */}
      <div className="flex items-center gap-0.5 px-2">
        <button
          onClick={() => addTab()}
          className="p-1 rounded-md hover:bg-accent text-muted-foreground"
          title={t.tabs.newTab}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            if (splitTabId) {
              setSplitTab(null);
            } else if (tabs.length > 1) {
              // Split with the next available tab
              const other = tabs.find((t) => t.id !== activeTabId);
              if (other) setSplitTab(other.id);
            }
          }}
          className={`p-1 rounded-md hover:bg-accent ${
            splitTabId ? "text-primary" : "text-muted-foreground"
          }`}
          title={splitTabId ? t.tabs.closeSplit : t.tabs.splitView}
        >
          {splitTabId ? (
            <PanelRightClose className="w-3.5 h-3.5" />
          ) : (
            <Columns2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
