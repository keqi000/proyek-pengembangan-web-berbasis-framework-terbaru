"use client";

import React, { useState } from "react";
import { useMataKuliahStore } from "../_store/matakuliah";
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaBook 
} from "react-icons/fa";
import { useCourseInfo, useCreateCourse} from "../_query/course";

// TODo: rename the attribute
type TempInputData = {
  id?: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
};

const KelolaMataKuliah = () => {
  // const mataKuliahList = useMataKuliahStore((state) => state.data);
  const {data: mataKuliahList} = useCourseInfo()
  // const addMataKuliah = useMataKuliahStore((state) => state.addData);
  const createMutation = useCreateCourse()

  const updateMataKuliah = useMataKuliahStore((state) => state.updateData);
  const deleteMataKuliah = useMataKuliahStore((state) => state.deleteData);

  const [tempInput, setTempInput] = useState<TempInputData>({
    kode: "",
    nama: "",
    semester: "",
    sks: "",
  });

  const [editPopup, setEditPopup] = useState(false);
  const [selectedMataKuliah, setSelectedMataKuliah] =
    useState<TempInputData | null>(null);
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
      updateMataKuliah(
        tempInput.id,
        tempInput.kode,
        tempInput.nama,
        tempInput.semester,
        tempInput.sks
      );
    } else {
      // addMataKuliah({
      //   kode: tempInput.kode,
      //   nama: tempInput.nama,
      //   semester: tempInput.semester,
      //   sks: tempInput.sks,
      // });
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

  const handleEditClick = (mataKuliah: TempInputData) => {
    setSelectedMataKuliah(mataKuliah);
    setEditPopup(true);
  };

  const handleConfirmEdit = () => {
    if (selectedMataKuliah !== null && selectedMataKuliah.id) {
      if (
        !selectedMataKuliah.kode ||
        !selectedMataKuliah.nama ||
        !selectedMataKuliah.semester ||
        !selectedMataKuliah.sks
      ) {
        alert("Harap isi semua field!");
        return;
      }
      updateMataKuliah(
        selectedMataKuliah.id,
        selectedMataKuliah.kode,
        selectedMataKuliah.nama,
        selectedMataKuliah.semester,
        selectedMataKuliah.sks
      );
    }
    setEditPopup(false);
  };

  const handleCancelEdit = () => {
    setEditPopup(false);
  };

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

        <div className="overflow-x-auto">
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
                  <tr
                    key={mataKuliah.id}
                    className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                  >
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4">{mataKuliah.kode}</td>
                    <td className="px-4 py-4 font-medium">{mataKuliah.nama}</td>
                    <td className="px-4 py-4 text-center">
                      Semester {mataKuliah.semester}
                    </td>
                    <td className="px-4 py-4 text-center">{mataKuliah.sks}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => handleEditClick(mataKuliah)}
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Yakin ingin menghapus mata kuliah ini?"
                              )
                            ) {
                              deleteMataKuliah(mataKuliah.id);
                            }
                          }}
                          title="Hapus"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
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
        </div>

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

      {/* Popup Edit */}
      {editPopup && selectedMataKuliah && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
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
                  value={selectedMataKuliah.kode}
                  onChange={(e) =>
                    setSelectedMataKuliah({
                      ...selectedMataKuliah,
                      kode: e.target.value,
                    })
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
                  value={selectedMataKuliah.nama}
                  onChange={(e) =>
                    setSelectedMataKuliah({
                      ...selectedMataKuliah,
                      nama: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[#4F959D] font-medium mb-2">
                  Semester
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedMataKuliah.semester}
                  onChange={(e) =>
                    setSelectedMataKuliah({
                      ...selectedMataKuliah,
                      semester: e.target.value,
                    })
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
                  value={selectedMataKuliah.sks}
                  onChange={(e) =>
                    setSelectedMataKuliah({
                      ...selectedMataKuliah,
                      sks: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 w-1/2 rounded-lg hover:bg-gray-400 transition"
                  onClick={handleCancelEdit}
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
        </div>
      )}
    </div>
  );
};

export default KelolaMataKuliah;
