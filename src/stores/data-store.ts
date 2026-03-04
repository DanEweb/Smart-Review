"use client";

import { create } from "zustand";

export interface DataSource {
  id: string;
  name: string;
  type: "csv" | "excel" | "json" | "api";
  data: Record<string, any>[];
  columns: string[];
  createdAt: number;
}

interface DataState {
  dataSources: DataSource[];
  addDataSource: (source: DataSource) => void;
  removeDataSource: (id: string) => void;
  getDataSource: (id: string) => DataSource | undefined;
  updateDataSource: (id: string, patch: Partial<DataSource>) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  dataSources: [],

  addDataSource: (source) =>
    set((state) => ({
      dataSources: [...state.dataSources, source],
    })),

  removeDataSource: (id) =>
    set((state) => ({
      dataSources: state.dataSources.filter((s) => s.id !== id),
    })),

  getDataSource: (id) => get().dataSources.find((s) => s.id === id),

  updateDataSource: (id, patch) =>
    set((state) => ({
      dataSources: state.dataSources.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    })),
}));
