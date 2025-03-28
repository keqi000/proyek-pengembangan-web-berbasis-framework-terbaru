"use client";

import React, { useState } from "react";
import { useDosenStore } from "../_store/dosen";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaUserTie } from "react-icons/fa";

type TempInputData = {
  id?: string;
  nama: string;
  nip: string;
};

const KelolaDosen = () => {
  const dosenList = useDosenStore((state) => state.data);
  const addDosen = useDosenStore((state) => state.addData);
  const updateDosen = useDosenStore((state) => state.updateData);
  const deleteDosen = useDosenStore((state) => state.deleteData);

  const [tempInput, setTempInput] = useState<TempInputData>({
    nama: "",
    nip: "",
  });

  const [editPopup, setEditPopup] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState<TempInputData | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = () => {
    if (!tempInput.nama || !tempInput.nip) {
      alert("Harap isi semua field!");
      return;
    }

    if (tempInput.id) {
      updateDosen(tempInput.id, tempInput.nama, tempInput.nip);
    } else {
      addDosen({
        id: (dosenList.length + 1).toString(),
        nama: tempInput.nama,
        nip: tempInput.nip,
      });
    }
    setTempInput({ nama: "", nip: "" });
    setShowAddForm(false);
  };

  const handleEditClick = (dosen: TempInputData) => {
    setSelectedDosen(dosen);
    setEditPopup(true);
  };

  const handleConfirmEdit = () => {
    if (selectedDosen !== null && selectedDosen.id) {
      if (!selectedDosen.nama || !selectedDosen.nip) {
        alert("Harap isi semua field!");
        return;
      }
      updateDosen(selectedDosen.id, selectedDosen.nama, selectedDosen.nip);
    }
    setEditPopup(false);
  };

  const handleCancelEdit = () => {
    setEditPopup(false);
  };

  const filteredDosen = dosenList.filter(
    (dosen) =>
      dosen.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dosen.nip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-[#F2F2F2] min-h-screen">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C3930]">
              Kelola <span className="text-[#4F959D]">Dosen</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Mengelola data dosen untuk sistem penjadwalan
            </p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari dosen atau NIP..."
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
              <FaPlus className="mr-2" /> Tambah Dosen
            </button>
          </div>
        </div>
      </div>

      {/* Form Tambah Dosen (Collapsible) */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-all duration-300">
          <h2 className="text-[#4F959D] text-lg font-semibold mb-4 flex items-center">
            <FaUserTie className="mr-2" /> Tambah Data Dosen
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#4F959D] font-medium mb-2">
                Nama Dosen
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                placeholder="Masukkan nama dosen"
                value={tempInput.nama}
                onChange={(e) =>
                  setTempInput({ ...tempInput, nama: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[#4F959D] font-medium mb-2">
                NIP
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                placeholder="Masukkan NIP dosen"
                value={tempInput.nip}
                onChange={(e) =>
                  setTempInput({ ...tempInput, nip: e.target.value })
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

      {/* Tabel Data Dosen */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 flex items-center">
          <FaUserTie className="mr-2" /> Daftar Dosen
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-[#F5F5F5]">
                <th className="px-4 py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-16">
                  No
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                  Nama Dosen
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                  NIP
                </th>
                <th className="px-4 py-3 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-24">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredDosen.length > 0 ? (
                filteredDosen.map((dosen, index) => (
                  <tr
                    key={dosen.id}
                    className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                  >
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4 font-medium">{dosen.nama}</td>
                    <td className="px-4 py-4">{dosen.nip}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => handleEditClick(dosen)}
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => {
                            if (
                              window.confirm("Yakin ingin menghapus dosen ini?")
                            ) {
                              deleteDosen(dosen.id);
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
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500 bg-gray-50"
                  >
                    {searchTerm
                      ? "Tidak ada hasil yang sesuai dengan pencarian"
                      : "Belum ada data dosen"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Stats */}
        <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
          <div>
            Total: <span className="font-medium">{filteredDosen.length}</span>{" "}
            dosen
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
      {editPopup && selectedDosen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 max-w-md animate-fadeIn">
            <h2 className="text-[#4F959D] text-lg font-semibold mb-4 flex items-center">
              <FaUserTie className="mr-2" /> Edit Data Dosen
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-[#4F959D] font-medium mb-2">
                  Nama Dosen
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedDosen.nama}
                  onChange={(e) =>
                    setSelectedDosen({ ...selectedDosen, nama: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[#4F959D] font-medium mb-2">
                  NIP
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedDosen.nip}
                  onChange={(e) =>
                    setSelectedDosen({
                      ...selectedDosen,
                      nip: e.target.value,
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

export default KelolaDosen;
