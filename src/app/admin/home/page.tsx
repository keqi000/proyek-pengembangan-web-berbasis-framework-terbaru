"use client";

import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaChartLine,
  FaUserTie,
  FaDoorOpen,
  FaCalendarAlt,
  FaDownload,
  FaEye,
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useDosenStore } from "../_store/dosen";
import { useRoomStore } from "../_store/ruangan";
import { useMataKuliahStore } from "../_store/matakuliah";
import { useGeneratedFileStore } from "../_store/generatedFiles";
import {
  downloadGeneratedFile,
  deleteGeneratedFile,
  getGeneratedFileDetails,
} from "../../services/api";
import { motion } from "framer-motion";

type SummaryItem = {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
};

export default function Home() {
  const dosenList = useDosenStore((state) => state.data);
  const fetchDosen = useDosenStore((state) => state.fetchData);

  const ruanganList = useRoomStore((state) => state.data);
  const fetchRuangan = useRoomStore((state) => state.fetchData);

  const mataKuliahList = useMataKuliahStore((state) => state.data);
  const fetchMataKuliah = useMataKuliahStore((state) => state.fetchData);

  const generatedFiles = useGeneratedFileStore((state) => state.data);
  const fetchGeneratedFiles = useGeneratedFileStore((state) => state.fetchData);
  const deleteFile = useGeneratedFileStore((state) => state.deleteFile);

  const [activeTab, setActiveTab] = useState<"recent" | "all">("recent");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileDetailModal, setFileDetailModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  // Fetch all data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchDosen(),
          fetchRuangan(),
          fetchMataKuliah(),
          fetchGeneratedFiles(),
        ]);
      } catch (err) {
        setError("Gagal memuat data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchDosen, fetchRuangan, fetchMataKuliah, fetchGeneratedFiles]);

  const summaryData: SummaryItem[] = [
    {
      label: "Jumlah Dosen",
      value: dosenList.length || 0,
      icon: <FaUserTie className="text-blue-500" size={24} />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      label: "Jumlah Ruangan",
      value: ruanganList.length || 0,
      icon: <FaDoorOpen className="text-green-500" size={24} />,
      color: "bg-green-50 border-green-200",
    },
    {
      label: "Jadwal yang Digenerate",
      value: generatedFiles.length || 0,
      icon: <FaCalendarAlt className="text-purple-500" size={24} />,
      color: "bg-purple-50 border-purple-200",
    },
    {
      label: "Total Mata Kuliah",
      value: mataKuliahList.length || 0,
      icon: <FaChartLine className="text-amber-500" size={24} />,
      color: "bg-amber-50 border-amber-200",
    },
  ];

  const handleViewFile = async (id: string) => {
    setIsLoading(true);
    try {
      const fileDetails = await getGeneratedFileDetails(id);
      setSelectedFile(fileDetails);
      setFileDetailModal(true);
    } catch (err) {
      setError("Gagal memuat detail file");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadFile = (id: string) => {
    downloadGeneratedFile(id);
  };

  const handleDeleteClick = (id: string) => {
    setFileToDelete(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (fileToDelete) {
      setIsLoading(true);
      try {
        await deleteFile(fileToDelete);
        setDeleteModal(false);
        setFileToDelete(null);
      } catch (err) {
        setError("Gagal menghapus file");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setFileToDelete(null);
  };

  // Filter files based on active tab
  const filteredFiles =
    activeTab === "recent" ? generatedFiles.slice(0, 5) : generatedFiles;

  return (
    <div className="bg-gray-100 p-2 sm:p-4 min-h-screen font-poppins">
      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <FaSpinner className="animate-spin text-[#4F959D] text-xl" />
            <p className="text-gray-600">Memproses...</p>
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <p>{error}</p>
          </div>
          <button
            className="absolute top-1 right-1 text-red-500 hover:text-red-700"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-4 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#2C3930] text-white p-3 sm:p-6 rounded-lg shadow-lg"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
            Selamat Datang, Admin
          </h1>
          <p className="text-gray-200 mt-2 font-poppins">
            Kelola jadwal perkuliahan dengan mudah dan efisien melalui dashboard
            admin.
          </p>
        </motion.div>
      </div>

      {/* Ringkasan */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#2C3930] border-b-2 border-[#2C3930] pb-2">
          Ringkasan Sistem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {summaryData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className={`${item.color} border p-3 sm:p-5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                  {item.label}
                </h2>
                {item.icon}
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2C3930]">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Aktivitas Terbaru */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6 sm:mb-8"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#2C3930] border-b-2 border-[#2C3930] pb-2">
          Aktivitas Terbaru
        </h2>

        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md text-gray-600">
          {generatedFiles.length > 0 && (
            <div className="flex items-center p-2 sm:p-3 bg-green-50 rounded-md mb-2 sm:mb-3 border-l-4 border-green-500">
              <FaCalendarAlt className="text-green-500 mr-2 sm:mr-3 text-sm sm:text-base" />
              <div>
                <p className="font-medium text-sm sm:text-base">
                  {generatedFiles[0].name} berhasil digenerate
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {new Date(generatedFiles[0].date).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center p-2 sm:p-3 bg-blue-50 rounded-md mb-2 sm:mb-3 border-l-4 border-blue-500">
            <FaUserTie className="text-blue-500 mr-2 sm:mr-3 text-sm sm:text-base" />
            <div>
              <p className="font-medium text-sm sm:text-base">
                {dosenList.length} dosen tersedia dalam sistem
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>

          <div className="flex items-center p-2 sm:p-3 bg-amber-50 rounded-md border-l-4 border-amber-500">
            <FaDoorOpen className="text-amber-500 mr-2 sm:mr-3 text-sm sm:text-base" />
            <div>
              <p className="font-medium text-sm sm:text-base">
                {ruanganList.length} ruangan tersedia untuk penjadwalan
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabel File Generate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#2C3930] border-b-2 border-[#2C3930] pb-2 mb-2 sm:mb-0">
            File Jadwal yang Digenerate
          </h2>

          <div className="flex bg-gray-200 rounded-lg overflow-hidden self-start">
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${
                activeTab === "recent"
                  ? "bg-[#2C3930] text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab("recent")}
            >
              Terbaru
            </button>
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${
                activeTab === "all"
                  ? "bg-[#2C3930] text-white"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Semua
            </button>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="min-w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#2C3930] text-white">
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left rounded-tl-lg">
                    No
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                    Nama File
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left">
                    Tanggal Generate
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left">
                    Ukuran
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center rounded-tr-lg">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file, index) => (
                    <tr
                      key={file.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-black">
                        {index + 1}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-black">
                        <div className="flex items-center">
                          <FaFileAlt className="text-[#4F959D] mr-2" />
                          <span className="truncate max-w-[150px] sm:max-w-[200px]">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-black">
                        {new Date(file.date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-black">
                        {file.size}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewFile(file.id)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Lihat Detail"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleDownloadFile(file.id)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Download"
                          >
                            <FaDownload size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(file.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Hapus"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Belum ada file jadwal yang digenerate
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {activeTab === "recent" && generatedFiles.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setActiveTab("all")}
                className="text-[#4F959D] hover:text-[#3C7A85] text-sm font-medium"
              >
                Lihat Semua File ({generatedFiles.length})
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* File Detail Modal */}
      {fileDetailModal && selectedFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-[#2C3930] mb-4 flex items-center">
              <FaFileAlt className="text-[#4F959D] mr-2" />
              Detail File
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-700">Nama File</p>
                <p className="font-medium text-gray-500">{selectedFile.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-700">Tanggal Generate</p>
                <p className="font-medium text-gray-500">
                  {new Date(selectedFile.date).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-700">Ukuran File</p>
                <p className="font-medium text-gray-500">{selectedFile.size}</p>
              </div>

              {selectedFile.description && (
                <div>
                  <p className="text-sm text-gray-700">Deskripsi</p>
                  <p className="font-medium text-gray-500">
                    {selectedFile.description}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-700">Status</p>
                <p
                  className={`font-medium ${
                    selectedFile.status === "success"
                      ? "text-green-600"
                      : selectedFile.status === "pending"
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedFile.status === "success"
                    ? "Berhasil"
                    : selectedFile.status === "pending"
                    ? "Menunggu"
                    : "Gagal"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setFileDetailModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => handleDownloadFile(selectedFile.id)}
                className="px-4 py-2 bg-[#4F959D] text-white rounded-md hover:bg-[#3C7A85] transition-colors flex items-center"
              >
                <FaDownload className="mr-2" /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus file ini? Tindakan ini tidak
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
}
