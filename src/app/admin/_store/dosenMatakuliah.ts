"use client";

import { create } from "zustand";

type DosenMatakuliahItem = {
  id: string;
  dosenId: string;
  mataKuliahId: string;
};

type DosenMatakuliahStore = {
  data: DosenMatakuliahItem[];
  setData: (data: DosenMatakuliahItem[]) => void;
  addAssignment: (dosenId: string, mataKuliahId: string) => void;
  removeAssignment: (dosenId: string, mataKuliahId: string) => void;
  getDosenByMataKuliah: (mataKuliahId: string) => string[];
  getMataKuliahByDosen: (dosenId: string) => string[];
};

export const useDosenMatakuliahStore = create<DosenMatakuliahStore>(
  (set, get) => ({
    data: [],
    setData: (data: DosenMatakuliahItem[]) => set({ data }),

    addAssignment: (dosenId: string, mataKuliahId: string) =>
      set((state) => {
        // Check if assignment already exists
        const exists = state.data.some(
          (item) =>
            item.dosenId === dosenId && item.mataKuliahId === mataKuliahId
        );

        if (exists) return state;

        const newId = `${dosenId}-${mataKuliahId}`;
        return {
          data: [...state.data, { id: newId, dosenId, mataKuliahId }],
        };
      }),

    removeAssignment: (dosenId: string, mataKuliahId: string) =>
      set((state) => ({
        data: state.data.filter(
          (item) =>
            !(item.dosenId === dosenId && item.mataKuliahId === mataKuliahId)
        ),
      })),

    getDosenByMataKuliah: (mataKuliahId: string) => {
      return get()
        .data.filter((item) => item.mataKuliahId === mataKuliahId)
        .map((item) => item.dosenId);
    },

    getMataKuliahByDosen: (dosenId: string) => {
      return get()
        .data.filter((item) => item.dosenId === dosenId)
        .map((item) => item.mataKuliahId);
    },
  })
);
