"use client";

import { create } from "zustand";

type MataKuliahItem = {
  id: string;
  nama: string;
  kode: string;
  sks: string;
  semester: string; // Added semester property
};

type MataKuliahStore = {
  data: MataKuliahItem[];
  setData: (data: MataKuliahItem[]) => void;
  addData: (data: Omit<MataKuliahItem, "id">) => void;
  deleteData: (id: MataKuliahItem["id"]) => void;
  updateData: (
    id: MataKuliahItem["id"],
    nama: MataKuliahItem["nama"],
    kode: MataKuliahItem["kode"],
    semester: MataKuliahItem["semester"], // Added semester parameter
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
    nama: MataKuliahItem["nama"],
    kode: MataKuliahItem["kode"],
    semester: MataKuliahItem["semester"], // Added semester parameter
    sks: MataKuliahItem["sks"]
  ) =>
    set((state) => {
      const newData = state.data.map((item) =>
        item.id !== id
          ? item
          : {
              ...item,
              nama: nama ?? item.nama,
              kode: kode ?? item.kode,
              semester: semester ?? item.semester, // Added semester update
              sks: sks ?? item.sks,
            }
      );
      return {
        ...state,
        data: newData,
      };
    }),
}));
