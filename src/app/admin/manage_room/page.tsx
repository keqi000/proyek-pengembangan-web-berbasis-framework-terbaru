"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

type RuanganItem = {
  id: string;
  nama: string;
  kapasitas: string;
};

const KelolaRuangan = () => {
  const [ruanganList, setRuanganList] = useState<RuanganItem[]>([]);
  const [tempInput, setTempInput] = useState<RuanganItem>({
    id: "",
    nama: "",
    kapasitas: "",
  });

  const [editPopup, setEditPopup] = useState(false);
  const [selectedRuangan, setSelectedRuangan] = useState<RuanganItem | null>(
    null
  );

  const handleSubmit = () => {
    if (tempInput.id) {
      setRuanganList(
        ruanganList.map((item) => (item.id === tempInput.id ? tempInput : item))
      );
    } else {
      setRuanganList([
        ...ruanganList,
        { id: (ruanganList.length + 1).toString(), ...tempInput },
      ]);
    }

    setTempInput({ id: "", nama: "", kapasitas: "" });
  };

  const handleEditClick = (ruangan: RuanganItem) => {
    setSelectedRuangan(ruangan);
    setEditPopup(true);
  };

  const handleConfirmEdit = () => {
    if (selectedRuangan?.id) {
      setRuanganList(
        ruanganList.map((item) =>
          item.id === selectedRuangan.id ? selectedRuangan : item
        )
      );
    }
    setEditPopup(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Form Tambah Ruangan */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Tambah Ruangan
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
              value={tempInput.nama}
              onChange={(e) =>
                setTempInput({ ...tempInput, nama: e.target.value })
              }
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
              value={tempInput.kapasitas}
              onChange={(e) =>
                setTempInput({ ...tempInput, kapasitas: e.target.value })
              }
            />
          </div>
          <button
            type="button"
            className="bg-[#4F959D] text-white px-4 py-2 w-full rounded-lg hover:bg-[#3C7A85] transition"
            onClick={handleSubmit}
          >
            Tambah Ruangan
          </button>
        </form>
      </div>

      {/* Tabel Data Ruangan */}
      <div className="mt-8 w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Data Ruangan
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-[#4F959D] text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-3 w-12">No</th>
                <th className="border border-gray-300 px-6 py-3">
                  Nama Ruangan
                </th>
                <th className="border border-gray-300 px-6 py-3">Kapasitas</th>
                <th className="border border-gray-300 px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {ruanganList.length > 0 ? (
                ruanganList.map((ruangan, index) => (
                  <tr
                    key={ruangan.id}
                    className="text-center hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 px-4 py-3">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-6 py-3">
                      {ruangan.nama}
                    </td>
                    <td className="border border-gray-300 px-6 py-3">
                      {ruangan.kapasitas}
                    </td>
                    <td className="border border-gray-300 px-6 py-3 flex justify-center gap-3">
                      <button
                        className="text-black hover:text-gray-700"
                        onClick={() => handleEditClick(ruangan)}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        className="text-black hover:text-gray-700"
                        onClick={() =>
                          setRuanganList(
                            ruanganList.filter((item) => item.id !== ruangan.id)
                          )
                        }
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
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

      {/* Popup Edit */}
      {editPopup && selectedRuangan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
              Edit Ruangan
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-[#4F959D] font-medium">
                  Nama Ruangan
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedRuangan.nama}
                  onChange={(e) =>
                    setSelectedRuangan({
                      ...selectedRuangan,
                      nama: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[#4F959D] font-medium">
                  Kapasitas
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedRuangan.kapasitas}
                  onChange={(e) =>
                    setSelectedRuangan({
                      ...selectedRuangan,
                      kapasitas: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-[#4F959D] text-white px-4 py-2 rounded-lg hover:bg-[#3C7A85]"
                  onClick={handleConfirmEdit}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  onClick={() => setEditPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaRuangan;
