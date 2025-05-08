"use client";

import { create } from "zustand";
import {
  assignDosenToMataKuliah,
  removeDosenFromMataKuliah,
  getDosenForMataKuliah,
} from "../../services/api";

type Assignment = {
  dosenId: string;
  mataKuliahId: string;
};

type DosenMatakuliahStore = {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;

  // Load assignments for a specific course
  loadAssignmentsForCourse: (mataKuliahId: string) => Promise<void>;

  // Add assignment with API integration
  addAssignment: (dosenId: string, mataKuliahId: string) => Promise<void>;

  // Remove assignment with API integration
  removeAssignment: (dosenId: string, mataKuliahId: string) => Promise<void>;

  // Get all dosen IDs for a mata kuliah
  getDosenByMataKuliah: (mataKuliahId: string) => string[];

  // Get all mata kuliah IDs for a dosen
  getMataKuliahByDosen: (dosenId: string) => string[];

  // Set assignments directly (for initial load)
  setAssignments: (assignments: Assignment[]) => void;
};

export const useDosenMatakuliahStore = create<DosenMatakuliahStore>(
  (set, get) => ({
    assignments: [],
    loading: false,
    error: null,

    loadAssignmentsForCourse: async (mataKuliahId: string) => {
      set({ loading: true, error: null });
      try {
        const dosens = await getDosenForMataKuliah(mataKuliahId);

        // Transform API response to assignments format
        const assignments = dosens.map((dosen: { id: string }) => ({
          dosenId: dosen.id,
          mataKuliahId: mataKuliahId,
        }));

        // Merge with existing assignments, replacing any for this course
        const currentAssignments = get().assignments.filter(
          (a) => a.mataKuliahId !== mataKuliahId
        );

        set({
          assignments: [...currentAssignments, ...assignments],
          loading: false,
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        });
      }
    },

    addAssignment: async (dosenId: string, mataKuliahId: string) => {
      set({ loading: true, error: null });
      try {
        await assignDosenToMataKuliah(dosenId, mataKuliahId);

        // Update local state
        const currentAssignments = get().assignments;
        const exists = currentAssignments.some(
          (a) => a.dosenId === dosenId && a.mataKuliahId === mataKuliahId
        );

        if (!exists) {
          set({
            assignments: [...currentAssignments, { dosenId, mataKuliahId }],
            loading: false,
          });
        } else {
          set({ loading: false });
        }
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        });
      }
    },

    removeAssignment: async (dosenId: string, mataKuliahId: string) => {
      set({ loading: true, error: null });
      try {
        await removeDosenFromMataKuliah(dosenId, mataKuliahId);

        // Update local state
        const currentAssignments = get().assignments;
        const newAssignments = currentAssignments.filter(
          (a) => !(a.dosenId === dosenId && a.mataKuliahId === mataKuliahId)
        );

        set({
          assignments: newAssignments,
          loading: false,
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Unknown error",
          loading: false,
        });
      }
    },

    getDosenByMataKuliah: (mataKuliahId: string) => {
      return get()
        .assignments.filter(
          (assignment) => assignment.mataKuliahId === mataKuliahId
        )
        .map((assignment) => assignment.dosenId);
    },

    getMataKuliahByDosen: (dosenId: string) => {
      return get()
        .assignments.filter((assignment) => assignment.dosenId === dosenId)
        .map((assignment) => assignment.mataKuliahId);
    },

    setAssignments: (assignments: Assignment[]) => {
      set({ assignments });
    },
  })
);
