"use client";

import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaCalendarAlt,
  FaRandom,
  FaSearch,
  FaFileExport,
  FaFilter,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { useDosenStore } from "../_store/dosen";
import { useRoomStore } from "../_store/ruangan";
import { useMataKuliahStore } from "../_store/matakuliah";
import { useJadwalStore } from "../_store/jadwal";
import { useGeneratedFileStore } from "../_store/generatedFiles";
import { exportJadwalToCsv } from "../../services/schedule";

const GenerateJadwal = () => {
  const dosenList = useDosenStore((state) => state.data);
  const ruanganList = useRoomStore((state) => state.data);
  const mataKuliahList = useMataKuliahStore((state) => state.data);

  // Gunakan store jadwal
  const {
    data: jadwal,
    filteredData: filteredJadwal,
    loading: isGenerating,
    error,
    generateData,
    deleteData,
    filterByDay,
    searchData,
    fetchData,
  } = useJadwalStore();

  // Gunakan store generated files
  const { addFile } = useGeneratedFileStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [jadwalToDelete, setJadwalToDelete] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      // Load dosen, ruangan, and matakuliah data if not already loaded
      if (dosenList.length === 0) {
        await useDosenStore.getState().fetchData();
      }
      if (ruanganList.length === 0) {
        await useRoomStore.getState().fetchData();
      }
      if (mataKuliahList.length === 0) {
        await useMataKuliahStore.getState().fetchData();
      }

      // Load existing schedules
      await fetchData();
    };

    loadInitialData();
  }, [dosenList.length, ruanganList.length, mataKuliahList.length, fetchData]);

  // Handle search
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm) {
        searchData(searchTerm);
      } else {
        // If search is cleared, apply only day filter if it exists
        if (filterDay) {
          filterByDay(filterDay);
        } else {
          // If no filters, show all data
          useJadwalStore
            .getState()
            .setFilteredData(useJadwalStore.getState().data);
        }
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, filterDay, searchData, filterByDay]);

  // Handle day filter
  useEffect(() => {
    filterByDay(filterDay);
  }, [filterDay, filterByDay]);

  const generateSchedule = async () => {
    if (
      dosenList.length === 0 ||
      ruanganList.length === 0 ||
      mataKuliahList.length === 0
    ) {
      alert("Data dosen, ruangan, atau mata kuliah belum tersedia.");
      return;
    }

    try {
      // Panggil API untuk generate jadwal dan cast hasilnya ke tipe any
      await generateData(true);

      // Ambil data terbaru dari API
      await fetchData();

      // Tampilkan pesan sukses
      alert("Jadwal berhasil digenerate!");
    } catch (err) {
      console.error("Error generating schedule:", err);
      alert("Gagal generate jadwal. Silakan coba lagi.");
    }
  };

  const exportToCSV = async () => {
    if (jadwal.length === 0) {
      alert("Tidak ada jadwal untuk diekspor.");
      return;
    }

    setIsExporting(true);
    try {
      const response = await exportJadwalToCsv();

      // Jika API mengembalikan informasi file yang digenerate
      if (
        response &&
        typeof response === "object" &&
        "generated_file" in response
      ) {
        addFile(response.generated_file);
      }
    } catch (err) {
      console.error("Error exporting to CSV:", err);
      alert("Gagal mengekspor jadwal ke CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setJadwalToDelete(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (jadwalToDelete) {
      await deleteData(jadwalToDelete);
      setDeleteModal(false);
      setJadwalToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setJadwalToDelete(null);
  };

  // Error notification component
  const ErrorNotification = ({ message }: { message: string }) => (
    <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50">
      <div className="flex items-center">
        <FaExclamationTriangle className="mr-2" />
        <p>{message}</p>
      </div>
      <button
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={() => useJadwalStore.setState({ error: null })}
      >
        &times;
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-full p-1 sm:p-2 md:p-4 bg-[#F2F2F2]">
      {/* Error notification */}
      {error && <ErrorNotification message={error} />}

      {/* Header Section */}
      <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md mb-2 sm:mb-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-center md:text-left">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[#2C3930]">
              Generate <span className="text-[#4F959D]">Jadwal</span>
            </h1>
            <p className="text-gray-600 mt-0.5 text-xs sm:text-sm">
              Buat jadwal perkuliahan secara otomatis
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center w-full sm:w-auto">
            <button
              onClick={generateSchedule}
              disabled={isGenerating}
              className={`bg-[#4F959D] text-white px-2 py-1 md:px-3 md:py-2 text-xs md:text-base rounded-lg hover:bg-[#3C7A85] transition flex items-center justify-center ${
                isGenerating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin mr-1" />
                  Generating...
                </>
              ) : (
                <>
                  <FaRandom className="mr-1" />
                  Generate
                </>
              )}
            </button>
            <button
              onClick={exportToCSV}
              disabled={jadwal.length === 0 || isExporting}
              className={`bg-[#2C3930] text-white px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm rounded-lg hover:bg-[#1A2420] transition flex items-center justify-center ${
                jadwal.length === 0 || isExporting
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {isExporting ? (
                <>
                  <FaSpinner className="animate-spin mr-1" />
                  Exporting...
                </>
              ) : (
                <>
                  <FaFileExport className="mr-1" /> Export
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      {jadwal.length > 0 && (
        <div className="md:hidden bg-white p-2 md:p-3 lg:p-4 rounded-lg shadow-md mb-2 sm:mb-3">
          <div className="flex flex-col gap-2 items-start">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari jadwal..."
                className="pl-7 pr-2 py-1 text-xs border rounded-lg focus:outline-none ring-1 ring-gray-500 focus:ring-1 focus:ring-[#4F959D] text-gray-600 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-2 top-1.5 text-gray-400 text-xs" />
            </div>

            <div className="flex items-center gap-1 w-full md:hidden">
              <FaFilter className="text-[#4F959D] text-xs" />
              <span className="text-gray-700 text-xs">Filter:</span>
              <select
                className="border rounded-lg px-1 py-1 text-xs focus:outline-none ring-1 ring-gray-500 focus:ring-1 focus:ring-[#4F959D] text-gray-600 w-full"
                value={filterDay || ""}
                onChange={(e) => setFilterDay(e.target.value || null)}
              >
                <option value="">Semua Hari</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Jadwal Table */}
      <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
        <div className="flex flex-row justify-between">
          <h2 className="text-[#4F959D] text-sm md:text-base font-semibold mb-2 flex items-center">
            <FaCalendarAlt className="mr-1.5" /> Hasil Jadwal
          </h2>

          <div className="hidden md:flex flex-row items-center gap-x-3">
            {/* Search bar - md*/}
            <div className="flex flex-col md:flex-row w-full md:w-auto md:space-x-3 gap-y-2 items-start py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari jadwal..."
                  className="pl-8 pr-2 py-1.5 md:pl-10 md:pr-4 md:py-1 border border-white rounded-lg focus:outline-none ring-1 ring-gray-400 focus:ring-1 focus:ring-[#4F959D] w-full md:w-64 text-gray-600 text-xs md:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-2.5 top-2.5 md:left-3 md:top-2 text-gray-400 text-xs md:text-sm" />
              </div>
            </div>

            {/* Filter - md */}
            <div className="hidden md:flex flex-row items-center gap-x-2 py-2">
              <div className="flex flex-row gap-x-1">
                <span className="text-gray-700 text-xs">Filter:</span>
              </div>

              {/* Filter Option */}
              <div className="flex flex-col">
                <select
                  className="border rounded-lg px-1 py-1 md:px-2 text-xs md:text-sm focus:outline-none ring-1 ring-gray-500 focus:ring-1 focus:ring-[#4F959D] text-gray-600 w-full"
                  value={filterDay || ""}
                  onChange={(e) => setFilterDay(e.target.value || null)}
                >
                  <option value="">Semua Hari</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-4 sm:py-6">
            <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-t-2 border-b-2 border-[#4F959D] mb-2"></div>
            <p className="text-gray-600 text-xs">Sedang membuat jadwal...</p>
          </div>
        ) : (
          <>
            {filteredJadwal.length > 0 ? (
              <div className="w-full">
                <table className="w-full border-collapse text-[8px] md:text-sm">
                  <thead>
                    <tr className="bg-[#F5F5F5]">
                      <th className="p-1 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-4 md:w-6">
                        No
                      </th>
                      <th className="p-1 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-8 md:w-12">
                        Hari
                      </th>
                      <th className="p-1 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                        Jam
                      </th>
                      <th className="p-1 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                        MK
                      </th>
                      <th className="p-1 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                        Sem
                      </th>
                      <th className="p-1 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                        Dosen
                      </th>
                      <th className="p-1 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                        Ruang
                      </th>
                      <th className="p-1 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-5 md:w-8">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-[8px] md:text-sm">
                    {filteredJadwal.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                      >
                        <td className="p-1">{index + 1}</td>
                        <td className="p-1 font-medium">{item.hari}</td>
                        <td className="p-1">
                          {item.waktu.replace(" - ", "-")}
                        </td>
                        <td className="p-1 truncate max-w-[40px] xs:max-w-[60px] sm:max-w-[100px]">
                          {item.mataKuliah}
                        </td>
                        <td className="p-1">{item.semester}</td>
                        <td className="p-1 truncate max-w-[40px] xs:max-w-[60px] sm:max-w-[100px]">
                          {item.namaDosen}
                        </td>
                        <td className="p-1">{item.ruangan}</td>
                        <td className="p-1">
                          <div className="flex justify-center">
                            <button
                              className="text-red-600 hover:text-red-800 transition-colors"
                              onClick={() => handleDeleteClick(item.id)}
                              title="Hapus"
                              disabled={isGenerating}
                            >
                              <FaTrash className="h-2 w-2 md:h-3 md:w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-3 md:px-4 md:py-6 text-center text-gray-500 bg-gray-50 text-xs md:text-sm rounded-lg">
                {jadwal.length > 0
                  ? "Tidak ada hasil yang sesuai dengan filter"
                  : "Belum ada jadwal dibuat. Klik tombol 'Generate' untuk membuat jadwal baru."}
              </div>
            )}

            {/* Table Footer with Stats */}
            {jadwal.length > 0 && (
              <div className="mt-2 text-xs text-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                <div>
                  Total:{" "}
                  <span className="font-medium">{filteredJadwal.length}</span>{" "}
                  dari <span className="font-medium">{jadwal.length}</span>{" "}
                  jadwal
                </div>
                <div className="flex gap-1 flex-wrap">
                  {filterDay && (
                    <span className="bg-[#E5F2F3] text-[#4F959D] px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                      Hari: {filterDay}
                      <button
                        className="ml-1 text-[#4F959D] hover:text-[#3C7A85]"
                        onClick={() => setFilterDay(null)}
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="bg-[#E5F2F3] text-[#4F959D] px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                      Cari: &quot;
                      {searchTerm.length > 8
                        ? searchTerm.substring(0, 8) + "..."
                        : searchTerm}
                      &quot;
                      <button
                        className="ml-1 text-[#4F959D] hover:text-[#3C7A85]"
                        onClick={() => setSearchTerm("")}
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Cards - Made more responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 sm:mt-3">
        <div className="bg-white p-2 md:p-4 rounded-lg shadow-md">
          <h3 className="text-[#4F959D] text-xs md:text-base font-semibold mb-1 md:mb-2 flex items-center">
            <FaCalendarAlt className="mr-1" /> Statistik Jadwal
          </h3>
          <div className="flex flex-col text-gray-700 text-xs md:text-sm md:gap-y-1">
            <p className="flex justify-between py-0.5 border-b">
              <span>Total Jadwal:</span>
              <span className="font-medium">{jadwal.length}</span>
            </p>
            <p className="flex justify-between py-0.5 border-b">
              <span>Total Dosen:</span>
              <span className="font-medium">{dosenList.length}</span>
            </p>
            <p className="flex justify-between py-0.5 border-b">
              <span>Total Ruangan:</span>
              <span className="font-medium">{ruanganList.length}</span>
            </p>
            <p className="flex justify-between py-0.5">
              <span>Mata Kuliah:</span>
              <span className="font-medium">{mataKuliahList.length}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-2 md:p-3 rounded-lg shadow-md">
          <h3 className="text-[#4F959D] text-xs md:text-sm font-semibold mb-1 flex items-center">
            <FaCalendarAlt className="mr-1" /> Distribusi Hari
          </h3>
          {jadwal.length > 0 ? (
            <div className="flex flex-col text-gray-700 text-xs md:text-sm md:gap-y-2">
              {days.map((day) => {
                const count = jadwal.filter((item) => item.hari === day).length;
                const percentage =
                  Math.round((count / jadwal.length) * 100) || 0;

                return (
                  <div key={day} className="mb-1">
                    <div className="flex justify-between text-xs md:text-sm mb-0.5">
                      <span>{day}</span>
                      <span>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-[#4F959D] h-1 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-xs md:text-sm italic md:pt-2">
              Belum ada data jadwal
            </p>
          )}
        </div>

        <div className="bg-white p-2 md:p-3 rounded-lg shadow-md md:col-span-2 lg:col-span-1">
          <h3 className="text-[#4F959D] text-xs md:text-base font-semibold mb-1 flex items-center">
            <FaCalendarAlt className="mr-1" /> Panduan Penggunaan
          </h3>
          <ul className="flex flex-col text-gray-700 text-xs md:text-sm space-y-0.5 text-justify px-2 md:py-2 md:gap-y-2">
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1">1.</span>
              <span>
                Pastikan data dosen, ruangan, dan mata kuliah sudah tersedia
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1">2.</span>
              <span>
                Klik tombol &quot;Generate&quot; untuk membuat jadwal otomatis
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1">3.</span>
              <span>Gunakan filter untuk melihat jadwal berdasarkan hari</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1">4.</span>
              <span>Gunakan pencarian untuk menemukan jadwal spesifik</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1">5.</span>
              <span>
                Klik &quot;Export&quot; untuk mengunduh jadwal dalam format CSV
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak
                dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isGenerating}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={isGenerating}
              >
                {isGenerating ? (
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

export default GenerateJadwal;
