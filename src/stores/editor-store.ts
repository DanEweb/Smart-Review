"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";

export interface PageTab {
  id: string;
  title: string;
  content: string; // HTML string (Tiptap JSON could be used later)
  createdAt: number;
}

interface EditorState {
  // Block selection
  selectedBlockId: string | null;
  isConfigPanelOpen: boolean;
  isSidebarOpen: boolean;
  pinnedBlockIds: string[];

  // Tab / Page system
  tabs: PageTab[];
  activeTabId: string;
  splitTabId: string | null; // second tab for split view

  // Collaboration
  collabRoomId: string | null;
  setCollabRoom: (roomId: string | null) => void;

  // Actions - blocks
  selectBlock: (id: string | null) => void;
  toggleConfigPanel: (open?: boolean) => void;
  toggleSidebar: (open?: boolean) => void;
  pinBlock: (id: string) => void;
  unpinBlock: (id: string) => void;

  // Actions - tabs
  addTab: (title?: string) => string;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  renameTab: (id: string, title: string) => void;
  saveTabContent: (id: string, content: string) => void;
  setSplitTab: (id: string | null) => void;
}

const defaultTabId = nanoid();

export const useEditorStore = create<EditorState>((set, get) => ({
  selectedBlockId: null,
  isConfigPanelOpen: false,
  isSidebarOpen: true,
  pinnedBlockIds: [],

  tabs: [
    {
      id: defaultTabId,
      title: "",
      content: "",
      createdAt: Date.now(),
    },
  ],
  activeTabId: defaultTabId,
  splitTabId: null,
  collabRoomId: null,

  setCollabRoom: (roomId) =>
    set({ collabRoomId: roomId }),

  selectBlock: (id) =>
    set({ selectedBlockId: id, isConfigPanelOpen: id !== null }),

  toggleConfigPanel: (open) =>
    set((state) => ({
      isConfigPanelOpen: open ?? !state.isConfigPanelOpen,
    })),

  toggleSidebar: (open) =>
    set((state) => ({
      isSidebarOpen: open ?? !state.isSidebarOpen,
    })),

  pinBlock: (id) =>
    set((state) => {
      if (state.pinnedBlockIds.includes(id)) return state;
      if (state.pinnedBlockIds.length >= 2) return state;
      return { pinnedBlockIds: [...state.pinnedBlockIds, id] };
    }),

  unpinBlock: (id) =>
    set((state) => ({
      pinnedBlockIds: state.pinnedBlockIds.filter((bid) => bid !== id),
    })),

  addTab: (title) => {
    const id = nanoid();
    set((state) => ({
      tabs: [
        ...state.tabs,
        {
          id,
          title: title || "",
          content: "",
          createdAt: Date.now(),
        },
      ],
      activeTabId: id,
    }));
    return id;
  },

  removeTab: (id) =>
    set((state) => {
      if (state.tabs.length <= 1) return state;
      const newTabs = state.tabs.filter((t) => t.id !== id);
      const newActive =
        state.activeTabId === id ? newTabs[0].id : state.activeTabId;
      const newSplit =
        state.splitTabId === id ? null : state.splitTabId;
      return { tabs: newTabs, activeTabId: newActive, splitTabId: newSplit };
    }),

  setActiveTab: (id) =>
    set({ activeTabId: id }),

  renameTab: (id, title) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, title } : t)),
    })),

  saveTabContent: (id, content) =>
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, content } : t)),
    })),

  setSplitTab: (id) =>
    set({ splitTabId: id }),
}));
