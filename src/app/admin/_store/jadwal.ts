"use client";

import { create } from "zustand";
import {
  fetchJadwal,
  generateJadwal,
  deleteJadwal,
  deleteAllJadwal,
  filterJadwalByDay,
  searchJadwal,
} from "../../services/schedule";

type JadwalItem = {
  id: string;
  namaDosen: string;
  mataKuliah: string;
  semester: string;
  ruangan: string;
  waktu: string;
  hari: string;
};

type JadwalStore = {
  data: JadwalItem[];
  filteredData: JadwalItem[];
  loading: boolean;
  error: string | null;

  // Fetch all schedules
  fetchData: () => Promise<void>;

  // Generate schedules
  generateData: (clearExisting?: boolean) => Promise<void>;

  // Delete a schedule
  deleteData: (id: string) => Promise<void>;

  // Delete all schedules
  deleteAllData: () => Promise<void>;

  // Filter schedules by day
  filterByDay: (day: string | null) => Promise<void>;

  // Search schedules
  searchData: (query: string) => Promise<void>;

  // Set data directly
  setData: (data: JadwalItem[]) => void;

  // Set filtered data
  setFilteredData: (data: JadwalItem[]) => void;
};

export const useJadwalStore = create<JadwalStore>((set, get) => ({
  data: [],
  filteredData: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchJadwal();
      set({ data, filteredData: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  generateData: async (clearExisting: boolean = true) => {
    set({ loading: true, error: null });
    try {
      const response = await generateJadwal(clearExisting);
      if (response && response.schedules) {
        set({
          data: response.schedules,
          filteredData: response.schedules,
          loading: false,
        });
      }
      return response; // Return response lengkap, termasuk generated_file
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
      throw error;
    }
  },

  deleteData: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteJadwal(id);
      const newData = get().data.filter((item) => item.id !== id);
      set({
        data: newData,
        filteredData: get().filteredData.filter((item) => item.id !== id),
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  deleteAllData: async () => {
    set({ loading: true, error: null });
    try {
      await deleteAllJadwal();
      set({ data: [], filteredData: [], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  filterByDay: async (day: string | null) => {
    set({ loading: true, error: null });
    try {
      if (day) {
        const filteredData = await filterJadwalByDay(day);
        set({ filteredData, loading: false });
      } else {
        // If no day specified, show all data
        set({ filteredData: get().data, loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  searchData: async (query: string) => {
    set({ loading: true, error: null });
    try {
      if (query.trim()) {
        const searchResults = await searchJadwal(query);
        set({ filteredData: searchResults, loading: false });
      } else {
        // If no query, show all data
        set({ filteredData: get().data, loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  setData: (data: JadwalItem[]) => {
    set({ data, filteredData: data });
  },

  setFilteredData: (filteredData: JadwalItem[]) => {
    set({ filteredData });
  },
}));
