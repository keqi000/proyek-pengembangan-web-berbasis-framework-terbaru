"use client";

import {
  Home,
  Calendar,
  Book,
  Printer,
  Users,
  Clock,
  BookOpen,
  TrendingUp,
  Bell,
  User,
} from "lucide-react";
import { FC, useEffect, useState, useCallback } from "react";
import HeroSlider from "../_component/HeroSlider";
import {
  getStudentDashboardStats,
  getRecentActivities,
  getAnnouncements,
  DashboardStats,
  RecentActivity,
  Announcement,
} from "../../services/dashboard";
import { getTodayScheduleSummary } from "../../services/dashboard";

type UserInfoType = {
  role: string;
  name: string;
}

const HomePage: FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInfoType | null>(null);

  // Get user data from localStorage
  const getUserData = useCallback(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }, []);

  // Load dashboard data
  const loadDashboardData = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const [stats, activities, announcements, todayScheduleSummary] =
        await Promise.all([
          getStudentDashboardStats(userId),
          getRecentActivities(userId),
          getAnnouncements(userId), // Pass userId untuk filter
          getTodayScheduleSummary(userId),
        ]);

      setDashboardStats(stats);
      setRecentActivities(activities);
      setAnnouncements(announcements);
      setTodaySchedule(todayScheduleSummary);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const [todaySchedule, setTodaySchedule] = useState<any>(null);

  useEffect(() => {
    const userData = getUserData();
    setUser(userData);

    if (userData && userData.role === "mahasiswa") {
      loadDashboardData(userData.id);
    } else {
      setLoading(false);
    }
  }, [getUserData, loadDashboardData]);

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

  return (
    <div>
      <HeroSlider />

      {/* DASHBOARD STATISTICS */}
      <div className="px-8 py-12 bg-[#DCD7C9]">
        <h2 className="text-3xl font-bold text-black mb-2">
          Dashboard <span className="text-[#A27B5C]">Mahasiswa</span>
        </h2>
        <p className="text-gray-700 mb-6 font-poppins">
          Selamat datang, <strong>{user?.name || "Mahasiswa"}</strong>! Berikut
          adalah ringkasan akademik Anda.
        </p>

        {/* Statistics Cards */}
        {!loading && dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Mata Kuliah
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {dashboardStats.totalCourses}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Mata Kuliah Diambil
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {dashboardStats.enrolledCourses}
                  </p>
                </div>
                <Book className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Jadwal Kuliah
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {dashboardStats.totalSchedules}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Semester</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {dashboardStats.currentSemester}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* TODAY'S SCHEDULE SUMMARY */}
        {!loading && todaySchedule && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-4">
              Jadwal <span className="text-[#A27B5C]">Hari Ini</span>
            </h3>

            {todaySchedule.hasSchedule ? (
              <div className="bg-white p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-green-700">
                    Anda memiliki {todaySchedule.total} jadwal kuliah hari ini
                  </h4>
                  <a
                    href="/user/schedule"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lihat Detail →
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todaySchedule.schedules
                    .slice(0, 2)
                    .map((schedule: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">
                            {schedule.mataKuliah}
                          </h5>
                          <span className="text-sm text-gray-600">
                            {schedule.waktu}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Dosen: {schedule.namaDosen}</p>
                          <p>Ruangan: {schedule.ruangan}</p>
                        </div>
                      </div>
                    ))}
                </div>
                {todaySchedule.total > 2 && (
                  <div className="mt-4 text-center">
                    <a
                      href="/user/schedule"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Lihat {todaySchedule.total - 2} jadwal lainnya
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] border-l-4 border-gray-300">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">
                    Tidak Ada Jadwal Hari Ini
                  </h4>
                  <p className="text-sm text-gray-500">
                    Anda bebas dari jadwal kuliah hari ini. Manfaatkan waktu
                    untuk belajar mandiri!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SERVICES */}
        <h3 className="text-2xl font-bold text-black mb-4">
          Layanan <span className="text-[#A27B5C]">Mahasiswa</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* RECENT ACTIVITIES & ANNOUNCEMENTS */}
      <div className="px-8 py-12 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div>
            <h3 className="text-2xl font-bold text-black mb-6">
              Aktivitas <span className="text-[#A27B5C]">Terbaru</span>
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-4 rounded-lg animate-pulse"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#A27B5C] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === "enrollment" && (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                        {activity.type === "schedule" && (
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        {activity.type === "announcement" && (
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Bell className="w-5 h-5 text-yellow-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.date} • {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  Belum Ada Aktivitas
                </h4>
                <p className="text-sm text-gray-500">
                  Aktivitas terbaru Anda akan muncul di sini
                </p>
              </div>
            )}
          </div>

          {/* Announcements */}
          <div>
            <h3 className="text-2xl font-bold text-black mb-6">
              Pengumuman <span className="text-[#A27B5C]">Terbaru</span>
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-4 rounded-lg animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-blue-900 text-sm">
                        {announcement.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.type === "course"
                            ? "bg-blue-100 text-blue-800"
                            : announcement.type === "exam"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {announcement.type === "course"
                          ? "Mata Kuliah"
                          : announcement.type === "exam"
                          ? "Ujian"
                          : "Umum"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {announcement.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {announcement.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {announcement.date}
                      </div>
                    </div>
                    {announcement.course && (
                      <div className="mt-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block">
                        {announcement.course}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  Belum Ada Pengumuman
                </h4>
                <p className="text-sm text-gray-500">
                  Pengumuman terbaru akan muncul di sini
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ACADEMIC INFO */}
      <div className="px-8 py-12 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-black mb-6 text-center">
            Informasi <span className="text-[#A27B5C]">Akademik</span>
          </h3>

          {!loading && dashboardStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Semester Aktif
                </h4>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  {dashboardStats.currentSemester}
                </p>
                <p className="text-sm text-gray-600">
                  Tahun Akademik {dashboardStats.academicYear}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Status Mahasiswa
                </h4>
                <p className="text-2xl font-bold text-green-600 mb-1">
                  {dashboardStats.studentStatus}
                </p>
                <p className="text-sm text-gray-600">
                  Terdaftar sebagai mahasiswa aktif
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Progress Kuliah
                </h4>
                <p className="text-2xl font-bold text-purple-600 mb-1">
                  {dashboardStats.enrolledCourses}/{dashboardStats.totalCourses}
                </p>
                <p className="text-sm text-gray-600">
                  Mata kuliah yang diambil
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-md text-center animate-pulse"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
