'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminNotFound() {
  useEffect(() => {
    console.warn('Halaman Error 404 Admin dirender');
  }, []);

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-700 text-white text-center px-4">
      <div className="max-w-xl py-20">
        <h1 className="text-5xl font-bold mb-6">Oops!</h1>
        <p className="text-lg mb-8">
          404 - Halaman tidak ditemukan<br />
          Maaf, kami tidak dapat menemukan halaman yang Anda cari...
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/admin/home"
            className="bg-blue-800 hover:bg-blue-900 px-5 py-3 rounded text-white transition duration-300"
          >
            Kembali ke Admin
          </Link>
          <Link
            href="/admin/help"
            className="bg-blue-800 hover:bg-blue-900 px-5 py-3 rounded text-white transition duration-300"
          >
            Bantuan
          </Link>
        </div>
      </div>
    </div>
  );
}
