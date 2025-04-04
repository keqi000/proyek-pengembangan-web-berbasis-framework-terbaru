"use client"

import { ChangeEvent, useState } from "react";
import { useUpdateCourse } from "../../_query/course";
import { useCourseClientState } from "../hooks/clientStateStore";
import { FaBook } from "react-icons/fa";

type TempInputData = {
    id?: string;
    kode: string;
    nama: string;
    semester: string;
    sks: string;
  };

type CourseEditPopupDialogProps = {
  mataKuliah: TempInputData;
}

export default function CourseEditPopupDialog({mataKuliah}: CourseEditPopupDialogProps){
  const updateMutation = useUpdateCourse()
  
  const setEditDialogOpen = useCourseClientState((state) => state.setEditDialogOpen)

  const [tempInput, setTempInput] = useState<TempInputData>({
    id: mataKuliah.id!,
    kode: mataKuliah.kode,
    nama: mataKuliah.nama,
    semester: mataKuliah.semester,
    sks: mataKuliah.sks,
  });

  const handleEditInput = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const {name, value} = event.target
    setTempInput({
      ...tempInput, 
      [name]: value
    })
  }

  const handleConfirmEdit = () => {
    updateMutation.mutate({
      id: +tempInput.id!,
      name:tempInput.nama, 
      credit: +tempInput.sks, 
      description: null, 
      semester: +tempInput.semester,
    })
    setEditDialogOpen(false)
  }

  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 max-w-md animate-fadeIn">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 flex items-center">
          <FaBook className="mr-2" /> Edit Data Mata Kuliah
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-[#4F959D] font-medium mb-2">
              Kode Mata Kuliah
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
              value={mataKuliah.kode}
              name="kode"
              onChange={(event) => handleEditInput(event)}
            />
          </div>
          <div>
            <label className="block text-[#4F959D] font-medium mb-2">
              Nama Mata Kuliah
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
              value={tempInput.nama}
              name="name"
              onChange={(event) => handleEditInput(event)}
            />
          </div>
          <div>
            <label className="block text-[#4F959D] font-medium mb-2">
              Semester
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
              value={tempInput.semester}
              name="semester"
              onChange={(event) => handleEditInput(event)}
            >
              <option value="">Pilih Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>
          <div>
            <label className="block text-[#4F959D] font-medium mb-2">
              SKS
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
              value={tempInput.sks}
              name="sks"
              onChange={(event) => handleEditInput(event)}
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 w-1/2 rounded-lg hover:bg-gray-400 transition"
              onClick={() => setEditDialogOpen(false)}
            >
              Batal
            </button>
            <button
              type="button"
              className="bg-[#4F959D] text-white px-4 py-2 w-1/2 rounded-lg hover:bg-[#3C7A85] transition"
              onClick={handleConfirmEdit}
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}