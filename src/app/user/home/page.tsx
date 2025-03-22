"use client";

import { Home, Calendar, Book, Printer } from "lucide-react"; // Import ikon dari Lucide
import { FC } from "react";
import Image from "next/image"; // Import Image dari Next.js
import HeroSlider from "../_component/HeroSlider";

const HomePage: FC = () => {
  return (
    <div>
      <HeroSlider />

      {/* SERVICES */}
      <div className="px-8 py-12 bg-[#DCD7C9]">
        {/* Judul Section */}
        <h2 className="text-3xl font-bold text-black">
          Student <span className="text-[#A27B5C]">Dashboard</span>
        </h2>
        <p className="text-gray-700 mt-2 font-poppins">
          A centralized platform for students to access essential academic
          information efficiently.
        </p>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Beranda */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-start">
            <Home className="w-12 h-12 mr-4 text-[#A27B5C]" />
            <div>
              <h3 className="text-2xl font-bold text-[#A27B5C] font-bebas">
                BERANDA
              </h3>
              <p className="text-gray-600 text-sm font-poppins">
                Halaman utama yang menampilkan informasi umum mahasiswa,
                termasuk nama, jurusan, semester, dan ringkasan jadwal kuliah.
              </p>
            </div>
          </div>

          {/* Jadwal Kuliah */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-start">
            <Calendar className="w-12 h-12 mr-4 text-[#A27B5C]" />
            <div>
              <h3 className="text-2xl font-bold text-[#A27B5C] font-bebas">
                JADWAL KULIAH
              </h3>
              <p className="text-gray-600 text-sm font-poppins">
                Melihat jadwal kuliah berdasarkan mata kuliah, termasuk hari,
                jam, dosen pengampu, dan ruangan.
              </p>
            </div>
          </div>

          {/* Mata Kuliah */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-start">
            <Book className="w-12 h-12 mr-4 text-[#A27B5C]" />
            <div>
              <h3 className="text-2xl font-bold text-[#A27B5C] font-bebas">
                MATA KULIAH
              </h3>
              <p className="text-gray-600 text-sm font-poppins">
                Menampilkan daftar mata kuliah yang diambil mahasiswa beserta
                jumlah SKS dan dosen pengampu.
              </p>
            </div>
          </div>

          {/* Cetak Jadwal */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-start">
            <Printer className="w-12 h-12 mr-4 text-[#A27B5C]" />
            <div>
              <h3 className="text-2xl font-bold text-[#A27B5C] font-bebas">
                CETAK JADWAL
              </h3>
              <p className="text-gray-600 text-sm font-poppins">
                Mengunduh jadwal kuliah dalam format PDF agar bisa dicetak atau
                disimpan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT US SECTION */}
      <div className="px-8 py-12 bg-white flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Info Akademik */}
          <div className="rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden w-full bg-white font-poppins text-sm">
            {/* Bagian Header Merah */}
            <div className="bg-[#2C3930] text-white py-3 text-center">
              <h3 className="font-bold">PERHATIAN!</h3>
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

          {/* Pengumuman */}
          <div className="rounded shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden w-full bg-white text-sm font-poppins ">
            <div className="bg-[#2C3930] text-white py-3 px-4 text-center">
              <h3 className="font-bold">PENGUMUMAN</h3>
            </div>
            <div className="p-4 text-black">
              <div className="border-b pb-2 mb-2">
                <p className="text-green-600 font-bold">
                  [PENGEMBANGAN APLIKASI WEB]
                </p>
                <p>
                  Oleh:{" "}
                  <span className="bg-green-600 text-white px-1 py-0.3 rounded text-sm">
                    DOSEN MATAKULIAH
                  </span>{" "}
                  - XAVERIUS B.N. NAJOAN ST, MT
                </p>
                <p className="text-sm">19 Februari 2025</p>
              </div>
              <div>
                <p className="text-green-600 font-bold">[KEAMANAN SIBER]</p>
                <p>
                  Oleh:{" "}
                  <span className="bg-green-600 text-white px-1 py-0.3 rounded text-sm">
                    DOSEN MATAKULIAH
                  </span>{" "}
                  - XAVERIUS B.N. NAJOAN ST, MT
                </p>
                <p className="text-sm">19 Februari 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
