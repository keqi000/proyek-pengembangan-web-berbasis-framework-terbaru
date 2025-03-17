"use client";
import React, { useEffect, useState } from "react";

const KelolaRuangan = () => {
  const [ruanganList, setRuanganList] = useState([]);

  // Fungsi untuk mengambil data ruangan dari database (API)
  useEffect(() => {
    fetch("http://localhost:5000/api/ruangan") // Sesuaikan dengan URL API backend
      .then((response) => response.json())
      .then((data) => setRuanganList(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Form Tambah Ruangan */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Manajemen Data Ruangan
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-[#4F959D] font-medium">
              Nama Ruangan
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
              placeholder="Masukkan nama ruangan"
            />
          </div>
          <div>
            <label className="block text-[#4F959D] font-medium">
              Kapasitas Ruangan
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
              placeholder="Masukkan kapasitas ruangan"
            />
          </div>
          <button
            type="submit"
            className="bg-[#4F959D] text-white px-4 py-2 w-full rounded-lg hover:bg-[#3C7A85] transition"
          >
            Tambah Ruangan
          </button>
        </form>
      </div>

      {/* Tabel Data Ruangan */}
      <div className="mt-8 w-full bg-white p-6 rounded-lg shadow-md justify-center">
        <div className="w-full">
          <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
            Data Ruangan
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-[#4F959D] text-white">
                <tr>
                  <th className="border border-gray-300 px-6 py-3">No</th>
                  <th className="border border-gray-300 px-6 py-3">
                    Nama Ruangan
                  </th>
                  <th className="border border-gray-300 px-6 py-3">
                    Kapasitas Ruangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {ruanganList.length > 0 ? (
                  ruanganList.map((ruangan, index) => (
                    <tr
                      key={ruangan.id}
                      className="text-center hover:bg-gray-100"
                    >
                      <td className="border border-gray-300 px-6 py-3">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        {ruangan.nama}
                      </td>
                      <td className="border border-gray-300 px-6 py-3">
                        {ruangan.kapasitas}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="border border-gray-300 px-6 py-3 text-center text-gray-400"
                    >
                      Tidak ada data ruangan
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

export default KelolaRuangan;
