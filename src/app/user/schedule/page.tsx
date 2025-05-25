"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  User,
  BookOpen,
  Info,
  Loader,
} from "lucide-react";
import {
  getStudentSchedule,
  ScheduleItem,
} from "../../services/studentSchedule";

const JadwalKuliahPage = () => {
  const [jadwalData, setJadwalData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Use refs to prevent multiple API calls and track component state
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Get user data from localStorage
  const getUserData = useCallback(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }, []);

  const user = getUserData();

  // Reset state when component mounts
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadScheduleData = useCallback(async (userId: string) => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current || !isMountedRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log("Loading schedule for user:", userId);
      const schedules = await getStudentSchedule(userId);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        console.log("Fetched schedules:", schedules);
        setJadwalData(schedules);
        setDataLoaded(true);
        hasInitializedRef.current = true;
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
      if (isMountedRef.current) {
        setError("Gagal memuat jadwal kuliah");
        setDataLoaded(true);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, []);

  // Load data only once when component mounts
  useEffect(() => {
    if (
      user &&
      user.role === "mahasiswa" &&
      !hasInitializedRef.current &&
      isMountedRef.current
    ) {
      console.log("Initial schedule load for user:", user.id);
      loadScheduleData(user.id);
    } else if (!user || user.role !== "mahasiswa") {
      setLoading(false);
      setDataLoaded(true);
    }
  }, [user, loadScheduleData]);

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
        return "bg-blue-100 text-blue-800";
      case "Online":
        return "bg-green-100 text-green-800";
      case "Hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getJadwalByDay = (day: string) => {
    return filteredJadwal.filter((jadwal) => jadwal.hari === day);
  };

  // Show access denied if user is not a student
  if (!user || user.role !== "mahasiswa") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">Halaman ini hanya untuk mahasiswa</p>
        </div>
      </div>
    );
  }

  // Determine what to show based on loading and data state
  const shouldShowLoading = loading && !dataLoaded;
  const shouldShowContent = dataLoaded && !loading;
  const shouldShowEmptyState = shouldShowContent && jadwalData.length === 0;

  return (
    <div className="bg-gray-100 p-2 sm:p-3 md:p-4 min-h-screen font-poppins">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-[#2C3930] text-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
            <Calendar className="text-[#4F959D]" size={24} />
            Jadwal Kuliah Saya
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-200">
            Lihat jadwal kuliah berdasarkan mata kuliah yang Anda ambil
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Info size={16} />
            {error}
          </div>
        </div>
      )}

      {/* Search and Filter - Only show when data is loaded */}
      {shouldShowContent && (
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Cari mata kuliah, dosen, atau ruangan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F959D] focus:border-transparent text-sm text-black"
              />
            </div>

            {/* Day Filter */}
            <div className="sm:w-48">
              <select
                value={filterDay || ""}
                onChange={(e) => setFilterDay(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F959D] focus:border-transparent text-sm text-black"
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
      )}

      {/* Loading State */}
      {shouldShowLoading && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-8">
            <Loader
              className="animate-spin mx-auto text-2xl text-[#4F959D] mb-2"
              size={32}
            />
            <p className="text-gray-500">Memuat jadwal kuliah...</p>
          </div>
        </div>
      )}

      {/* Schedule Content */}
      {shouldShowContent && (
        <>
          {/* Summary - Only show when there's data */}
          {jadwalData.length > 0 && (
            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-[#2C3930] mb-3 flex items-center gap-2">
                <Info className="text-[#4F959D]" size={20} />
                Ringkasan Jadwal
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-blue-600">
                    {jadwalData.length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Total Jadwal
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-green-600">
                    {new Set(jadwalData.map((j) => j.mataKuliah)).size}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Mata Kuliah
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-purple-600">
                    {new Set(jadwalData.map((j) => j.namaDosen)).size}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Dosen</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-amber-600">
                    {new Set(jadwalData.map((j) => j.hari)).size}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Hari Aktif
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule by Day */}
          {filteredJadwal.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {days.map((day) => {
                const daySchedules = getJadwalByDay(day);
                if (
                  daySchedules.length === 0 &&
                  filterDay &&
                  filterDay !== day
                ) {
                  return null;
                }

                return (
                  <div
                    key={day}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="bg-[#4F959D] text-white p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                        <Calendar size={20} />
                        {day}
                        <span className="ml-auto text-xs sm:text-sm bg-white bg-opacity-20 px-2 py-1 rounded  text-black">
                          {daySchedules.length} jadwal
                        </span>
                      </h3>
                    </div>

                    {daySchedules.length > 0 ? (
                      <div className="p-3 sm:p-4">
                        <div className="space-y-3 sm:space-y-4">
                          {daySchedules
                            .sort((a, b) => a.waktu.localeCompare(b.waktu))
                            .map((jadwal, index) => (
                              <div
                                key={`${jadwal.id}-${index}`}
                                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                      <h4 className="font-semibold text-sm sm:text-base text-[#2C3930] flex items-center gap-2">
                                        <BookOpen
                                          size={16}
                                          className="text-[#4F959D]"
                                        />
                                        {jadwal.mataKuliah}
                                      </h4>
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {jadwal.kode}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Clock
                                          size={14}
                                          className="text-gray-400"
                                        />
                                        <span>{jadwal.waktu}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User
                                          size={14}
                                          className="text-gray-400"
                                        />
                                        <span>{jadwal.namaDosen}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin
                                          size={14}
                                          className="text-gray-400"
                                        />
                                        <span>{jadwal.ruangan}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:items-end gap-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getJenisKuliahColor(
                                        "Tatap Muka"
                                      )}`}
                                    >
                                      Tatap Muka
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Semester {jadwal.semester}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <Calendar
                          className="mx-auto mb-2 text-gray-400"
                          size={32}
                        />
                        <p className="text-sm">
                          Tidak ada jadwal untuk hari {day}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : shouldShowEmptyState ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center py-8 text-gray-500">
                <Calendar
                  className="mx-auto text-4xl mb-3 text-gray-400"
                  size={48}
                />
                <h3 className="text-lg font-medium mb-2">Tidak Ada Jadwal</h3>
                <p className="text-sm mb-4">
                  Anda belum memiliki jadwal kuliah
                </p>
                <p className="text-xs text-gray-400">
                  Silakan daftar mata kuliah terlebih dahulu di halaman{" "}
                  <a
                    href="/user/course"
                    className="text-[#4F959D] hover:underline"
                  >
                    Mata Kuliah
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center py-8 text-gray-500">
                <Calendar
                  className="mx-auto text-4xl mb-3 text-gray-400"
                  size={48}
                />
                <h3 className="text-lg font-medium mb-2">Tidak Ada Hasil</h3>
                <p className="text-sm">
                  Tidak ada jadwal yang sesuai dengan pencarian atau filter
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JadwalKuliahPage;
