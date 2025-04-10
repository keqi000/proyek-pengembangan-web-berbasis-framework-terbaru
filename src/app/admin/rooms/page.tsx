"use client";

import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaDoorOpen,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useRoomStore } from "../_store/ruangan";
import { RuanganItem } from "../_scheme/room";

const KelolaRuangan = () => {
  const ruanganList = useRoomStore((state) => state.data);
  const addRuangan = useRoomStore((state) => state.addData);
  const updateRuangan = useRoomStore((state) => state.updateData);
  const deleteRuangan = useRoomStore((state) => state.deleteData);

  const [tempInput, setTempInput] = useState<RuanganItem>({
    id: "",
    nama: "",
    kapasitas: "",
  });

  const [editPopup, setEditPopup] = useState(false);
  const [selectedRuangan, setSelectedRuangan] = useState<RuanganItem | null>(
    null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!tempInput.nama || !tempInput.kapasitas) {
      alert("Harap isi semua field!");
      return;
    }

    addRuangan({
      nama: tempInput.nama,
      kapasitas: tempInput.kapasitas,
    });

    setTempInput({
      id: "",
      nama: "",
      kapasitas: "",
    });
    setShowAddForm(false);
  };

  const handleEditClick = (ruangan: RuanganItem) => {
    setSelectedRuangan(ruangan);
    setEditPopup(true);
  };

  const handleConfirmEdit = () => {
    if (selectedRuangan?.id) {
      if (!selectedRuangan.nama || !selectedRuangan.kapasitas) {
        alert("Harap isi semua field!");
        return;
      }
      updateRuangan(
        selectedRuangan.id,
        selectedRuangan.nama,
        selectedRuangan.kapasitas
      );
    }
    setEditPopup(false);
  };

  const handleCancelEdit = () => {
    setEditPopup(false);
  };

  const handleDeleteClick = (id: string) => {
    setRoomToDelete(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (roomToDelete) {
      deleteRuangan(roomToDelete);
      setDeleteModal(false);
      setRoomToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setRoomToDelete(null);
  };

  const filteredRuangan = ruanganList.filter(
    (ruangan) =>
      ruangan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruangan.kapasitas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-full overflow-hidden p-2 sm:p-4 bg-[#F2F2F2] min-h-screen">
      {/* Header Section */}
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#2C3930]">
              Kelola <span className="text-[#4F959D]">Ruangan</span>
            </h1>
            <p className="text-gray-600 mt-1 text-xs sm:text-sm">
              Mengelola data ruangan dan kapasitasnya
            </p>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto md:space-x-3 gap-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari..."
                className="pl-8 pr-2 py-1.5 md:pl-10 md:pr-4 md:py-2 border border-white rounded-lg focus:outline-none ring-1 ring-gray-400 focus:ring-1 focus:ring-[#4F959D] w-full md:w-64 text-gray-600 text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-2.5 top-2.5 md:left-3 md:top-3 text-gray-400 text-xs md:text-base" />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#4F959D] text-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-lg hover:bg-[#3C7A85] transition flex items-center justify-center"
            >
              <FaPlus className="mr-1" /> Tambah
            </button>
          </div>
        </div>
      </div>

      {/* Form Tambah Ruangan (Collapsible) */}
      {showAddForm && (
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-3 sm:mb-4 transition-all duration-300">
          <h2 className="text-[#4F959D] text-base sm:text-lg font-semibold mb-3 flex items-center">
            <FaDoorOpen className="mr-2" /> Tambah Data Ruangan
          </h2>

          <form className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                Nama Ruangan
              </label>
              <input
                type="text"
                className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                placeholder="Masukkan nama ruangan"
                value={tempInput.nama}
                onChange={(e) =>
                  setTempInput({ ...tempInput, nama: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                Kapasitas Ruangan
              </label>
              <input
                type="number"
                className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                placeholder="Masukkan kapasitas ruangan"
                value={tempInput.kapasitas}
                onChange={(e) =>
                  setTempInput({ ...tempInput, kapasitas: e.target.value })
                }
              />
            </div>
            <div className="flex justify-start space-x-2">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-3 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowAddForm(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="bg-[#4F959D] text-white px-3 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-[#3C7A85] transition"
                onClick={handleSubmit}
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data Ruangan */}
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-base sm:text-lg font-semibold mb-3 flex items-center">
          <FaDoorOpen className="mr-2" /> Daftar Ruangan
        </h2>

        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F5F5F5]">
                <th className="px-2 py-2 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-8">
                  No
                </th>
                <th className="px-2 py-2 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                  Nama Ruangan
                </th>
                <th className="px-2 py-2 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                  Kapasitas
                </th>
                <th className="px-2 py-2 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-16">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredRuangan.length > 0 ? (
                filteredRuangan.map((ruangan, index) => (
                  <tr
                    key={ruangan.id}
                    className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                  >
                    <td className="px-2 py-2">{index + 1}</td>
                    <td className="px-2 py-2 font-medium">{ruangan.nama}</td>
                    <td className="px-2 py-2">{ruangan.kapasitas} orang</td>
                    <td className="px-2 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          onClick={() => handleEditClick(ruangan)}
                          title="Edit"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => handleDeleteClick(ruangan.id)}
                          title="Hapus"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-2 py-4 text-center text-gray-500 bg-gray-50 text-xs sm:text-sm"
                  >
                    {searchTerm
                      ? "Tidak ada hasil yang sesuai dengan pencarian"
                      : "Belum ada data ruangan"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Stats */}
        <div className="mt-3 text-xs text-gray-600 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1">
          <div>
            Total: <span className="font-medium">{filteredRuangan.length}</span>{" "}
            ruangan
          </div>
          {searchTerm && (
            <div className="truncate max-w-full">
              Hasil pencarian:{" "}
              <span className="font-medium">&quot;{searchTerm}&quot;</span>
            </div>
          )}
        </div>
      </div>

      {/* Popup Edit */}
      {editPopup && selectedRuangan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-2 z-50">
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm animate-fadeIn">
            <h2 className="text-[#4F959D] text-base sm:text-lg font-semibold mb-3 flex items-center">
              <FaDoorOpen className="mr-2" /> Edit Data Ruangan
            </h2>

            <form className="space-y-3">
              <div>
                <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                  Nama Ruangan
                </label>
                <input
                  type="text"
                  className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedRuangan.nama}
                  onChange={(e) =>
                    setSelectedRuangan({
                      ...selectedRuangan,
                      nama: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                  Kapasitas Ruangan
                </label>
                <input
                  type="number"
                  className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedRuangan.kapasitas}
                  onChange={(e) =>
                    setSelectedRuangan({
                      ...selectedRuangan,
                      kapasitas: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-3 py-1.5 text-xs sm:text-sm w-1/2 rounded-lg hover:bg-gray-400 transition"
                  onClick={handleCancelEdit}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="bg-[#4F959D] text-white px-3 py-1.5 text-xs sm:text-sm w-1/2 rounded-lg hover:bg-[#3C7A85] transition"
                  onClick={handleConfirmEdit}
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 max-w-md animate-fadeIn">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus ruangan ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaRuangan;
