"use client";

import React, { useState } from "react";
import { 
  FaPlus, 
  FaSearch, 
  FaBook 
} from "react-icons/fa";

import { 
  useCourseInfo, 
  useCreateCourse, 
  useUpdateCourse
} from "../_query/course";

import CourseDataRowInfo from "./components/CourseDataRow";
import CourseEditPopupDialog from "./components/CourseEditPopupDialog";
import { useCourseClientState } from "./hooks/clientStateStore";

// TODo: rename the attribute
type TempInputData = {
  id?: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
};

const KelolaMataKuliah = () => {
  const {data: mataKuliahList} = useCourseInfo()

  const createMutation = useCreateCourse()
  const updateMutation = useUpdateCourse()

  const [tempInput, setTempInput] = useState<TempInputData>({
    kode: "",
    nama: "",
    semester: "",
    sks: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = () => {
    if (
      !tempInput.kode ||
      !tempInput.nama ||
      !tempInput.semester ||
      !tempInput.sks
    ) {
      alert("Harap isi semua field!");
      return;
    }

    if (tempInput.id) {
      updateMutation.mutate({
        id: +tempInput.id,
        name:tempInput.nama, 
        credit: +tempInput.sks, 
        description: null, 
        semester: +tempInput.semester,
        
      })
    } else {
      createMutation.mutate({
        'name':tempInput.nama, 
        'credit': +tempInput.sks, 
        'description': "deskripsi", 
        'semester': +tempInput.semester
      })
    }
    setTempInput({ kode: "", nama: "", semester: "", sks: "" });
    setShowAddForm(false);
  };

  const selectedData = useCourseClientState((state) => state.selectedData)
  const isEditDialogOpen = useCourseClientState((state) => state.isEditDialogOpen)

  const filteredMataKuliah = mataKuliahList?.filter(
    (mataKuliah) =>
      mataKuliah.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mataKuliah.kode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-[#F2F2F2] min-h-screen">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C3930]">
              Kelola <span className="text-[#4F959D]">Mata Kuliah</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Mengelola data mata kuliah untuk sistem penjadwalan
            </p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari mata kuliah atau kode..."
                className="pl-10 pr-4 py-2 border border-white rounded-lg focus:outline-none ring-1 ring-gray-400 focus:ring-1 focus:ring-[#4F959D] w-full md:w-64 text-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#4F959D] text-white px-4 py-2 rounded-lg hover:bg-[#3C7A85] transition flex items-center"
            >
              <FaPlus className="mr-2" /> Tambah Mata Kuliah
            </button>
          </div>
        </div>
      </div>

      {/* Form Tambah Mata Kuliah (Collapsible) */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300">
          <h2 className="text-[#4F959D] text-lg font-semibold mb-4 flex items-center">
            <FaBook className="mr-2" /> Tambah Data Mata Kuliah
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#4F959D] font-medium mb-2">
                Kode Mata Kuliah
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                placeholder="Masukkan kode mata kuliah"
                value={tempInput.kode}
                onChange={(e) =>
                  setTempInput({ ...tempInput, kode: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[#4F959D] font-medium mb-2">
                Nama Mata Kuliah
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                placeholder="Masukkan nama mata kuliah"
                value={tempInput.nama}
                onChange={(e) =>
                  setTempInput({ ...tempInput, nama: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[#4F959D] font-medium mb-2">
                Semester
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                value={tempInput.semester}
                onChange={(e) =>
                  setTempInput({ ...tempInput, semester: e.target.value })
                }
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
                placeholder="Masukkan jumlah SKS"
                value={tempInput.sks}
                onChange={(e) =>
                  setTempInput({ ...tempInput, sks: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowAddForm(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="bg-[#4F959D] text-white px-6 py-2 rounded-lg hover:bg-[#3C7A85] transition"
                onClick={handleSubmit}
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data Mata Kuliah */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 flex items-center">
          <FaBook className="mr-2" /> Daftar Mata Kuliah
        </h2>

        <section className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-[#F5F5F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-16">
                  No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                  Kode
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                  Nama Mata Kuliah
                </th>
                <th className="px-4 py-3 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                  Semester
                </th>
                <th className="px-4 py-3 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                  SKS
                </th>
                <th className="px-4 py-3 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-24">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredMataKuliah?.length! > 0 ? (
                filteredMataKuliah?.map((mataKuliah, index) => (
                  <CourseDataRowInfo 
                    key={mataKuliah.id}
                    mataKuliah={mataKuliah}
                    index={index}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 bg-gray-50"
                  >
                    {searchTerm
                      ? "Tidak ada hasil yang sesuai dengan pencarian"
                      : "Belum ada data mata kuliah"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Table Footer with Stats */}
        <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
          <div>
            Total:{" "}
            <span className="font-medium">{filteredMataKuliah?.length}</span>{" "}
            mata kuliah
          </div>
          {searchTerm && (
            <div>
              Hasil pencarian untuk:{" "}
              <span className="font-medium">"{searchTerm}"</span>
            </div>
          )}
        </div>
      </div>

      {isEditDialogOpen && selectedData && <CourseEditPopupDialog mataKuliah={selectedData}/>}
    </div>
  );
};

export default KelolaMataKuliah;
