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
import {
  downloadGeneratedFile,
  GeneratedFileDetailsResponseType,
  getGeneratedFileDetails,
} from "../../services/generatedFile";

import { motion } from "framer-motion";
import Link from "next/link";
import { NotificationItem } from "@/app/services/notification";

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
  const [, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [fileDetailModal, setFileDetailModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] =
    useState<GeneratedFileDetailsResponseType | null>(null);
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
  const handleNotificationClick = (notification: NotificationItem) => {
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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-gray-100 p-2 sm:p-3 md:p-4 min-h-screen font-poppins">
      {/* Header Section */}
      <div className="mb-3 sm:mb-5 md:mb-6 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#2C3930] text-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg"
        >
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
            Selamat Datang, Admin
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-1 sm:mt-2 font-poppins">
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
        className="mb-3 sm:mb-5 md:mb-6 lg:mb-8"
      >
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-[#2C3930] border-b-2 border-[#2C3930] pb-1 sm:pb-2">
          Ringkasan Sistem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {summaryData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className={`${item.color} border p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-1 sm:mb-2 md:mb-3">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                  {item.label}
                </h2>
                <div className="text-sm sm:text-base md:text-lg lg:text-xl">
                  {item.icon}
                </div>
              </div>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#2C3930]">
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
        className="mb-3 sm:mb-5 md:mb-6 lg:mb-8"
      >
        <div className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#4F959D]">
              <FaBell className="inline mr-1 sm:mr-2 text-sm sm:text-base md:text-lg" />{" "}
              Notifikasi Terbaru
            </h2>
            <Link
              href="/admin/notifications"
              className="text-xs sm:text-sm text-[#4F959D] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {notifications.slice(0, 6).map((notification, index) => {
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
                  className={`p-2 sm:p-3 rounded-lg ${
                    !notification.read ? "bg-blue-50" : "bg-gray-50"
                  } hover:shadow-md transition-shadow duration-200`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-1 sm:p-2 rounded-full ${bgColor} mr-2 sm:mr-3 mt-1 flex-shrink-0`}
                    >
                      <span className="text-xs sm:text-sm md:text-base">
                        {icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-800 truncate">
                        {notification.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center mt-1 sm:mt-2">
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <Link
                            href={`/admin/notifications`}
                            className="text-[10px] sm:text-xs text-blue-600 hover:underline"
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
              <div className="text-center py-3 sm:py-4 text-gray-500 col-span-2">
                <FaBell className="mx-auto text-xl sm:text-2xl mb-1 sm:mb-2 text-gray-400" />
                <p className="text-xs sm:text-sm md:text-base">
                  Tidak ada notifikasi
                </p>
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
        className="mb-3 sm:mb-5 md:mb-6 lg:mb-8"
      >
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-[#2C3930] border-b-2 border-[#2C3930] pb-1 sm:pb-2">
          Aktivitas Terbaru
        </h2>

        <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {generatedFiles.length > 0 && (
              <div className="flex items-center p-1.5 sm:p-2 md:p-3 bg-green-50 rounded-md border-l-4 border-green-500">
                <FaCalendarAlt className="text-green-500 mr-1.5 sm:mr-2 md:mr-3 text-xs sm:text-sm md:text-base" />
                <div>
                  <p className="font-medium text-xs sm:text-sm md:text-base">
                    {generatedFiles[0].name} berhasil digenerate
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                    {generatedFiles[0].date}
                  </p>
                </div>
              </div>
            )}

            {mataKuliahList.length > 0 && (
              <div className="flex items-center p-1.5 sm:p-2 md:p-3 bg-blue-50 rounded-md border-l-4 border-blue-500">
                <FaFileAlt className="text-blue-500 mr-1.5 sm:mr-2 md:mr-3 text-xs sm:text-sm md:text-base" />
                <div>
                  <p className="font-medium text-xs sm:text-sm md:text-base">
                    {mataKuliahList.length} mata kuliah telah ditambahkan
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                    Terakhir: {mataKuliahList[0]?.nama || "Tidak ada data"}
                  </p>
                </div>
              </div>
            )}

            {dosenList.length > 0 && (
              <div className="flex items-center p-1.5 sm:p-2 md:p-3 bg-purple-50 rounded-md border-l-4 border-purple-500">
                <FaUserTie className="text-purple-500 mr-1.5 sm:mr-2 md:mr-3 text-xs sm:text-sm md:text-base" />
                <div>
                  <p className="font-medium text-xs sm:text-sm md:text-base">
                    {dosenList.length} dosen telah terdaftar
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                    Terakhir: {dosenList[0]?.nama || "Tidak ada data"}
                  </p>
                </div>
              </div>
            )}

            {ruanganList.length > 0 && (
              <div className="flex items-center p-1.5 sm:p-2 md:p-3 bg-amber-50 rounded-md border-l-4 border-amber-500">
                <FaDoorOpen className="text-amber-500 mr-1.5 sm:mr-2 md:mr-3 text-xs sm:text-sm md:text-base" />
                <div>
                  <p className="font-medium text-xs sm:text-sm md:text-base">
                    {ruanganList.length} ruangan telah ditambahkan
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                    Terakhir: {ruanganList[0]?.nama || "Tidak ada data"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {dosenList.length === 0 &&
            mataKuliahList.length === 0 &&
            ruanganList.length === 0 &&
            generatedFiles.length === 0 && (
              <div className="text-center py-3 sm:py-4 text-gray-500">
                <p className="text-xs sm:text-sm md:text-base">
                  Belum ada aktivitas terbaru
                </p>
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
        <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#2C3930]">
              <FaFileAlt className="inline mr-1 sm:mr-2 text-[#4F959D] text-xs sm:text-sm md:text-base" />{" "}
              File Jadwal Digenerate
            </h2>
            {isMounted && (
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs md:text-sm rounded-md ${
                    activeTab === "recent"
                      ? "bg-[#4F959D] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveTab("recent")}
                  suppressHydrationWarning
                >
                  Terbaru
                </button>
                <button
                  className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs md:text-sm rounded-md ${
                    activeTab === "all"
                      ? "bg-[#4F959D] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveTab("all")}
                  suppressHydrationWarning
                >
                  Semua
                </button>
              </div>
            )}
          </div>

          {filteredFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider w-[30%] sm:w-[35%] md:w-[40%]"
                    >
                      Nama File
                    </th>
                    <th
                      scope="col"
                      className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider w-[20%] sm:w-[20%] md:w-[20%]"
                    >
                      Tanggal
                    </th>
                    <th
                      scope="col"
                      className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider w-[15%] sm:w-[15%] md:w-[15%]"
                    >
                      Ukuran
                    </th>
                    <th
                      scope="col"
                      className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 text-left text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider w-[15%] sm:w-[15%] md:w-[15%]"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 text-right text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider w-[20%] sm:w-[15%] md:w-[10%]"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaFileAlt className="text-[#4F959D] mr-1 sm:mr-1.5 md:mr-2 text-[8px] xs:text-[9px] sm:text-xs md:text-sm" />
                          <div className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium text-gray-900 truncate max-w-[60px] xs:max-w-[70px] sm:max-w-[100px] md:max-w-[150px] lg:max-w-[200px]">
                            {file.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 whitespace-nowrap text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-500">
                        {file.date}
                      </td>
                      <td className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 whitespace-nowrap text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-500">
                        {file.size}
                      </td>
                      <td className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 whitespace-nowrap">
                        <span
                          className={`px-0.5 xs:px-1 sm:px-1.5 md:px-2 py-0.5 inline-flex text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs leading-4 sm:leading-5 font-semibold rounded-full ${
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
                      <td className="px-1 sm:px-1.5 md:px-2 lg:px-3 py-1 sm:py-1.5 md:py-2 lg:py-3 whitespace-nowrap text-right text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium">
                        <div className="flex justify-end space-x-0.5 xs:space-x-1 sm:space-x-1.5 md:space-x-2">
                          <button
                            onClick={() => handleViewFile(file.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Lihat Detail"
                          >
                            <FaEye className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm" />
                          </button>
                          <button
                            onClick={() => handleDownloadFile(file.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Download"
                          >
                            <FaDownload className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(file.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Hapus"
                          >
                            <FaTrash className="text-[8px] xs:text-[9px] sm:text-xs md:text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-3 sm:py-4 text-gray-500">
              <FaFileAlt className="mx-auto text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 text-gray-400" />
              <p className="text-xs sm:text-sm md:text-base">
                Belum ada file jadwal yang digenerate
              </p>
              <Link
                href="/admin/generate_schedule"
                className="mt-1 sm:mt-2 inline-block text-xs sm:text-sm text-[#4F959D] hover:underline"
              >
                Generate Jadwal Sekarang
              </Link>
            </div>
          )}

          {activeTab === "recent" && generatedFiles.length > 5 && (
            <div className="mt-2 sm:mt-3 text-center">
              <button
                onClick={() => setActiveTab("all")}
                className="text-[#4F959D] hover:underline text-xs sm:text-sm"
              >
                Lihat Semua File ({generatedFiles.length})
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* File Detail Modal */}
      {fileDetailModal && selectedFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-start mb-2 sm:mb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-[#2C3930]">
                  Detail File
                </h3>
                <button
                  onClick={() => setFileDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center">
                  <FaFileAlt className="text-[#4F959D] mr-2 sm:mr-3 text-sm sm:text-base md:text-lg" />
                  <p className="font-medium text-xs sm:text-sm md:text-base">
                    {selectedFile.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
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
                      className={`px-1 sm:px-2 py-0.5 inline-flex text-[10px] sm:text-xs leading-5 font-semibold rounded-full ${
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
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Deskripsi
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm">
                      {selectedFile.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-100 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-b-lg flex justify-end space-x-1 sm:space-x-2">
              <button
                onClick={() => handleDownloadFile(selectedFile.id)}
                className="bg-green-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg hover:bg-green-600 transition text-[10px] sm:text-xs md:text-sm"
              >
                <FaDownload className="inline mr-1 sm:mr-2" /> Download
              </button>
              <button
                onClick={() => {
                  setFileDetailModal(false);
                  handleDeleteClick(selectedFile.id);
                }}
                className="bg-red-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg hover:bg-red-600 transition text-[10px] sm:text-xs md:text-sm"
              >
                <FaTrash className="inline mr-1 sm:mr-2" /> Hapus
              </button>
              <button
                onClick={() => setFileDetailModal(false)}
                className="bg-gray-300 text-gray-700 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg hover:bg-gray-400 transition text-[10px] sm:text-xs md:text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 z-50">
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="text-center mb-2 sm:mb-4">
              <div className="mx-auto flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-red-100 mb-2 sm:mb-4">
                <FaExclamationTriangle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-red-600" />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus file ini? Tindakan ini tidak
                dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-center space-x-2 sm:space-x-3 mt-2 sm:mt-4">
              <button
                onClick={handleCancelDelete}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-[10px] sm:text-xs md:text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-[10px] sm:text-xs md:text-sm"
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
