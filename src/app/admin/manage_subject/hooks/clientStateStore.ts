import { create } from "zustand";

type TempInputData = {
  id?: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
};

type CourseClientStateType = {
  isEditDialogOpen: boolean;
  setEditDialogOpen: (isOpen: boolean) => void;
  selectedData: TempInputData | null;
  setSelectedData: (data: TempInputData) => void;
}

export const useCourseClientState = create<CourseClientStateType>((set) => ({
  selectedData: null,
  isEditDialogOpen: false,
  setEditDialogOpen: (isOpen: boolean) => set((state) => ({...state, isEditDialogOpen: isOpen})),
  setSelectedData: (data: TempInputData) => set((state) => ({...state, selectedData: data}))
}))