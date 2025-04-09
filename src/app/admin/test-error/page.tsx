'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function CustomNotFoundPage() {
  useEffect(() => {
    console.warn('Halaman 404 dirender');
    console.log("Trigger PR berhasil dari folder yang benar"); // Tambahan untuk trigger PR, Dari Tadi Ngak Ditangkap Apapun LOL
  }, []);

  return (
    <div className="fixed inset-0 bg-[#DCD7C9] font-poppins flex items-center justify-center overflow-hidden">
      <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] rounded-lg w-full max-w-sm sm:max-w-md md:max-w-xl p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6">
        <div className="flex justify-center">
          <AlertTriangle className="text-[#A27B5C] w-12 h-12 sm:w-16 sm:h-16" />
        </div>

        {/* Oops! + emote */}
        <h1 className="text-2xl sm:text-3xl text-[#2C3930] font-bold flex justify-center items-center gap-2">
          Oops! <span className="text-3xl sm:text-4xl">😵</span>
        </h1>

        {/* Subjudul */}
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#2C3930]">
          Halaman tidak ditemukan!
        </h2>

        <p className="text-sm sm:text-base text-gray-600">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin halaman telah dipindahkan atau URL salah.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="bg-[#2C3930] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded text-sm sm:text-base hover:bg-[#3F4F44] transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/report"
            className="bg-[#A27B5C] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded text-sm sm:text-base hover:bg-[#8C624B] transition-colors"
          >
            Laporkan Masalah
          </Link>
        </div>
      </div>
    </div>
  );
}
