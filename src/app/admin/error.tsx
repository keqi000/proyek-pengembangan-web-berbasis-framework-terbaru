'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    console.warn('404 Not Found Page Rendered');
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-700 text-white text-center px-4">
      <div className="w-full max-w-xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Oops!</h1>
        <p className="text-base sm:text-lg md:text-xl mb-6">
          404 Page not found<br />
          Maaf, kami tidak dapat menemukan halaman yang Anda cari...
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="bg-blue-800 hover:bg-blue-900 px-5 py-3 rounded text-white transition duration-300"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/report"
            className="bg-blue-800 hover:bg-blue-900 px-5 py-3 rounded text-white transition duration-300"
          >
            Laporkan Masalah
          </Link>
        </div>
      </div>
    </div>
  );
}
