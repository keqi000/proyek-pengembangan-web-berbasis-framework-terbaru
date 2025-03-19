"use client";

import React, { useState } from "react";
import { useRoomStore } from "../_store/ruangan";

type TempRuanganInfo = {
  nama: string;
  kapasitas: string;
}

const KelolaRuangan = () => {
  const ruanganList = useRoomStore((state) => state.data)
  const addRuangan = useRoomStore((state) => state.addData)
  // const setRuanganList = useRoomStore((state) => state.setData)
  const [tempRuanganInfo, setTempRuanganInfo] = useState<TempRuanganInfo>({
    nama: "", 
    kapasitas: "0"}
  )

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
              onChange={(event) => setTempRuanganInfo({...tempRuanganInfo, 'nama': event.target.value})}
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
              onChange={(event) => setTempRuanganInfo({...tempRuanganInfo, 'kapasitas': event.target.value})}
            />
          </div>
          <button
            // type="submit"
            className="bg-[#4F959D] text-white px-4 py-2 w-full rounded-lg hover:bg-[#3C7A85] transition"
            onClick={() => addRuangan({
              'nama': tempRuanganInfo.nama, 
              'kapasitas': tempRuanganInfo.kapasitas
            })}
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
              <tbody className="text-black">
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
                      colSpan={3}
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
