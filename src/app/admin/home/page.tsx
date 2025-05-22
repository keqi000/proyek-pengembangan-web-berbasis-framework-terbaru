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
  FaBell,
  FaInfoCircle,
  FaCog,
} from "react-icons/fa";
import { useDosenStore } from "../_store/dosen";
import { useRoomStore } from "../_store/ruangan";
import { useMataKuliahStore } from "../_store/matakuliah";
import { useGeneratedFileStore } from "../_store/generatedFiles";
import { useNotificationStore } from "../_store/notifications";
import { useJadwalStore } from "../_store/jadwal";
import {
  downloadGeneratedFile,
  deleteGeneratedFile,
  getGeneratedFileDetails,
} from "../../services/api";
import { motion } from "framer-motion";
import Link from "next/link";

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

  const {
    data: notifications,
    fetchData: fetchNotifications,
    markAsRead,
  } = useNotificationStore();

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
          fetchNotifications(),
        ]);
      } catch (err) {
        setError("Gagal memuat data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [
    fetchDosen,
    fetchRuangan,
    fetchMataKuliah,
    fetchGeneratedFiles,
    fetchNotifications,
  ]);

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
      label: "Jadwal Digenerate",
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

  // Function to handle notification click
  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // If it's a schedule notification, you could redirect to the schedule page
    if (
      notification.type === "jadwal" &&
      notification.related_model === "schedule"
    ) {
      // You could use router.push('/admin/generate_schedule') here if needed
    }
  };

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

      {/* Notifikasi Terbaru */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6 sm:mb-8"
      >
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#4F959D]">
              <FaBell className="inline mr-2" /> Notifikasi Terbaru
            </h2>
            <Link
              href="/admin/notifications"
              className="text-sm text-[#4F959D] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-4">
            {notifications.slice(0, 5).map((notification) => {
              // Determine icon based on notification type
              let icon;
              let bgColor;

              switch (notification.type) {
                case "jadwal":
                  icon = <FaCalendarAlt className="text-blue-500" />;
                  bgColor = "bg-blue-100";
                  break;
                case "peringatan":
                  icon = <FaExclamationTriangle className="text-yellow-500" />;
                  bgColor = "bg-yellow-100";
                  break;
                case "sistem":
                  icon = <FaCog className="text-purple-500" />;
                  bgColor = "bg-purple-100";
                  break;
                case "info":
                  icon = <FaInfoCircle className="text-green-500" />;
                  bgColor = "bg-green-100";
                  break;
                default:
                  icon = <FaBell className="text-gray-500" />;
                  bgColor = "bg-gray-100";
              }

              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${
                    !notification.read ? "bg-blue-50" : "bg-gray-50"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${bgColor} mr-3 mt-1`}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <Link
                            href={`/admin/notifications`}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Tandai Dibaca
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {notifications.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <FaBell className="mx-auto text-2xl mb-2 text-gray-400" />
                <p>Tidak ada notifikasi</p>
              </div>
            )}
          </div>
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
                  {generatedFiles[0].date}
                </p>
              </div>
            </div>
          )}

          {mataKuliahList.length > 0 && (
            <div className="flex items-center p-2 sm:p-3 bg-blue-50 rounded-md mb-2 sm:mb-3 border-l-4 border-blue-500">
              <FaFileAlt className="text-blue-500 mr-2 sm:mr-3 text-sm sm:text-base" />
              <div>
                <p className="font-medium text-sm sm:text-base">
                  {mataKuliahList.length} mata kuliah telah ditambahkan
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Terakhir: {mataKuliahList[0]?.nama || "Tidak ada data"}
                </p>
              </div>
            </div>
          )}

          {dosenList.length > 0 && (
            <div className="flex items-center p-2 sm:p-3 bg-purple-50 rounded-md mb-2 sm:mb-3 border-l-4 border-purple-500">
              <FaUserTie className="text-purple-500 mr-2 sm:mr-3 text-sm sm:text-base" />
              <div>
                <p className="font-medium text-sm sm:text-base">
                  {dosenList.length} dosen telah terdaftar
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Terakhir: {dosenList[0]?.nama || "Tidak ada data"}
                </p>
              </div>
            </div>
          )}

          {ruanganList.length > 0 && (
            <div className="flex items-center p-2 sm:p-3 bg-amber-50 rounded-md border-l-4 border-amber-500">
              <FaDoorOpen className="text-amber-500 mr-2 sm:mr-3 text-sm sm:text-base" />
              <div>
                <p className="font-medium text-sm sm:text-base">
                  {ruanganList.length} ruangan telah ditambahkan
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Terakhir: {ruanganList[0]?.nama || "Tidak ada data"}
                </p>
              </div>
            </div>
          )}

          {dosenList.length === 0 &&
            mataKuliahList.length === 0 &&
            ruanganList.length === 0 &&
            generatedFiles.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>Belum ada aktivitas terbaru</p>
              </div>
            )}
        </div>
      </motion.div>

      {/* File Jadwal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#2C3930]">
              <FaFileAlt className="inline mr-2 text-[#4F959D]" /> File Jadwal
              Digenerate
            </h2>
            <div className="flex space-x-2">
              <button
                className={`px-2 py-1 text-xs sm:text-sm rounded-md ${
                  activeTab === "recent"
                    ? "bg-[#4F959D] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setActiveTab("recent")}
              >
                Terbaru
              </button>
              <button
                className={`px-2 py-1 text-xs sm:text-sm rounded-md ${
                  activeTab === "all"
                    ? "bg-[#4F959D] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setActiveTab("all")}
              >
                Semua
              </button>
            </div>
          </div>

          {filteredFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nama File
                    </th>
                    <th
                      scope="col"
                      className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tanggal
                    </th>
                    <th
                      scope="col"
                      className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ukuran
                    </th>
                    <th
                      scope="col"
                      className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-2 sm:px-3 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaFileAlt className="text-[#4F959D] mr-2" />
                          <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-[200px]">
                            {file.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {file.date}
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {file.size}
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            file.status === "success"
                              ? "bg-green-100 text-green-800"
                              : file.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {file.status === "success"
                            ? "Berhasil"
                            : file.status === "pending"
                            ? "Diproses"
                            : "Gagal"}
                        </span>
                      </td>
                      <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewFile(file.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Lihat Detail"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDownloadFile(file.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Download"
                          >
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(file.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <FaFileAlt className="mx-auto text-2xl mb-2 text-gray-400" />
              <p>Belum ada file jadwal yang digenerate</p>
              <Link
                href="/admin/generate_schedule"
                className="mt-2 inline-block text-[#4F959D] hover:underline"
              >
                Generate Jadwal Sekarang
              </Link>
            </div>
          )}

          {activeTab === "recent" && generatedFiles.length > 5 && (
            <div className="mt-3 text-center">
              <button
                onClick={() => setActiveTab("all")}
                className="text-[#4F959D] hover:underline text-sm"
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[#2C3930]">
                  Detail File
                </h3>
                <button
                  onClick={() => setFileDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaFileAlt className="text-[#4F959D] mr-3" size={20} />
                  <p className="font-medium">{selectedFile.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Tanggal</p>
                    <p>{selectedFile.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Ukuran</p>
                    <p>{`${(selectedFile.size / 1024).toFixed(2)} KB`}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedFile.status === "success"
                          ? "bg-green-100 text-green-800"
                          : selectedFile.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedFile.status === "success"
                        ? "Berhasil"
                        : selectedFile.status === "pending"
                        ? "Diproses"
                        : "Gagal"}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">Tipe</p>
                    <p>{selectedFile.type}</p>
                  </div>
                </div>
                {selectedFile.description && (
                  <div>
                    <p className="text-gray-500">Deskripsi</p>
                    <p className="text-sm">{selectedFile.description}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-100 px-6 py-3 rounded-b-lg flex justify-end space-x-2">
              <button
                onClick={() => handleDownloadFile(selectedFile.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <FaDownload className="inline mr-2" /> Download
              </button>
              <button
                onClick={() => {
                  setFileDetailModal(false);
                  handleDeleteClick(selectedFile.id);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <FaTrash className="inline mr-2" /> Hapus
              </button>
              <button
                onClick={() => setFileDetailModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Tutup
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
}
