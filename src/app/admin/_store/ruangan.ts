"use client";

import { create } from "zustand";
import { fetchRuangan } from "../../services/api";

type RuanganItem = {
  id: string;
  nama: string;
  kapasitas: string;
};

type RuanganStore = {
  data: RuanganItem[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  setData: (data: RuanganItem[]) => void;
  addData: (data: Omit<RuanganItem, "id">) => void;
  deleteData: (id: RuanganItem["id"]) => void;
  updateData: (
    id: RuanganItem["id"],
    nama: RuanganItem["nama"],
    kapasitas: RuanganItem["kapasitas"]
  ) => void;
};

export const useRoomStore = create<RuanganStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchRuangan();
      set({ data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  setData: (data: RuanganItem[]) =>
    set((state) => ({
      ...state,
      data: data,
    })),

  deleteData: (id: RuanganItem["id"]) =>
    set((state) => {
      return {
        ...state,
        data: state.data.filter((item) => item.id !== id),
      };
    }),

  addData: (data: Omit<RuanganItem, "id">) =>
    set((state) => {
      return {
        ...state,
        data: [
          ...state.data,
          {
            id: state.data.length.toString(),
            kapasitas: data.kapasitas,
            nama: data.nama,
          },
        ],
      };
    }),

  updateData: (
    id: RuanganItem["id"],
    nama: RuanganItem["nama"],
    kapasitas: RuanganItem["kapasitas"]
  ) =>
    set((state) => {
      // Change the returned value when id is same
      const newData = state.data.map((item) =>
        item.id !== id
          ? item
          : {
              ...item,
              nama: nama ?? item.nama,
              kapasitas: kapasitas ?? item.kapasitas,
            }
      );
      return {
        ...state,
        data: newData,
      };
    }),
}));
