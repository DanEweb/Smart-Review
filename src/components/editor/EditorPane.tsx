"use client";

import { useEditor, EditorContent, ReactRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import ImageExtension from "@tiptap/extension-image";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

import { ChartBlock } from "@/extensions/chart-block";
import { EmbedBlock } from "@/extensions/embed-block";
import { KPIBlock } from "@/extensions/kpi-block";
import { ToggleBlock } from "@/extensions/toggle-block";
import { CalloutBlock } from "@/extensions/callout-block";
import { DashboardGridBlock } from "@/extensions/dashboard-grid-block";
import { SlashCommand } from "@/extensions/slash-command";
import {
  SlashCommandList,
  getCommandItems,
} from "@/components/editor/SlashCommandMenu";
import { useEditorStore } from "@/stores/editor-store";
import { useI18n } from "@/lib/i18n";
import { useRef, useEffect, useMemo, useCallback } from "react";
import { getCollabInstance, destroyCollabInstance } from "@/lib/collaboration";

interface EditorPaneProps {
  tabId: string;
  initialContent?: string;
  collabRoomId?: string | null;
  onEditorReady?: (editor: any) => void;
}

export function EditorPane({
  tabId,
  initialContent,
  collabRoomId,
  onEditorReady,
}: EditorPaneProps) {
  const { t } = useI18n();

  // Use Zustand selectors to avoid re-rendering when tabs change
  const saveTabContent = useEditorStore((s) => s.saveTabContent);
  const renameTab = useEditorStore((s) => s.renameTab);

  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const onEditorReadyRef = useRef(onEditorReady);
  onEditorReadyRef.current = onEditorReady;

  // Freeze initialContent so useEditor doesn't see changes on re-render
  const initialContentRef = useRef(initialContent);
  const tabIdRef = useRef(tabId);
  tabIdRef.current = tabId;

  // Stable onUpdate callback via ref
  const saveTabContentRef = useRef(saveTabContent);
  saveTabContentRef.current = saveTabContent;
  const renameTabRef = useRef(renameTab);
  renameTabRef.current = renameTab;

  const handleUpdate = useCallback(({ editor }: { editor: any }) => {
    saveTabContentRef.current(tabIdRef.current, editor.getHTML());

    const firstHeading = editor.state.doc.firstChild;
    if (firstHeading?.type.name === "heading" && firstHeading.textContent) {
      renameTabRef.current(tabIdRef.current, firstHeading.textContent);
    }
  }, []);

  // Get Yjs instance if collaboration is enabled
  const collab = useMemo(() => {
    if (!collabRoomId) return null;
    return getCollabInstance(collabRoomId);
  }, [collabRoomId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (collabRoomId) {
        destroyCollabInstance(collabRoomId);
      }
    };
  }, [collabRoomId]);

  // Stable content for useEditor (computed once)
  const editorContent = useMemo(() => {
    if (collab) return undefined;
    return (
      initialContentRef.current ||
      `
      <h1>${tRef.current.editor.demoTitle}</h1>
      <p>${tRef.current.editor.demoBody}</p>
      <p><em>${tRef.current.editor.demoHint}</em></p>
    `
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collab]);

  // Build extensions based on collab mode
  const extensions = useMemo(() => {
    const baseExtensions = [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // Disable history when collaborating (Yjs handles undo/redo)
        ...(collab ? { history: false } : {}),
      }),
      Placeholder.configure({
        placeholder: () => tRef.current.editor.placeholder,
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      ImageExtension,
      ChartBlock,
      EmbedBlock,
      KPIBlock,
      ToggleBlock,
      CalloutBlock,
      DashboardGridBlock,
      SlashCommand.configure({
        suggestion: {
          items: ({ query }: { query: string }) => {
            const items = getCommandItems(null, tRef.current);
            const q = query.toLowerCase();
            return items.filter(
              (item) =>
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.keywords?.some((kw) => kw.toLowerCase().includes(q))
            );
          },
          render: () => {
            let component: ReactRenderer | null = null;
            let popup: any = null;

            return {
              onStart: (props: any) => {
                component = new ReactRenderer(SlashCommandList, {
                  props: {
                    ...props,
                    noResultsText: tRef.current.common.noResults,
                  },
                  editor: props.editor,
                });

                if (!props.clientRect) return;

                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              },
              onUpdate: (props: any) => {
                component?.updateProps({
                  ...props,
                  noResultsText: tRef.current.common.noResults,
                });
                if (popup && props.clientRect) {
                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  });
                }
              },
              onKeyDown: (props: any) => {
                if (props.event.key === "Escape") {
                  popup?.[0]?.hide();
                  return true;
                }
                return (component?.ref as any)?.onKeyDown(props);
              },
              onExit: () => {
                popup?.[0]?.destroy();
                component?.destroy();
              },
            };
          },
        },
      }),
    ];

    // Add collaboration extensions if collab is enabled
    if (collab) {
      baseExtensions.push(
        Collaboration.configure({
          document: collab.ydoc,
        }) as any,
        CollaborationCursor.configure({
          provider: collab.provider,
          user: collab.user,
        }) as any
      );
    }

    return baseExtensions;
  }, [collab]);

  // Stable editorProps (never changes)
  const editorProps = useMemo(
    () => ({
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[calc(100vh-10rem)] px-8 py-6",
      },
    }),
    []
  );

  const editor = useEditor({
    extensions,
    ...(editorContent !== undefined ? { content: editorContent } : {}),
    editorProps,
    immediatelyRender: false,
    onUpdate: handleUpdate,
  });

  useEffect(() => {
    if (editor && onEditorReadyRef.current) {
      onEditorReadyRef.current(editor);
    }
  }, [editor]);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Collaboration indicator */}
      {collab && (
        <div className="flex items-center gap-2 px-4 py-1 bg-green-50 border-b border-green-200 text-xs text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {collab.user.name}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
