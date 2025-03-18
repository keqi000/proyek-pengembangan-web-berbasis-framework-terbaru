"use client";

import React, { useEffect, useState } from "react";
import { useDosenStore } from "../_store/dosen";

type TempInputData = {
  nama: string;
  mata_kuliah: string;
}

const KelolaDosen = () => {
  // const [dosenList, setDosenList] = useState([]);
  const dosenList = useDosenStore((state) => state.data)
  const setDosenList = useDosenStore((state) => state.setData)
  const [tempInput, setTempInput] = useState<TempInputData>({
    nama: "",
    mata_kuliah: ""
  })

  const addDosen = useDosenStore((state) => state.addData)

  // Fungsi untuk mengambil data dosen dari database (API)
  useEffect(() => {
    fetch("http://localhost:5000/api/dosen") // Sesuaikan dengan URL API backend
      .then((response) => response.json())
      .then((data) => setDosenList(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


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
              onChange={(event) => setTempInput({
                nama: event.target.value, 
                mata_kuliah: tempInput?.mata_kuliah ?? ""
              })}
              value={tempInput.nama}
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
              value={tempInput.mata_kuliah}
              onChange={(event) => setTempInput({
                ...tempInput,
                mata_kuliah: event.target.value
              })}
            />
          </div>
          <button
            // type="submit"
            type="button"
            className="bg-[#4F959D] text-white px-4 py-2 w-full rounded-lg hover:bg-[#3C7A85] transition"
            onClick={() => {
              addDosen({
                id: (dosenList.length + 1).toString(),
                nama: tempInput.nama,
                mata_kuliah: tempInput.mata_kuliah
              })}
            }
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
              <tbody className="text-black">
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
                      colSpan="3"
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
