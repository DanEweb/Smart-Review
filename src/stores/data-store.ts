"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "@/lib/storage/idb-storage";

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

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: "smart-review-data",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
