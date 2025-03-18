"use client";
import React, { useEffect, useState } from "react";

const GenerateJadwal = () => {
  const [dosenList, setDosenList] = useState([]);
  const [ruanganList, setRuanganList] = useState([]);
  const [jadwal, setJadwal] = useState([]);

  // Fetch data dosen dan ruangan
  useEffect(() => {
    fetch("http://localhost:5000/api/dosen")
      .then((response) => response.json())
      .then((data) => setDosenList(data))
      .catch((error) => console.error("Error fetching dosen data:", error));

    fetch("http://localhost:5000/api/ruangan")
      .then((response) => response.json())
      .then((data) => setRuanganList(data))
      .catch((error) => console.error("Error fetching ruangan data:", error));
  }, []);

  // Fungsi untuk menghasilkan jadwal otomatis
  const generateSchedule = () => {
    if (dosenList.length === 0 || ruanganList.length === 0) {
      alert("Data dosen atau ruangan belum tersedia.");
      return;
    }

    const generatedJadwal = dosenList.map((dosen, index) => ({
      namaDosen: dosen.nama,
      mataKuliah: dosen.mata_kuliah,
      ruangan: ruanganList[index % ruanganList.length].nama_ruangan,
      waktu: `${8 + (index % 5)}:00 - ${9 + (index % 5)}:00`, // Jadwal sementara
    }));

    setJadwal(generatedJadwal);
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
      <div className="mt-8 w-full bg-white p-6 rounded-lg shadow-md justify-center">
        <h2 className="text-[#4F959D] text-lg font-semibold mb-4 text-center">
          Hasil Jadwal
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-[#4F959D] text-white">
              <tr>
                <th className="border border-gray-300 px-6 py-3">No</th>
                <th className="border border-gray-300 px-6 py-3">Nama Dosen</th>
                <th className="border border-gray-300 px-6 py-3">
                  Mata Kuliah
                </th>
                <th className="border border-gray-300 px-6 py-3">Ruangan</th>
                <th className="border border-gray-300 px-6 py-3">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {jadwal.length > 0 ? (
                jadwal.map((item, index) => (
                  <tr key={index} className="text-center hover:bg-gray-100">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="border border-gray-300 px-6 py-3 text-center"
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


