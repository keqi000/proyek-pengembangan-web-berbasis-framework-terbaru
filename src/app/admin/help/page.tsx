"use client";

import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <HelpCircle className="text-[#4F959D] mr-2" size={24} />
        <h1 className="text-2xl font-semibold text-gray-800">Pusat Bantuan</h1>
      </div>

      <p className="text-gray-600 mb-6">
        Halaman ini berisi panduan penggunaan sistem penjadwalan otomatis.
        Silakan baca penjelasan fitur-fitur berikut:
      </p>

      <div className="space-y-4">
        <HelpItem
          title="📋 Beranda"
          description="Menampilkan ringkasan informasi jadwal, statistik, dan akses cepat ke fitur utama."
        />
        <HelpItem
          title="👨‍🏫 Kelola Dosen"
          description="Menambahkan, mengedit, dan menghapus data dosen yang tersedia dalam sistem."
        />
        <HelpItem
          title="📚 Kelola Mata Kuliah"
          description="Mengelola daftar mata kuliah termasuk nama, kode, SKS, dan pengampu."
        />
        <HelpItem
          title="🏢 Kelola Ruangan"
          description="Menambah dan mengelola ruangan yang dapat digunakan untuk perkuliahan."
        />
        <HelpItem
          title="🗓️ Generate Jadwal"
          description="Menghasilkan jadwal otomatis berdasarkan input dosen, mata kuliah, dan ruangan."
        />
        <HelpItem
          title="⚙️ Pengaturan"
          description="Mengatur preferensi sistem, seperti jam default kuliah atau batas maksimal sesi."
        />
        <HelpItem
          title="📞 Kontak Bantuan"
          description="Jika Anda mengalami masalah, hubungi admin sistem melalui email: admin@YonathanGanteng123.ac.id"
        />
      </div>
    </div>
  );
}

function HelpItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-l-4 border-[#4F959D] pl-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
