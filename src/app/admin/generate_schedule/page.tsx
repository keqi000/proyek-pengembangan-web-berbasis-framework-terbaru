"use client";

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

// Tipe Data
type DosenItem = {
  nama: string;
  mata_kuliah: string;
  nama_ruangan: string;
};

type RuanganItem = {
  nama_ruangan: string;
};

type JadwalItem = {
  id: number;
  namaDosen: string;
  mataKuliah: string;
  ruangan: string;
  waktu: string;
};

// Contoh Data Awal
const dosenData: DosenItem[] = [
  { nama: "Dosen A", mata_kuliah: "Matematika", nama_ruangan: "R101" },
  { nama: "Dosen B", mata_kuliah: "Fisika", nama_ruangan: "R102" },
];

const ruanganData: RuanganItem[] = [
  { nama_ruangan: "R101" },
  { nama_ruangan: "R102" },
];

const GenerateJadwal = () => {
  const [dosenList, setDosenList] = useState(dosenData);
  const [ruanganList, setRuanganList] = useState(ruanganData);
  const [jadwal, setJadwal] = useState<JadwalItem[]>([]);

  // Fungsi untuk menghasilkan jadwal otomatis
  const generateSchedule = () => {
    if (dosenList.length === 0 || ruanganList.length === 0) {
      alert("Data dosen atau ruangan belum tersedia.");
      return;
    }

    const generatedJadwal = dosenList.map((dosen, index) => ({
      id: index + 1,
      namaDosen: dosen.nama,
      mataKuliah: dosen.mata_kuliah,
      ruangan: ruanganList[index % ruanganList.length].nama_ruangan,
      waktu: `${8 + (index % 5)}:00 - ${9 + (index % 5)}:00`, // Jadwal sementara
    }));

    setJadwal(generatedJadwal);
  };

  // Fungsi untuk menghapus jadwal
  const deleteJadwal = (id: number) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus jadwal ini?"
    );
    if (confirmDelete) {
      setJadwal(jadwal.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4">
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

      {/* Tabel Jadwal */}
      <div className="mt-8 w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Hasil Jadwal
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-[#4F959D] text-white">
              <tr>
                <th className="border border-gray-300 px-6 py-3 w-12">No</th>
                <th className="border border-gray-300 px-6 py-3">Nama Dosen</th>
                <th className="border border-gray-300 px-6 py-3">
                  Mata Kuliah
                </th>
                <th className="border border-gray-300 px-6 py-3">Ruangan</th>
                <th className="border border-gray-300 px-6 py-3">Waktu</th>
                <th className="border border-gray-300 px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {jadwal.length > 0 ? (
                jadwal.map((item, index) => (
                  <tr key={item.id} className="text-center hover:bg-gray-100">
                    <td className="border border-gray-300 px-6 py-3">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-6 py-3">
                      {item.namaDosen}
                    </td>
                    <td className="border border-gray-300 px-6 py-3">
                      {item.mataKuliah}
                    </td>
                    <td className="border border-gray-300 px-6 py-3">
                      {item.ruangan}
                    </td>
                    <td className="border border-gray-300 px-6 py-3">
                      {item.waktu}
                    </td>
                    <td className="border border-gray-300 px-6 py-3">
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
                    className="border border-gray-300 px-6 py-3 text-center text-gray-400"
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
