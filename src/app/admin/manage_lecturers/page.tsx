"use client";
import React, { useEffect, useState } from "react";

type DosenItem = {
  id: number;
  nama: string;
  mata_kuliah: string;
}

const KelolaDosen = () => {
  const [dosenList, setDosenList] = useState<DosenItem[]>([]);
  return (
    <div className="container mx-auto p-4">
      {/* Form Tambah Dosen */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Manajemen Data Dosen
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-[#4F959D] font-medium">
              Nama Dosen
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
              placeholder="Masukkan nama dosen"
            />
          </div>
          <div>
            <label className="block text-[#4F959D] font-medium">
              Mata Kuliah
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
              placeholder="Masukkan mata kuliah"
            />
          </div>
          <button
            type="submit"
            className="bg-[#4F959D] text-white px-4 py-2 w-full rounded-lg hover:bg-[#3C7A85] transition"
          >
            Tambah Dosen
          </button>
        </form>
      </div>

      {/* Tabel Data Dosen */}
      <div className="mt-8 w-full  bg-white p-6 rounded-lg shadow-md justify-center">
        <div className="w-full">
          <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
            Data Dosen
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-[#4F959D] text-white">
                <tr>
                  <th className="border border-gray-300 px-6 py-3">No</th>
                  <th className="border border-gray-300 px-6 py-3">
                    Nama Dosen
                  </th>
                  <th className="border border-gray-300 px-6 py-3">
                    Mata Kuliah
                  </th>
                </tr>
              </thead>
              <tbody>
                {dosenList.length > 0 ? (
                  dosenList.map((dosen, index) => (
                    <tr
                      key={dosen.id}
                      className="text-center hover:bg-gray-100"
                    >
                      <td className="border border-gray-300 px-6 py-3">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        {dosen.nama}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        {dosen.mata_kuliah}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="border border-gray-300 px-6 py-3 text-center text-gray-400"
                    >
                      Tidak ada data dosen
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaDosen;
