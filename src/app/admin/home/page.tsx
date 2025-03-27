"use client";

import React, { useState } from "react";
import {
  FaFileAlt,
  FaChartLine,
  FaUserTie,
  FaDoorOpen,
  FaCalendarAlt,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import { useDosenStore } from "../_store/dosen";
import { useRoomStore } from "../_store/ruangan";
import { motion } from "framer-motion";

type SummaryItem = {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
};

type FileItem = {
  id: number;
  name: string;
  date: string;
  url: string;
  size: string;
  status: "success" | "pending" | "failed";
};

const generatedFiles: FileItem[] = [
  {
    id: 1,
    name: "Jadwal_Kuliah_2025.xlsx",
    date: "2025-03-20",
    url: "/files/Jadwal_Kuliah_2025.xlsx",
    size: "2.4 MB",
    status: "success",
  },
  {
    id: 2,
    name: "Jadwal_Kuliah_2024.xlsx",
    date: "2024-12-15",
    url: "/files/Jadwal_Kuliah_2024.xlsx",
    size: "1.8 MB",
    status: "success",
  },
  {
    id: 3,
    name: "Jadwal_Kuliah_Semester_Genap_2024.xlsx",
    date: "2024-06-10",
    url: "/files/Jadwal_Kuliah_Semester_Genap_2024.xlsx",
    size: "2.1 MB",
    status: "success",
  },
];

export default function Home() {
  const dosenList = useDosenStore((state) => state.data);
  const ruanganList = useRoomStore((state) => state.data);
  const [activeTab, setActiveTab] = useState<"recent" | "all">("recent");

  const summaryData: SummaryItem[] = [
    {
      label: "Jumlah Dosen",
      value: dosenList.length || 24,
      icon: <FaUserTie className="text-blue-500" size={24} />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      label: "Jumlah Ruangan",
      value: ruanganList.length || 18,
      icon: <FaDoorOpen className="text-green-500" size={24} />,
      color: "bg-green-50 border-green-200",
    },
    {
      label: "Jadwal yang Digenerate",
      value: 150,
      icon: <FaCalendarAlt className="text-purple-500" size={24} />,
      color: "bg-purple-50 border-purple-200",
    },
    {
      label: "Total Mata Kuliah",
      value: 42,
      icon: <FaChartLine className="text-amber-500" size={24} />,
      color: "bg-amber-50 border-amber-200",
    },
  ];

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
          <p className="text-gray-200 text-sm sm:text-base">
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
          <div className="flex items-center p-2 sm:p-3 bg-green-50 rounded-md mb-2 sm:mb-3 border-l-4 border-green-500">
            <FaCalendarAlt className="text-green-500 mr-2 sm:mr-3 text-sm sm:text-base" />
            <div>
              <p className="font-medium text-sm sm:text-base">
                Jadwal Semester Genap 2025 berhasil digenerate
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Hari ini, 10:25
              </p>
            </div>
          </div>

          <div className="flex items-center p-2 sm:p-3 bg-blue-50 rounded-md mb-2 sm:mb-3 border-l-4 border-blue-500">
            <FaUserTie className="text-blue-500 mr-2 sm:mr-3 text-sm sm:text-base" />
            <div>
              <p className="font-medium text-sm sm:text-base">
                2 dosen baru ditambahkan ke sistem
              </p>
              <p className="text-xs sm:text-sm text-gray-500">Kemarin, 15:30</p>
            </div>
          </div>

          <div className="flex items-center p-2 sm:p-3 bg-amber-50 rounded-md border-l-4 border-amber-500">
            <FaDoorOpen className="text-amber-500 mr-2 sm:mr-3 text-sm sm:text-base" />
            <div>
              <p className="font-medium text-sm sm:text-base">
                Ruangan Lab Komputer 3 diperbarui
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                2 hari yang lalu, 09:15
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
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">
                    Status
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center rounded-tr-lg">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {generatedFiles.length > 0 ? (
                  generatedFiles.map((file, index) => (
                    <tr
                      key={file.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3">{index + 1}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium">
                        <div className="truncate max-w-[120px] sm:max-w-none">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {file.date}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        {file.date}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        {file.size}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <span
                          className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
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
                            ? "Menunggu"
                            : "Gagal"}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex justify-center space-x-1 sm:space-x-2">
                          <button
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Lihat"
                          >
                            <FaEye size={14} className="sm:w-4 sm:h-4" />
                          </button>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Unduh"
                          >
                            <FaDownload size={14} className="sm:w-4 sm:h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      Tidak ada file yang di-generate
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
              Menampilkan {generatedFiles.length} dari {generatedFiles.length}{" "}
              file
            </p>

            <button className="bg-[#2C3930] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-[#3F4F44] transition-colors flex items-center text-xs sm:text-sm">
              <FaFileAlt className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
              Generate Jadwal Baru
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
