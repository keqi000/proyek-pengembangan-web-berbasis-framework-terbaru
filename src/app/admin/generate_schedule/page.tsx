"use client";

import React, { useState } from "react";
import {
  FaTrash,
  FaCalendarAlt,
  FaRandom,
  FaSearch,
  FaFileExport,
  FaFilter,
} from "react-icons/fa";
import { useDosenStore } from "../_store/dosen";
import { useRoomStore } from "../_store/ruangan";

type JadwalItem = {
  id: number;
  namaDosen: string;
  mataKuliah: string;
  ruangan: string;
  waktu: string;
  hari: string;
};

const GenerateJadwal = () => {
  const dosenList = useDosenStore((state) => state.data);
  const ruanganList = useRoomStore((state) => state.data);
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
  const timeSlots = [
    "08:00 - 09:40",
    "09:50 - 11:30",
    "13:00 - 14:40",
    "14:50 - 16:30",
  ];

  const generateSchedule = () => {
    if (dosenList.length === 0 || ruanganList.length === 0) {
      alert("Data dosen atau ruangan belum tersedia.");
      return;
    }

    setIsGenerating(true);

    // Simulate loading
    setTimeout(() => {
      const generatedJadwal: JadwalItem[] = [];
      let id = 1;

      // More realistic schedule generation
      dosenList.forEach((dosen) => {
        // Randomly assign a day and time slot
        const randomDay = days[Math.floor(Math.random() * days.length)];
        const randomTimeSlot =
          timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const randomRoom =
          ruanganList[Math.floor(Math.random() * ruanganList.length)];

        generatedJadwal.push({
          id: id++,
          namaDosen: dosen.nama,
          mataKuliah: dosen.mata_kuliah,
          ruangan: randomRoom.nama,
          waktu: randomTimeSlot,
          hari: randomDay,
        });
      });

      setJadwal(generatedJadwal);
      setIsGenerating(false);
    }, 1500);
  };

  const deleteJadwal = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      setJadwal(jadwal.filter((item) => item.id !== id));
    }
  };

  const exportToCSV = () => {
    if (jadwal.length === 0) {
      alert("Tidak ada jadwal untuk diekspor.");
      return;
    }

    const headers = ["No", "Hari", "Waktu", "Mata Kuliah", "Dosen", "Ruangan"];
    const csvContent = [
      headers.join(","),
      ...jadwal.map((item, index) =>
        [
          index + 1,
          item.hari,
          item.waktu,
          item.mataKuliah,
          item.namaDosen,
          item.ruangan,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "jadwal_kuliah.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredJadwal = jadwal.filter((item) => {
    const matchesSearch =
      item.namaDosen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mataKuliah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ruangan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDay = filterDay ? item.hari === filterDay : true;

    return matchesSearch && matchesDay;
  });

  return (
    <div className="p-2 sm:p-4 bg-[#F2F2F2] min-h-screen">
      {/* Header Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2C3930]">
              Generate <span className="text-[#4F959D]">Jadwal</span>
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Buat jadwal perkuliahan secara otomatis
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center w-full md:w-auto">
            <button
              onClick={generateSchedule}
              disabled={isGenerating}
              className={`bg-[#4F959D] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#3C7A85] transition flex items-center text-sm sm:text-base ${
                isGenerating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <FaRandom className="mr-1 sm:mr-2" />
              {isGenerating ? "Generating..." : "Generate Jadwal"}
            </button>
            <button
              onClick={exportToCSV}
              disabled={jadwal.length === 0}
              className={`bg-[#2C3930] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#1A2420] transition flex items-center text-sm sm:text-base ${
                jadwal.length === 0 ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <FaFileExport className="mr-1 sm:mr-2" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      {jadwal.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Cari jadwal..."
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border rounded-lg focus:outline-none ring-1 ring-gray-500 focus:ring-1 focus:ring-[#4F959D] text-gray-600 w-full sm:w-64 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-2 sm:left-3 top-2.5 sm:top-3 text-gray-400 text-sm" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <FaFilter className="text-[#4F959D] text-sm" />
              <span className="text-gray-700 text-sm">Filter:</span>
              <select
                className="border rounded-lg px-2 sm:px-3 py-2 focus:outline-none ring-1 ring-gray-500 focus:ring-1 focus:ring-[#4F959D] text-gray-600 text-sm w-full sm:w-auto"
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
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
          <FaCalendarAlt className="mr-2" /> Hasil Jadwal
        </h2>

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#4F959D] mb-3 sm:mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">
              Sedang membuat jadwal...
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full border-collapse text-xs sm:text-sm md:text-base">
                  <thead>
                    <tr className="bg-[#F5F5F5]">
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-8 sm:w-12">
                        No
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-16 sm:w-24">
                        Hari
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                        Waktu
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                        Mata Kuliah
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                        Dosen
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D]">
                        Ruangan
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-10 sm:w-16">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {filteredJadwal.length > 0 ? (
                      filteredJadwal.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 border-b border-gray-200 transition-colors"
                        >
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            {index + 1}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium">
                            {item.hari}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            {item.waktu}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            {item.mataKuliah}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            {item.namaDosen}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            {item.ruangan}
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="flex justify-center">
                              <button
                                className="text-red-600 hover:text-red-800 transition-colors"
                                onClick={() => deleteJadwal(item.id)}
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
                          colSpan={7}
                          className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 bg-gray-50 text-xs sm:text-sm"
                        >
                          {jadwal.length > 0
                            ? "Tidak ada hasil yang sesuai dengan filter"
                            : "Belum ada jadwal dibuat. Klik tombol 'Generate Jadwal' untuk membuat jadwal baru."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Footer with Stats */}
            {jadwal.length > 0 && (
              <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  Total:{" "}
                  <span className="font-medium">{filteredJadwal.length}</span>{" "}
                  dari <span className="font-medium">{jadwal.length}</span>{" "}
                  jadwal
                </div>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  {filterDay && (
                    <span className="bg-[#E5F2F3] text-[#4F959D] px-2 py-1 rounded-full text-xs font-medium flex items-center">
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
                    <span className="bg-[#E5F2F3] text-[#4F959D] px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      Pencarian: "
                      {searchTerm.length > 10
                        ? searchTerm.substring(0, 10) + "..."
                        : searchTerm}
                      "
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
        <div className="bg-white p-3 sm:p-5 rounded-lg shadow-md">
          <h3 className="text-[#4F959D] text-sm sm:text-base font-semibold mb-2 flex items-center">
            <FaCalendarAlt className="mr-2" /> Statistik Jadwal
          </h3>
          <div className="text-gray-700 text-xs sm:text-sm">
            <p className="flex justify-between py-1 border-b">
              <span>Total Jadwal:</span>
              <span className="font-medium">{jadwal.length}</span>
            </p>
            <p className="flex justify-between py-1 border-b">
              <span>Total Dosen:</span>
              <span className="font-medium">{dosenList.length}</span>
            </p>
            <p className="flex justify-between py-1 border-b">
              <span>Total Ruangan:</span>
              <span className="font-medium">{ruanganList.length}</span>
            </p>
            <p className="flex justify-between py-1">
              <span>Mata Kuliah:</span>
              <span className="font-medium">{dosenList.length}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-lg shadow-md">
          <h3 className="text-[#4F959D] text-sm sm:text-base font-semibold mb-2 flex items-center">
            <FaCalendarAlt className="mr-2" /> Distribusi Hari
          </h3>
          {jadwal.length > 0 ? (
            <div className="text-gray-700 text-xs sm:text-sm">
              {days.map((day) => {
                const count = jadwal.filter((item) => item.hari === day).length;
                const percentage =
                  Math.round((count / jadwal.length) * 100) || 0;

                return (
                  <div key={day} className="mb-1.5 sm:mb-2">
                    <div className="flex justify-between text-xs sm:text-sm mb-0.5 sm:mb-1">
                      <span>{day}</span>
                      <span>
                        {count} jadwal ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-[#4F959D] h-1.5 sm:h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-xs sm:text-sm italic">
              Belum ada data jadwal
            </p>
          )}
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-lg shadow-md sm:col-span-2 lg:col-span-1">
          <h3 className="text-[#4F959D] text-sm sm:text-base font-semibold mb-2 flex items-center">
            <FaCalendarAlt className="mr-2" /> Panduan Penggunaan
          </h3>
          <ul className="text-gray-700 text-xs sm:text-sm space-y-1 sm:space-y-2">
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1 sm:mr-2">1.</span>
              <span>Pastikan data dosen dan ruangan sudah tersedia</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1 sm:mr-2">2.</span>
              <span>
                Klik tombol "Generate Jadwal" untuk membuat jadwal otomatis
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1 sm:mr-2">3.</span>
              <span>Gunakan filter untuk melihat jadwal berdasarkan hari</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1 sm:mr-2">4.</span>
              <span>Gunakan pencarian untuk menemukan jadwal spesifik</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#4F959D] mr-1 sm:mr-2">5.</span>
              <span>
                Klik "Export CSV" untuk mengunduh jadwal dalam format CSV
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GenerateJadwal;
