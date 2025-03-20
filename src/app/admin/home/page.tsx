"use client";

import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { useDosenStore } from "../_store/dosen";
import { useRoomStore } from "../_store/ruangan";

type SummaryItem = {
  label: string;
  value: number;
};

type FileItem = {
  id: number;
  name: string;
  date: string;
  url: string;
};

const generatedFiles: FileItem[] = [
  {
    id: 1,
    name: "Jadwal_Kuliah_2025.xlsx",
    date: "2025-03-20",
    url: "/files/Jadwal_Kuliah_2025.xlsx",
  },
  {
    id: 2,
    name: "Jadwal_Kuliah_2024.xlsx",
    date: "2024-12-15",
    url: "/files/Jadwal_Kuliah_2024.xlsx",
  },
];

export default function Home() {
  const dosenList = useDosenStore((state) => state.data);
  const ruanganList = useRoomStore((state) => state.data);

  const summaryData: SummaryItem[] = [
    { label: "Jumlah Dosen", value: dosenList.length },
    { label: "Jumlah Ruangan", value: ruanganList.length },
    { label: "Jadwal yang Digenerate", value: 150 },
  ];

  return (
    <div className="bg-gray-100 p-4 min-h-screen">
      {/* Ringkasan */}
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">
        Beranda
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md text-center"
          >
            <h2 className="text-sm sm:text-lg font-semibold text-black">
              {item.label}
            </h2>
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-black">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabel File Generate */}
      <div className="mt-8 max-w-full md:max-w-5xl mx-auto bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-black text-center mb-4">
          File Generate
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-0 border-collapse border border-gray-300 text-xs sm:text-sm md:text-base">
            <thead className="bg-[#4F959D] text-white">
              <tr>
                <th className="border border-gray-300 px-2 sm:px-4 py-2">No</th>
                <th className="border border-gray-300 px-2 sm:px-6 py-2">
                  Nama File
                </th>
                <th className="border border-gray-300 px-2 sm:px-6 py-2">
                  Tanggal Generate
                </th>
                <th className="border border-gray-300 px-2 sm:px-6 py-2">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-black">
              {generatedFiles.length > 0 ? (
                generatedFiles.map((file, index) => (
                  <tr key={file.id} className="text-center hover:bg-gray-100">
                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-6 py-2">
                      {file.name}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-6 py-2">
                      {file.date}
                    </td>
                    <td className="border border-gray-300 px-2 sm:px-6 py-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block p-1 sm:p-2"
                      >
                        <FaFileAlt
                          className="text-black hover:text-gray-700 cursor-pointer"
                          size={14} /* Ukuran lebih kecil di layar kecil */
                        />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-gray-300 px-4 py-3 text-center text-gray-400"
                  >
                    Tidak ada file yang di-generate
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
