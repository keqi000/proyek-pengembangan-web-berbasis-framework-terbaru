"use client";

import { create } from "zustand";
import {
  fetchMataKuliah,
  createMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "../../services/course";

type MataKuliahItem = {
  id: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
};

type MataKuliahStore = {
  data: MataKuliahItem[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  setData: (data: MataKuliahItem[]) => void;
  addData: (data: Omit<MataKuliahItem, "id">) => Promise<void>;
  deleteData: (id: MataKuliahItem["id"]) => Promise<void>;
  updateData: (
    id: MataKuliahItem["id"],
    kode: MataKuliahItem["kode"],
    nama: MataKuliahItem["nama"],
    semester: MataKuliahItem["semester"],
    sks: MataKuliahItem["sks"]
  ) => Promise<void>;
};

export const useMataKuliahStore = create<MataKuliahStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchMataKuliah();
      set({ data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  setData: (data: MataKuliahItem[]) => set((state) => ({ ...state, data })),

  addData: async (data: Omit<MataKuliahItem, "id">) => {
    set({ loading: true, error: null });
    try {
      const newItem = await createMataKuliah(data);
      set((state) => ({
        ...state,
        data: [...state.data, newItem],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  deleteData: async (id: MataKuliahItem["id"]) => {
    set({ loading: true, error: null });
    try {
      await deleteMataKuliah(id);
      set((state) => ({
        ...state,
        data: state.data.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  updateData: async (
    id: MataKuliahItem["id"],
    kode: MataKuliahItem["kode"],
    nama: MataKuliahItem["nama"],
    semester: MataKuliahItem["semester"],
    sks: MataKuliahItem["sks"]
  ) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await updateMataKuliah(id, {
        kode,
        nama,
        semester,
        sks,
      });
      set((state) => ({
        ...state,
        data: state.data.map((item) => (item.id !== id ? item : updatedItem)),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },
}));
