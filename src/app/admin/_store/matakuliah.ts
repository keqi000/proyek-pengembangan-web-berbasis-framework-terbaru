"use client";

import { create } from "zustand";

type MataKuliahItem = {
  id: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
};

type MataKuliahStore = {
  data: MataKuliahItem[];
  setData: (data: MataKuliahItem[]) => void;
  addData: (data: Omit<MataKuliahItem, "id">) => void;
  deleteData: (id: MataKuliahItem["id"]) => void;
  updateData: (
    id: MataKuliahItem["id"],
    kode: MataKuliahItem["kode"],
    nama: MataKuliahItem["nama"],
    semester: MataKuliahItem["semester"],
    sks: MataKuliahItem["sks"]
  ) => void;
};

export const useMataKuliahStore = create<MataKuliahStore>((set) => ({
  data: [],
  setData: (data: MataKuliahItem[]) =>
    set((state) => ({ ...state, data: data })),
  addData: (data: Omit<MataKuliahItem, "id">) =>
    set((state) => {
      const _newId = state.data.length + 1;
      return {
        ...state,
        data: [...state.data, { id: _newId.toString(), ...data }],
      };
    }),
  deleteData: (id: MataKuliahItem["id"]) =>
    set((state) => {
      const newData = state.data.filter((item) => item.id !== id);
      return {
        ...state,
        data: newData,
      };
    }),
  updateData: (
    id: MataKuliahItem["id"],
    kode: MataKuliahItem["kode"],
    nama: MataKuliahItem["nama"],
    semester: MataKuliahItem["semester"],
    sks: MataKuliahItem["sks"]
  ) =>
    set((state) => {
      const newData = state.data.map((item) =>
        item.id !== id
          ? item
          : {
              ...item,
              kode: kode,
              nama: nama,
              semester: semester,
              sks: sks,
            }
      );
      return {
        ...state,
        data: newData,
      };
    }),
}));
