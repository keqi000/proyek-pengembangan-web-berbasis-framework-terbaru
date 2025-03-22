"use client";

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useDosenStore } from "../_store/dosen";
import { useRoomStore } from "../_store/ruangan";

type JadwalItem = {
  id: number;
  namaDosen: string;
  mataKuliah: string;
  ruangan: string;
  waktu: string;
};

const GenerateJadwal = () => {
  const dosenList = useDosenStore((state) => state.data);
  const ruanganList = useRoomStore((state) => state.data);
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);

  const generateSchedule = () => {
    if (dosenList.length === 0 || ruanganList.length === 0) {
      alert("Data dosen atau ruangan belum tersedia.");
      return;
    }

    const generatedJadwal = dosenList.map((dosen, index) => ({
      id: index + 1,
      namaDosen: dosen.nama,
      mataKuliah: dosen.mata_kuliah,
      ruangan: ruanganList[index % ruanganList.length].nama,
      waktu: `${8 + (index % 5)}:00 - ${9 + (index % 5)}:00`,
    }));

    setJadwal(generatedJadwal);
  };

  const deleteJadwal = (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      setJadwal(jadwal.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 max-w-full overflow-hidden">
      {/* Card Generate Jadwal */}
      <div className="w-full max-w-full sm:max-w-screen-lg mx-auto bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Generate Jadwal
        </h2>
        <button
          onClick={generateSchedule}
          className="bg-[#4F959D] text-white px-4 py-2 w-full rounded-lg hover:bg-[#3C7A85] transition duration-300 ease-in-out"
        >
          Buat Jadwal
        </button>
      </div>

      {/* Tabel Jadwal */}
      <div className="mt-6 w-full max-w-full sm:max-w-screen-md md:max-w-screen-lg mx-auto bg-white p-2 sm:p-3 md:p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Hasil Jadwal
        </h2>

        {/* Improved overflow handling */}
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm md:text-base">
            <thead className="bg-[#4F959D] text-white">
              <tr>
                <th className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                  No
                </th>
                <th className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                  Nama Dosen
                </th>
                <th className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                  Mata Kuliah
                </th>
                <th className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                  Ruangan
                </th>
                <th className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                  Waktu
                </th>
                <th className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-black">
              {jadwal.length > 0 ? (
                jadwal.map((item, index) => (
                  <tr
                    key={item.id}
                    className="text-center hover:bg-gray-100 transition duration-200 ease-in-out"
                  >
                    <td className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm truncate max-w-[60px] sm:max-w-none">
                      {item.namaDosen}
                    </td>
                    <td className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm truncate max-w-[60px] sm:max-w-none">
                      {item.mataKuliah}
                    </td>
                    <td className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm truncate max-w-[60px] sm:max-w-none">
                      {item.ruangan}
                    </td>
                    <td className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                      {item.waktu}
                    </td>
                    <td className="border border-gray-300 px-1 sm:px-2 md:px-3 py-1 sm:py-2 text-xs sm:text-sm">
                      <button
                        className="text-black hover:text-gray-700 transition duration-200"
                        onClick={() => deleteJadwal(item.id)}
                      >
                        <FaTrash size={12} className="mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-gray-300 px-2 sm:px-4 py-2 text-center text-gray-400 text-xs sm:text-sm"
                  >
                    Belum ada jadwal dibuat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GenerateJadwal;
