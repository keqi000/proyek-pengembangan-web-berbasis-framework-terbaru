"use client";

import { create } from "zustand";

type DosenItem = {
  id: string;
  nama: string;
  nip: string;
};

type DosenStore = {
  data: DosenItem[];
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
  setData: (data: DosenItem[]) => set((state) => ({ ...state, data: data })),
  addData: (data: Omit<DosenItem, "id">) =>
    set((state) => {
      // TODO: handle de-duplication
      const _newId = state.data.length + 1;
      return {
        ...state,
        data: [...state.data, { id: _newId.toString(), ...data }],
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
