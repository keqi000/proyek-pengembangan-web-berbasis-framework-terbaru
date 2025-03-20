"use client"

import { create } from "zustand";

type RuanganItem = {
  id: string;
  nama: string;
  kapasitas: string;
}

type RuanganStore = {
  data: RuanganItem[];
  setData: (data: RuanganItem[]) => void;
  addData: (data: Omit<RuanganItem, "id">) => void;
  deleteData: (id: RuanganItem['id']) => void;
  updateData: (
    id: RuanganItem['id'], 
    nama: RuanganItem['nama'], 
    kapasitas: RuanganItem['kapasitas']
  ) => void;
}

// TODO: use generic type to make a generic store
// probably using something like
// ```
// create<T>((set) => ({
//  data: T[], 
//  setData: (data: T) => set((state) => ({...})),
//  addData: (data: Omit<T, "id">) => set((state) => ({...})),
//  deleteData: (id: T['id']) => set((state) => ({...})),
//  updateData: (...T) => set((state) => ({...}))
// }))
// ```

export const useRoomStore = create<RuanganStore>((set) => ({
  data: [],
  setData: (data: RuanganItem[]) => set((state) => ({
    ...state, 
    'data': data
  })),
  deleteData: (id: RuanganItem['id']) => set((state) => {
    return {
      ...state,
      data: state.data.filter((item) => item.id !== id)
    }
  }),
  addData: (data: Omit<RuanganItem, "id">) => set((state) => {
    return {
      ...state,
      data: [...state.data, {
        'id': state.data.length.toString(),
        'kapasitas': data.kapasitas,
        'nama': data.nama
      }]
    }
  }),
  updateData: (id: RuanganItem["id"], nama: RuanganItem["nama"], kapasitas: RuanganItem["kapasitas"]) => set((state) => {
    // Change the returned value when id is same
    const newData = state.data.map((item) => item.id !== id ? item : {
      ...item, 
      nama: nama ?? item.nama, 
      kapasitas: kapasitas ?? item.kapasitas
    })
    return {
      ...state,
      data: newData
    }
  })
}))