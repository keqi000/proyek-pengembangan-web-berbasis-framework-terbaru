"use client";

import { useState, useEffect, useRef } from "react";
import NavigationBar from "./admin_component/Navbar";
import { Bell, Calendar, AlertTriangle, Settings, Info } from "lucide-react";
import Link from "next/link";

// Define notification types with their respective icons and colors
const notificationTypes = {
  jadwal: { icon: Calendar, color: "text-blue-500", bgColor: "bg-blue-100" },
  peringatan: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
  sistem: {
    icon: Settings,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  info: { icon: Info, color: "text-green-500", bgColor: "bg-green-100" },
};

// Mock notifications data - same as in notifications page
const initialNotifications = [
  {
    id: 1,
    type: "jadwal",
    title: "Jadwal Baru",
    message:
      "Jadwal perkuliahan semester baru telah diterbitkan. Silakan periksa jadwal Anda untuk memastikan tidak ada konflik.",
    time: "5 menit yang lalu",
    date: "2023-07-15",
    read: false,
  },
  {
    id: 2,
    type: "jadwal",
    title: "Perubahan Ruangan",
    message:
      "Ruangan untuk mata kuliah Basis Data telah diubah ke R.301 mulai minggu depan. Harap diperhatikan perubahan ini.",
    time: "1 jam yang lalu",
    date: "2023-07-15",
    read: false,
  },
  {
    id: 3,
    type: "sistem",
    title: "Pengumuman Sistem",
    message:
      "Sistem akan mengalami pemeliharaan pada tanggal 15 Juli 2023 pukul 23:00 - 01:00. Mohon maaf atas ketidaknyamanannya.",
    time: "1 hari yang lalu",
    date: "2023-07-14",
    read: false,
  },
  {
    id: 4,
    type: "jadwal",
    title: "Perubahan Jadwal",
    message:
      "Jadwal mata kuliah Algoritma diubah menjadi hari Rabu pukul 13:00 - 15:30 di ruang R.401.",
    time: "2 hari yang lalu",
    date: "2023-07-13",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "Pengumuman Libur",
    message:
      "Perkuliahan diliburkan pada tanggal 17 Agustus 2023 dalam rangka memperingati Hari Kemerdekaan Republik Indonesia.",
    time: "3 hari yang lalu",
    date: "2023-07-12",
    read: true,
  },
  {
    id: 6,
    type: "peringatan",
    title: "Batas Waktu Pengumpulan",
    message:
      "Batas waktu pengumpulan jadwal dosen akan berakhir dalam 2 hari. Pastikan semua dosen telah mengirimkan preferensi jadwal mereka.",
    time: "3 hari yang lalu",
    date: "2023-07-12",
    read: true,
  },
  {
    id: 7,
    type: "sistem",
    title: "Pembaruan Sistem",
    message:
      "Sistem Penjadwalan Otomatis telah diperbarui ke versi 1.0.2. Beberapa perbaikan bug dan peningkatan kinerja telah diterapkan.",
    time: "4 hari yang lalu",
    date: "2023-07-11",
    read: true,
  },
  {
    id: 8,
    type: "info",
    title: "Pengumuman Rapat",
    message:
      "Rapat koordinasi penjadwalan semester baru akan diadakan pada tanggal 20 Juli 2023 pukul 10:00 di Ruang Rapat Utama.",
    time: "5 hari yang lalu",
    date: "2023-07-10",
    read: true,
  },
  {
    id: 9,
    type: "peringatan",
    title: "Konflik Jadwal Terdeteksi",
    message:
      "Sistem mendeteksi beberapa konflik jadwal pada mata kuliah Pemrograman Web dan Jaringan Komputer. Mohon segera diperiksa.",
    time: "6 hari yang lalu",
    date: "2023-07-09",
    read: true,
  },
  {
    id: 10,
    type: "jadwal",
    title: "Permintaan Perubahan",
    message:
      "Dr. Ahmad Wijaya mengajukan permintaan perubahan jadwal untuk mata kuliah Kecerdasan Buatan.",
    time: "1 minggu yang lalu",
    date: "2023-07-08",
    read: true,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userName = "Yonatan Sihotang"; // Bisa diambil dari context/state global
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState(initialNotifications);
  const mobileNotificationRef = useRef<HTMLDivElement>(null);

  // Add effect to prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        mobileNotificationRef.current &&
        !mobileNotificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-gray-100 w-full max-w-full overflow-hidden">
      {/* Navbar Component - pass the notification props */}
      <NavigationBar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        toggleNotifications={toggleNotifications}
        unreadCount={unreadCount}
      />

      {/* Konten utama yang bergeser - Tambahkan padding top untuk mobile */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        } pt-14 lg:pt-0 ${isSidebarOpen ? "lg:filter-none filter" : ""}`} // Tambahkan padding top untuk mobile
      >
        {/* Top Navbar - Hanya tampil di desktop */}
        <nav className="bg-[#2C3930] text-white shadow-md h-16 hidden lg:flex lg:flex-col lg:justify-center items-center px-4 sticky top-0 z-10">
          <div className="flex justify-between items-center w-full px-8">
            {/* Tombol Sidebar */}
            <button
              className="text-white focus:outline-none"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>

            {/* Search Bar */}
            <div className="flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari..."
                  className="w-full px-4 py-2 rounded-lg text-gray-300 focus:outline-none ring-gray-300 ring-1 focus:ring-1 focus:ring-[#4F959D]"
                />
                <button className="absolute right-3 top-2.5 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative" ref={notificationRef}>
                <button
                  className="relative p-1 text-white rounded-full hover:bg-[#3F4F44] transition-colors"
                  onClick={toggleNotifications}
                  aria-label="Notifikasi"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2 px-3 bg-[#2C3930] text-white font-medium flex justify-between items-center">
                      <span>Notifikasi ({notifications.length})</span>
                      {unreadCount > 0 && (
                        <button
                          className="text-xs text-[#4F959D] hover:text-[#6AABB3]"
                          onClick={markAllAsRead}
                        >
                          Tandai semua sudah dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 3).map((notification) => {
                          const TypeIcon =
                            notificationTypes[
                              notification.type as keyof typeof notificationTypes
                            ].icon;
                          const typeColor =
                            notificationTypes[
                              notification.type as keyof typeof notificationTypes
                            ].color;
                          const typeBgColor =
                            notificationTypes[
                              notification.type as keyof typeof notificationTypes
                            ].bgColor;

                          return (
                            <div
                              key={notification.id}
                              className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                                !notification.read ? "bg-blue-50" : ""
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex">
                                <div
                                  className={`${typeBgColor} ${typeColor} p-2 rounded-full mr-3 self-start`}
                                >
                                  <TypeIcon size={16} />
                                </div>
                                <div>
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-800">
                                      {notification.title}
                                      {!notification.read && (
                                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                      )}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                      {notification.time}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notification.message.length > 60
                                      ? `${notification.message.substring(
                                          0,
                                          60
                                        )}...`
                                      : notification.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Tidak ada notifikasi
                        </div>
                      )}
                    </div>
                    <div className="py-2 px-3 bg-gray-50 text-center">
                      <Link
                        href="/admin/notifications"
                        className="text-sm text-[#4F959D] hover:text-[#6AABB3] block w-full"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        Lihat semua notifikasi
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#4F959D] flex items-center justify-center text-white font-bold">
                  {userName.charAt(0)}
                </div>
                <span className="text-white font-medium hidden md:block">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Top Navbar for mobile */}
        <div className="fixed top-0 left-0 right-0 bg-[#2C3930] text-white h-14 flex items-center justify-between px-4 lg:hidden z-20">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-white focus:outline-none"
          >
            ☰
          </button>
          <div className="text-lg font-semibold">Sistem Penjadwalan</div>
          <div className="flex items-center space-x-3">
            <div className="relative" ref={mobileNotificationRef}>
              <button
                className="relative p-1 text-white rounded-full hover:bg-[#3F4F44] transition-colors"
                onClick={toggleNotifications}
                aria-label="Notifikasi"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown for mobile */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-70 bg-white rounded-md shadow-lg overflow-hidden z-20">
                  <div className="py-2 px-3 bg-[#2C3930] text-white font-medium flex justify-between items-center">
                    <span>Notifikasi ({notifications.length})</span>
                    {unreadCount > 0 && (
                      <button
                        className="text-xs text-[#4F959D] hover:text-[#6AABB3]"
                        onClick={markAllAsRead}
                      >
                        Tandai semua sudah dibaca
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 3).map((notification) => {
                        const TypeIcon =
                          notificationTypes[
                            notification.type as keyof typeof notificationTypes
                          ].icon;
                        const typeColor =
                          notificationTypes[
                            notification.type as keyof typeof notificationTypes
                          ].color;
                        const typeBgColor =
                          notificationTypes[
                            notification.type as keyof typeof notificationTypes
                          ].bgColor;

                        return (
                          <div
                            key={notification.id}
                            className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex">
                              <div
                                className={`${typeBgColor} ${typeColor} p-2 rounded-full mr-3 self-start`}
                              >
                                <TypeIcon size={16} />
                              </div>
                              <div>
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-gray-800">
                                    {notification.title}
                                    {!notification.read && (
                                      <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                    )}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {notification.time}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message.length > 60
                                    ? `${notification.message.substring(
                                        0,
                                        60
                                      )}...`
                                    : notification.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Tidak ada notifikasi
                      </div>
                    )}
                  </div>
                  <div className="py-2 px-3 bg-gray-50 text-center">
                    <Link
                      href="/admin/notifications"
                      className="text-sm text-[#4F959D] hover:text-[#6AABB3] block w-full"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      Lihat semua notifikasi
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="h-8 w-8 rounded-full bg-[#4F959D] flex items-center justify-center text-white font-bold">
              {userName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Konten utama */}
        <main
          className={`flex flex-col p-4 lg:p-6 flex-grow max-w-full bg-gray-100 ${
            isSidebarOpen && window.innerWidth < 768 ? "blur-sm" : ""
          }`}
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          className={`bg-white text-center p-4 shadow-inner ${
            isSidebarOpen && window.innerWidth < 768 ? "blur-sm" : ""
          }`}
        >
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Sistem Penjadwalan Otomatis | Versi
            1.0.2
          </p>
        </footer>
      </div>
    </div>
  );
}
