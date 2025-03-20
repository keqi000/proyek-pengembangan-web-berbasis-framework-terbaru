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
    <div className="container mx-auto p-4">
      {/* Card Generate Jadwal */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Generate Jadwal
        </h2>
        <button
          onClick={generateSchedule}
          className="bg-[#4F959D] text-white px-4 py-2 w-full rounded-lg hover:bg-[#3C7A85] transition"
        >
          Buat Jadwal
        </button>
      </div>

      {/* Tabel Jadwal (Responsive) */}
      <div className="mt-8 w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Hasil Jadwal
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead className="bg-[#4F959D] text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">No</th>
                <th className="border border-gray-300 px-4 py-2">Nama Dosen</th>
                <th className="border border-gray-300 px-4 py-2">
                  Mata Kuliah
                </th>
                <th className="border border-gray-300 px-4 py-2">Ruangan</th>
                <th className="border border-gray-300 px-4 py-2">Waktu</th>
                <th className="border border-gray-300 px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {jadwal.length > 0 ? (
                jadwal.map((item, index) => (
                  <tr key={item.id} className="text-center hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.namaDosen}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.mataKuliah}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.ruangan}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.waktu}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="text-black hover:text-gray-700"
                        onClick={() => deleteJadwal(item.id)}
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-gray-300 px-4 py-2 text-center text-gray-400"
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
