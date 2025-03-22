import React from "react";

const courses = [
  {
    code: "IF302",
    name: "Pemrograman Web",
    sks: "3 SKS",
    lecturer: "Dr. Budi Santoso, M.Kom.",
    description:
      "Mata kuliah ini membahas dasar-dasar pengembangan aplikasi web modern.",
    prerequisite: "Harus lulus Algoritma dan Struktur Data",
    type: "Wajib",
  },
  {
    code: "IF305",
    name: "Kecerdasan Buatan",
    sks: "3 SKS",
    lecturer: "Prof. Andi Wijaya, Ph.D.",
    description:
      "Mata kuliah ini mengenalkan konsep kecerdasan buatan dan aplikasinya.",
    prerequisite: "Harus lulus Pemrograman Berorientasi Objek",
    type: "Wajib",
  },
  {
    code: "IF308",
    name: "Keamanan Jaringan",
    sks: "2 SKS",
    lecturer: "Dr. Siti Aminah, M.T.",
    description:
      "Mata kuliah ini membahas dasar-dasar keamanan jaringan komputer.",
    prerequisite: "Harus lulus Sistem Operasi",
    type: "Pilihan",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-poppins">
      {/* Status KRS */}
      <div className="max-w-4xl mx-auto">
        <div className="rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden w-full bg-white font-poppins text-sm">
          {/* Bagian Header Merah */}
          <div className="bg-[#2C3930] text-white py-3 text-center">
            <h3 className="font-bold">PERKULIAHAN ANDA</h3>
          </div>

          {/* Bagian Konten */}
          <div className="p-4 text-black space-y-4">
            <p className="text-sm">
              Saat ini Anda sedang menempuh semester{" "}
              <strong>6 T.A 2024/2025</strong> Genap
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <p className="font-bold">MASA STUDI :</p>
                <strong>6 Semester</strong>
              </div>

              <div className="flex gap-2">
                <p className="font-bold">SISA MASA STUDI MAKS :</p>
                <strong>8 Semester</strong>
              </div>

              <div className="flex gap-2">
                <p className="font-bold">STATUS PDDIKTI :</p>
                <strong>AKTIF</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-md mt-4 text-center font-semibold">
          ✅ Mata kuliah sudah disetujui oleh Admin
        </div>

        {/* Daftar Mata Kuliah */}
        <h3 className="mt-6 text-lg font-semibold font-poppins text-gray-700">
          Mata Kuliah Dikontak
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500"
            >
              <h4 className="text-md font-semibold text-gray-700">
                {course.code} - {course.sks}
              </h4>
              <h3 className="text-lg font-poppins font-bold text-gray-900">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Dosen:</strong> {course.lecturer}
              </p>
              <p className="text-sm text-gray-600 mt-2">{course.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                <strong>Syarat:</strong> {course.prerequisite}
              </p>
              <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                {course.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
