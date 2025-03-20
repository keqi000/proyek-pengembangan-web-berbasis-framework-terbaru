"use client";

import React, { useState } from "react";
import { useDosenStore } from "../_store/dosen";
import { FaEdit, FaTrash } from "react-icons/fa";

type TempInputData = {
  id?: string;
  nama: string;
  mata_kuliah: string;
};

const KelolaDosen = () => {
  const dosenList = useDosenStore((state) => state.data);
  const addDosen = useDosenStore((state) => state.addData);
  const updateDosen = useDosenStore((state) => state.updateData);
  const deleteDosen = useDosenStore((state) => state.deleteData);

  const [tempInput, setTempInput] = useState<TempInputData>({
    nama: "",
    mata_kuliah: "",
  });

  const [editPopup, setEditPopup] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState<TempInputData | null>(
    null
  );

  const handleSubmit = () => {
    if (tempInput.id) {
      updateDosen(tempInput.id, tempInput.nama, tempInput.mata_kuliah);
    } else {
      addDosen({
        id: (dosenList.length + 1).toString(),
        nama: tempInput.nama,
        mata_kuliah: tempInput.mata_kuliah,
      });
    }
    setTempInput({ nama: "", mata_kuliah: "" });
  };

  const handleEditClick = (dosen: TempInputData) => {
    setSelectedDosen(dosen);
    setEditPopup(true);
  };

  const handleConfirmEdit = () => {
    if (selectedDosen !== null && selectedDosen.id) {
      updateDosen(
        selectedDosen.id,
        selectedDosen.nama,
        selectedDosen.mata_kuliah
      );
    }
    setEditPopup(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Form Tambah Dosen */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Tambah Dosen
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
              value={tempInput.nama}
              onChange={(e) =>
                setTempInput({ ...tempInput, nama: e.target.value })
              }
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
              onChange={(e) =>
                setTempInput({ ...tempInput, mata_kuliah: e.target.value })
              }
            />
          </div>
          <button
            type="button"
            className="bg-[#4F959D] text-white px-4 py-2 w-full rounded-lg hover:bg-[#3C7A85] transition"
            onClick={handleSubmit}
          >
            Tambah Dosen
          </button>
        </form>
      </div>

      {/* Tabel Data Dosen */}
      <div className="mt-8 w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Data Dosen
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead className="bg-[#4F959D] text-white">
              <tr>
                <th className="border border-gray-300 px-2 md:px-4 py-3 w-12">
                  No
                </th>
                <th className="border border-gray-300 px-2 md:px-6 py-3">
                  Nama Dosen
                </th>
                <th className="border border-gray-300 px-2 md:px-6 py-3">
                  Mata Kuliah
                </th>
                <th className="border border-gray-300 px-2 md:px-6 py-3">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="text-black">
              {dosenList.length > 0 ? (
                dosenList.map((dosen, index) => (
                  <tr key={dosen.id} className="text-center hover:bg-gray-100">
                    <td className="border border-gray-300 px-2 md:px-4 py-3">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-2 md:px-6 py-3">
                      {dosen.nama}
                    </td>
                    <td className="border border-gray-300 px-2 md:px-6 py-3">
                      {dosen.mata_kuliah}
                    </td>
                    <td className="border border-gray-300 px-2 md:px-6 py-3 flex justify-center gap-3">
                      <button
                        className="text-black hover:text-gray-700"
                        onClick={() => handleEditClick(dosen)}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        className="text-black hover:text-gray-700"
                        onClick={() => deleteDosen(dosen.id)}
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
                    Tidak ada data dosen
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Edit */}
      {editPopup && selectedDosen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
              Edit Dosen
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-[#4F959D] font-medium">
                  Nama Dosen
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedDosen.nama}
                  onChange={(e) =>
                    setSelectedDosen({ ...selectedDosen, nama: e.target.value })
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

export default KelolaDosen;
