"use client";

import { FC, useState, useEffect } from "react";
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  User,
  BookOpen,
  Info,
} from "lucide-react";

type JadwalItem = {
  id: string;
  hari: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  mataKuliah: string;
  namaDosen: string;
  ruangan: string;
  jenisKuliah: "Tatap Muka" | "Online" | "Hybrid";
  keterangan?: string;
};

const JadwalKuliahPage: FC = () => {
  const [jadwalData, setJadwalData] = useState<JadwalItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    // In a real application, this would come from an API or store
    const mockJadwal: JadwalItem[] = [
      {
        id: "1",
        hari: "Senin",
        tanggal: "25 Maret 2025",
        jamMulai: "08:00",
        jamSelesai: "10:00",
        mataKuliah: "Pemrograman Web",
        namaDosen: "Dr. Budi Santoso, M.Kom.",
        ruangan: "Lab Komputer 2",
        jenisKuliah: "Tatap Muka",
      },
      {
        id: "2",
        hari: "Senin",
        tanggal: "25 Maret 2025",
        jamMulai: "13:00",
        jamSelesai: "15:00",
        mataKuliah: "Basis Data Lanjut",
        namaDosen: "Dr. Siti Aminah, M.Sc.",
        ruangan: "Ruang 301",
        jenisKuliah: "Tatap Muka",
      },
      {
        id: "3",
        hari: "Selasa",
        tanggal: "26 Maret 2025",
        jamMulai: "09:00",
        jamSelesai: "11:30",
        mataKuliah: "Kecerdasan Buatan",
        namaDosen: "Prof. Ahmad Wijaya, Ph.D.",
        ruangan: "Online",
        jenisKuliah: "Online",
        keterangan: "Meeting via Zoom",
      },
      {
        id: "4",
        hari: "Rabu",
        tanggal: "27 Maret 2025",
        jamMulai: "10:00",
        jamSelesai: "12:00",
        mataKuliah: "Jaringan Komputer",
        namaDosen: "Dr. Rini Puspita, M.T.",
        ruangan: "Lab Jaringan",
        jenisKuliah: "Hybrid",
        keterangan: "Kelompok A offline, Kelompok B online",
      },
      {
        id: "5",
        hari: "Kamis",
        tanggal: "28 Maret 2025",
        jamMulai: "13:00",
        jamSelesai: "15:00",
        mataKuliah: "Pengembangan Aplikasi Mobile",
        namaDosen: "Dr. Hadi Prasetyo, M.Kom.",
        ruangan: "Lab Mobile",
        jenisKuliah: "Tatap Muka",
        keterangan: "Kuliah digantikan dengan tugas mandiri",
      },
      {
        id: "6",
        hari: "Jumat",
        tanggal: "29 Maret 2025",
        jamMulai: "08:00",
        jamSelesai: "10:00",
        mataKuliah: "Keamanan Sistem Informasi",
        namaDosen: "Dr. Eko Nugroho, M.Sc.",
        ruangan: "Ruang 201",
        jenisKuliah: "Tatap Muka",
      },
    ];

    setJadwalData(mockJadwal);
  }, []);

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const filteredJadwal = jadwalData.filter((jadwal) => {
    const matchesSearch =
      jadwal.mataKuliah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jadwal.namaDosen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jadwal.ruangan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDay = filterDay ? jadwal.hari === filterDay : true;

    return matchesSearch && matchesDay;
  });

  const getJenisKuliahColor = (jenis: string) => {
    switch (jenis) {
      case "Tatap Muka":
        return "bg-green-100 text-green-800";
      case "Online":
        return "bg-blue-100 text-blue-800";
      case "Hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getJenisKuliahIcon = (jenis: string) => {
    switch (jenis) {
      case "Tatap Muka":
        return <MapPin className="w-4 h-4 mr-1" />;
      case "Online":
        return <BookOpen className="w-4 h-4 mr-1" />;
      case "Hybrid":
        return <Info className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-full py-8 px-4 md:px-8 bg-[#DCD7C9]">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2 font-bebas">
          JADWAL <span className="text-[#A27B5C]">KULIAH</span>
        </h1>
        <p className="text-gray-700 font-poppins">
          Informasi lengkap jadwal perkuliahan Anda, termasuk waktu, lokasi, dan
          dosen pengampu.
        </p>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#A27B5C] focus:border-[#A27B5C] sm:text-sm text-black"
                placeholder="Cari mata kuliah, dosen, atau ruangan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-none">
            <select
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-black focus:outline-none focus:ring-[#A27B5C] focus:border-[#A27B5C] sm:text-sm text-black"
              value={filterDay || ""}
              onChange={(e) => setFilterDay(e.target.value || null)}
            >
              <option value="">Semua Hari</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Jadwal Content */}
      <div className="space-y-6">
        {days
          .filter((day) => (filterDay ? day === filterDay : true))
          .map((day) => {
            const dayJadwal = filteredJadwal.filter((j) => j.hari === day);
            if (dayJadwal.length === 0) return null;

            return (
              <div
                key={day}
                className="bg-white rounded-lg shadow-md overflow-hidden font-poppins"
              >
                <div className="bg-[#A27B5C] text-white p-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <h2 className="text-xl font-semibold font-bebas">{day}</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {dayJadwal.map((jadwal) => (
                    <div key={jadwal.id} className="p-4 hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <div className="flex items-center mb-2 md:mb-0">
                          <Clock className="w-5 h-5 text-[#A27B5C] mr-2" />
                          <span className="text-gray-700 font-medium">
                            {jadwal.jamMulai} - {jadwal.jamSelesai}
                          </span>
                          <span className="mx-2 text-gray-400">|</span>
                          <span className="text-gray-600">
                            {jadwal.tanggal}
                          </span>
                        </div>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJenisKuliahColor(
                            jadwal.jenisKuliah
                          )}`}
                        >
                          {getJenisKuliahIcon(jadwal.jenisKuliah)}
                          {jadwal.jenisKuliah}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-black mb-2">
                        {jadwal.mataKuliah}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-start">
                          <User className="w-4 h-4 text-[#A27B5C] mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">
                            {jadwal.namaDosen}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-[#A27B5C] mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">
                            {jadwal.ruangan}
                          </span>
                        </div>
                      </div>
                      {jadwal.keterangan && (
                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-[#A27B5C]">
                          <Info className="w-4 h-4 inline mr-1" />
                          {jadwal.keterangan}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {filteredJadwal.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Tidak ada jadwal ditemukan
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `Tidak ada jadwal yang cocok dengan pencarian "${searchTerm}"`
                : "Tidak ada jadwal untuk ditampilkan"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JadwalKuliahPage;
