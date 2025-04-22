"use client";

import React, { useState, useEffect } from "react";
import { useDosenStore } from "../_store/dosen";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaUserTie,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { LecturerTempInputData } from "../_scheme/lecturers";
import {
  fetchDosen,
  createDosen,
  updateDosen,
  deleteDosen,
} from "../../services/api";

const KelolaDosen = () => {
  const dosenList = useDosenStore((state) => state.data);
  const setDosenList = useDosenStore((state) => state.setData);
  const addDosen = useDosenStore((state) => state.addData);
  const updateDosenStore = useDosenStore((state) => state.updateData);
  const deleteDosenStore = useDosenStore((state) => state.deleteData);

  const [tempInput, setTempInput] = useState<LecturerTempInputData>({
    nama: "",
    nip: "",
  });

  const [editPopup, setEditPopup] = useState(false);
  const [selectedDosen, setSelectedDosen] =
    useState<LecturerTempInputData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [dosenToDelete, setDosenToDelete] = useState<string | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const loadDosen = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDosen();
        setDosenList(data);
      } catch (err) {
        setError("Gagal memuat data dosen");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDosen();
  }, [setDosenList]);

  const handleSubmit = async () => {
    if (!tempInput.nama || !tempInput.nip) {
      alert("Harap isi semua field!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (tempInput.id) {
        // Update existing dosen
        const updatedData = await updateDosen(tempInput.id, {
          nama: tempInput.nama,
          nip: tempInput.nip,
        });

        // Update local state with API response
        updateDosenStore(updatedData.id, updatedData.nama, updatedData.nip);
      } else {
        // Create new dosen
        const newData = await createDosen({
          nama: tempInput.nama,
          nip: tempInput.nip,
        });

        // Add new data to local state
        addDosen({
          id: newData.id,
          nama: newData.nama,
          nip: newData.nip,
        });
      }

      setTempInput({ nama: "", nip: "" });
      setShowAddForm(false);
    } catch (err) {
      setError("Gagal menyimpan data dosen");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (dosen: LecturerTempInputData) => {
    setSelectedDosen(dosen);
    setEditPopup(true);
  };

  const handleConfirmEdit = async () => {
    if (selectedDosen !== null && selectedDosen.id) {
      if (!selectedDosen.nama || !selectedDosen.nip) {
        alert("Harap isi semua field!");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Update via API
        const updatedData = await updateDosen(selectedDosen.id, {
          nama: selectedDosen.nama,
          nip: selectedDosen.nip,
        });

        // Update local state
        updateDosenStore(selectedDosen.id, updatedData.nama, updatedData.nip);
        setEditPopup(false);
      } catch (err) {
        setError("Gagal memperbarui data dosen");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditPopup(false);
  };

  const handleDeleteClick = (id: string) => {
    setDosenToDelete(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (dosenToDelete) {
      setIsLoading(true);
      setError(null);

      try {
        // Delete via API
        await deleteDosen(dosenToDelete);

        // Update local state
        deleteDosenStore(dosenToDelete);

        setDeleteModal(false);
        setDosenToDelete(null);
      } catch (err) {
        setError("Gagal menghapus data dosen");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setDosenToDelete(null);
  };

  const filteredDosen = dosenList.filter(
    (dosen) =>
      dosen.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dosen.nip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
        <FaSpinner className="animate-spin text-[#4F959D] text-xl" />
        <p className="text-gray-600">Memproses...</p>
      </div>
    </div>
  );

  // Error notification component
  const ErrorNotification = ({ message }: { message: string }) => (
    <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50">
      <div className="flex items-center">
        <FaExclamationTriangle className="mr-2" />
        <p>{message}</p>
      </div>
      <button
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={() => setError(null)}
      >
        &times;
      </button>
    </div>
  );

  return (
    <div className="container mx-auto p-4 bg-[#F2F2F2] ">
      {/* Loading indicator */}
      {isLoading && <LoadingIndicator />}

      {/* Error notification */}
      {error && <ErrorNotification message={error} />}

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
          <div className="flex flex-col md:flex-row w-full md:w-auto md:space-x-3 gap-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari dosen atau NIP..."
                className="pl-8 pr-2 py-1.5 md:pl-10 md:pr-4 md:py-2 border border-white rounded-lg focus:outline-none ring-1 ring-gray-400 focus:ring-1 focus:ring-[#4F959D] w-full md:w-64 text-gray-600 text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-2.5 top-2.5 md:left-3 md:top-3 text-gray-400 text-xs md:text-base" />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#4F959D] text-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-lg hover:bg-[#3C7A85] transition flex items-center justify-center"
              disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowAddForm(false)}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="button"
                className="bg-[#4F959D] text-white px-6 py-2 rounded-lg hover:bg-[#3C7A85] transition"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan"
                )}
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

        {isLoading && dosenList.length === 0 ? (
          <div className="py-8 text-center">
            <FaSpinner className="animate-spin mx-auto text-2xl text-[#4F959D] mb-2" />
            <p className="text-gray-500">Memuat data dosen...</p>
          </div>
        ) : (
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
                            disabled={isLoading}
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors"
                            onClick={() => handleDeleteClick(dosen.id)}
                            title="Hapus"
                            disabled={isLoading}
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
        )}

        {/* Table Footer with Stats */}
        <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
          <div>
            Total: <span className="font-medium">{filteredDosen.length}</span>{" "}
            dosen
          </div>
          {searchTerm && (
            <div>
              Hasil pencarian untuk:{" "}
              <span className="font-medium">&quot;{searchTerm}&quot;</span>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 w-1/2 rounded-lg hover:bg-gray-400 transition"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="bg-[#4F959D] text-white px-4 py-2 w-1/2 rounded-lg hover:bg-[#3C7A85] transition"
                  onClick={handleConfirmEdit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
                Apakah Anda yakin ingin menghapus dosen ini? Tindakan ini tidak
                dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Menghapus...
                  </span>
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaDosen;
