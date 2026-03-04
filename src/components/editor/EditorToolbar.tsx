"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Minus,
  Database,
  Users,
  Presentation,
  Download,
  FileText,
  Image as ImageIcon,
  Sun,
  Moon,
  Check,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";

interface EditorToolbarProps {
  editor: Editor | null;
  onToggleDataPanel?: () => void;
  isDataPanelOpen?: boolean;
  onToggleCollab?: () => void;
  isCollabActive?: boolean;
  onStartPresentation?: () => void;
  onExportPDF?: () => void;
  onExportPNG?: () => void;
}

function ToolbarButton({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded-md transition-colors ${
        disabled
          ? "text-muted-foreground/40 cursor-not-allowed"
          : isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor, onToggleDataPanel, isDataPanelOpen, onToggleCollab, isCollabActive, onStartPresentation, onExportPDF, onExportPNG }: EditorToolbarProps) {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showExportMenu]);

  const noEditor = !editor;

  return (
    <div className="flex items-center gap-0.5 flex-wrap flex-1">
      <ToolbarButton
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={noEditor}
        title={t.toolbar.undo}
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={noEditor}
        title={t.toolbar.redo}
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1" />

      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        isActive={editor?.isActive("heading", { level: 1 })}
        disabled={noEditor}
        title={t.toolbar.heading1}
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        isActive={editor?.isActive("heading", { level: 2 })}
        disabled={noEditor}
        title={t.toolbar.heading2}
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
        isActive={editor?.isActive("heading", { level: 3 })}
        disabled={noEditor}
        title={t.toolbar.heading3}
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1" />

      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBold().run()}
        isActive={editor?.isActive("bold")}
        disabled={noEditor}
        title={t.toolbar.bold}
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        isActive={editor?.isActive("italic")}
        disabled={noEditor}
        title={t.toolbar.italic}
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        isActive={editor?.isActive("strike")}
        disabled={noEditor}
        title={t.toolbar.strikethrough}
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleCode().run()}
        isActive={editor?.isActive("code")}
        disabled={noEditor}
        title={t.toolbar.inlineCode}
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-5 mx-1" />

      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        isActive={editor?.isActive("bulletList")}
        disabled={noEditor}
        title={t.toolbar.bulletList}
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        isActive={editor?.isActive("orderedList")}
        disabled={noEditor}
        title={t.toolbar.orderedList}
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleTaskList().run()}
        isActive={editor?.isActive("taskList")}
        disabled={noEditor}
        title={t.toolbar.checklist}
      >
        <ListChecks className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        isActive={editor?.isActive("blockquote")}
        disabled={noEditor}
        title={t.toolbar.quote}
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        disabled={noEditor}
        title={t.toolbar.divider}
      >
        <Minus className="w-4 h-4" />
      </ToolbarButton>

      <div className="ml-auto flex items-center gap-1">
        {/* Auto-save indicator */}
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60 mr-1">
          <Check className="w-3 h-3" />
          <span className="hidden sm:inline">{t.common.saved ?? "Saved"}</span>
        </span>
        {/* Export dropdown */}
        <div className="relative" ref={exportMenuRef}>
          <ToolbarButton
            onClick={() => setShowExportMenu((v) => !v)}
            isActive={showExportMenu}
            title="Export"
          >
            <Download className="w-4 h-4" />
          </ToolbarButton>
          {showExportMenu && (
            <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg py-1 z-50 min-w-[160px]">
              <button
                onClick={() => { onExportPDF?.(); setShowExportMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
              >
                <FileText className="w-4 h-4" />
                {t.exportDoc.exportPDF}
              </button>
              <button
                onClick={() => { onExportPNG?.(); setShowExportMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent"
              >
                <ImageIcon className="w-4 h-4" />
                {t.exportDoc.exportPNG}
              </button>
            </div>
          )}
        </div>

        <ToolbarButton
          onClick={() => onStartPresentation?.()}
          title={t.presentation.startPresentation}
        >
          <Presentation className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onToggleCollab?.()}
          isActive={isCollabActive}
          title={isCollabActive ? t.collaboration.stopCollab : t.collaboration.startCollab}
        >
          <Users className={`w-4 h-4 ${isCollabActive ? "text-green-500" : ""}`} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onToggleDataPanel?.()}
          isActive={isDataPanelOpen}
          title={t.dataSource.title}
        >
          <Database className="w-4 h-4" />
        </ToolbarButton>
        <LanguageSwitcher />
        {mounted && (
          <ToolbarButton
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </ToolbarButton>
        )}
      </div>
    </div>
  );
}
