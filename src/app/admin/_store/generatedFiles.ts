"use client";

import { create } from "zustand";
import { fetchGeneratedFiles, deleteGeneratedFile } from "../../services/api";
import type { GeneratedFileResponse } from "../../services/api";

export type GeneratedFileItem = GeneratedFileResponse;

type GeneratedFileStore = {
  data: GeneratedFileItem[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  addFile: (file: GeneratedFileItem) => void;
};

export const useGeneratedFileStore = create<GeneratedFileStore>((set, get) => ({
  data: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchGeneratedFiles();
      set({ data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  deleteFile: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteGeneratedFile(id);
      const newData = get().data.filter((file) => file.id !== id);
      set({ data: newData, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  addFile: (file: GeneratedFileItem) => {
    set((state) => ({
      data: [file, ...state.data],
    }));
  },
}));
