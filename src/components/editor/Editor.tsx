"use client";

import { Sidebar } from "./Sidebar";
import { EditorToolbar } from "./EditorToolbar";
import { ChartConfigPanel } from "./ChartConfigPanel";
import { DataSourcePanel } from "./DataSourcePanel";
import { TabBar } from "./TabBar";
import { EditorPane } from "./EditorPane";
import { useEditorStore } from "@/stores/editor-store";
import { useI18n } from "@/lib/i18n";
import { PresentationView } from "@/components/presentation/PresentationView";
import { exportToPDF, exportToPNG } from "@/lib/export";
import { Menu, X } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { nanoid } from "nanoid";

export function SmartReviewEditor() {
  const {
    isSidebarOpen,
    toggleSidebar,
    isConfigPanelOpen,
    selectedBlockId,
    tabs,
    activeTabId,
    splitTabId,
    collabRoomId,
    setCollabRoom,
  } = useEditorStore();
  const { t } = useI18n();
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(false);
  const [showCollabDialog, setShowCollabDialog] = useState(false);
  const [collabInput, setCollabInput] = useState("");
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Track editor instances by tab ID
  const editorsRef = useRef<Record<string, Editor>>({});

  const handleEditorReady = useCallback((tabId: string, editor: Editor) => {
    editorsRef.current[tabId] = editor;
  }, []);

  const handleCollabToggle = useCallback(() => {
    if (collabRoomId) {
      // Currently collaborating → stop
      setCollabRoom(null);
    } else {
      // Not collaborating → show dialog
      setCollabInput(nanoid(8));
      setShowCollabDialog(true);
    }
  }, [collabRoomId, setCollabRoom]);

  const handleCollabJoin = useCallback(() => {
    if (collabInput.trim()) {
      setCollabRoom(collabInput.trim());
      setShowCollabDialog(false);
    }
  }, [collabInput, setCollabRoom]);

  const editorAreaRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = useCallback(async () => {
    if (!editorAreaRef.current) return;
    await exportToPDF(editorAreaRef.current, "smart-review.pdf");
  }, []);

  const handleExportPNG = useCallback(async () => {
    if (!editorAreaRef.current) return;
    await exportToPNG(editorAreaRef.current, "smart-review.png");
  }, []);

  const activeEditor = editorsRef.current[activeTabId] || null;
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const splitTab = splitTabId ? tabs.find((t) => t.id === splitTabId) : null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar editor={activeEditor} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Tab Bar */}
        <TabBar />

        {/* Collaboration indicator bar */}
        {collabRoomId && (
          <div className="flex items-center gap-2 px-4 py-1 bg-green-50 dark:bg-green-950 border-b border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>{t.collaboration.collaborating}</span>
            <span className="font-mono text-green-600 dark:text-green-400">
              {collabRoomId}
            </span>
            <button
              onClick={() => setCollabRoom(null)}
              className="ml-auto text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
            >
              {t.collaboration.leave}
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="border-b border-border">
          <div className="flex items-center gap-2 px-4 py-2">
            {!isSidebarOpen && (
              <button
                onClick={() => toggleSidebar(true)}
                className="p-1.5 rounded-md hover:bg-accent"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <EditorToolbar
              editor={activeEditor}
              onToggleDataPanel={() => setIsDataPanelOpen((v) => !v)}
              isDataPanelOpen={isDataPanelOpen}
              onToggleCollab={handleCollabToggle}
              isCollabActive={!!collabRoomId}
              onStartPresentation={() => setIsPresentationMode(true)}
              onExportPDF={handleExportPDF}
              onExportPNG={handleExportPNG}
            />
          </div>
        </div>

        {/* Editor Area (with optional split) */}
        <div ref={editorAreaRef} className="flex-1 flex min-h-0">
          {/* Main editor pane */}
          {activeTab && (
            <EditorPane
              key={`${activeTab.id}-${collabRoomId ?? "solo"}`}
              tabId={activeTab.id}
              initialContent={activeTab.content || undefined}
              collabRoomId={collabRoomId}
              onEditorReady={(editor) => handleEditorReady(activeTab.id, editor)}
            />
          )}

          {/* Split divider + second pane */}
          {splitTab && (
            <>
              <div className="w-px bg-border flex-shrink-0" />
              <EditorPane
                key={`${splitTab.id}-${collabRoomId ?? "solo"}`}
                tabId={splitTab.id}
                initialContent={splitTab.content || undefined}
                collabRoomId={collabRoomId}
                onEditorReady={(editor) => handleEditorReady(splitTab.id, editor)}
              />
            </>
          )}
        </div>
      </div>

      {/* Chart Config Panel (slide-over right) */}
      {isConfigPanelOpen && selectedBlockId && activeEditor && (
        <ChartConfigPanel editor={activeEditor} />
      )}

      {/* Data Source Panel (slide-over right) */}
      <DataSourcePanel
        open={isDataPanelOpen && !isConfigPanelOpen}
        onClose={() => setIsDataPanelOpen(false)}
      />

      {/* Presentation Mode */}
      {isPresentationMode && activeEditor && (
        <PresentationView
          content={activeEditor.getHTML()}
          onExit={() => setIsPresentationMode(false)}
        />
      )}

      {/* Collaboration Room Dialog */}
      {showCollabDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-xl border border-border p-6 w-[380px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">{t.collaboration.startCollab}</h3>
              <button
                onClick={() => setShowCollabDialog(false)}
                className="p-1 rounded hover:bg-accent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {t.collaboration.roomId}
            </label>
            <input
              value={collabInput}
              onChange={(e) => setCollabInput(e.target.value)}
              placeholder={t.collaboration.enterRoomId}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCollabJoin();
              }}
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground mb-4">
              {t.collaboration.roomId}: {collabInput || "—"}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCollabDialog(false)}
                className="px-3 py-1.5 text-sm rounded-md hover:bg-accent"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleCollabJoin}
                className="px-4 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t.collaboration.join}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
