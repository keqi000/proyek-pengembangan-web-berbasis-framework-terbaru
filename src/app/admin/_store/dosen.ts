"use client";

import { create } from "zustand";
import { fetchDosen } from "../../services/api";

type DosenItem = {
  id: string;
  nama: string;
  nip: string;
};

type DosenStore = {
  data: DosenItem[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  setData: (data: DosenItem[]) => void;
  addData: (data: DosenItem) => void;
  deleteData: (id: DosenItem["id"]) => void;
  updateData: (
    id: DosenItem["id"],
    nama: DosenItem["nama"],
    nip: DosenItem["nip"]
  ) => void;
};

export const useDosenStore = create<DosenStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDosen();
      set({ data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  setData: (data: DosenItem[]) => set((state) => ({ ...state, data: data })),

  addData: (data: DosenItem) =>
    set((state) => {
      return {
        ...state,
        data: [...state.data, data],
      };
    }),

  deleteData: (id: DosenItem["id"]) =>
    set((state) => {
      const newData = state.data.filter((item) => item.id !== id);
      return {
        ...state,
        data: newData,
      };
    }),

  updateData: (
    id: DosenItem["id"],
    nama: DosenItem["nama"],
    nip: DosenItem["nip"]
  ) =>
    set((state) => {
      const newData = state.data.map((item) =>
        item.id !== id
          ? item
          : {
              ...item,
              nama: nama,
              nip: nip,
            }
      );
      return {
        ...state,
        data: newData,
      };
    }),
}));
