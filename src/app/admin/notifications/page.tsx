"use client";

import { useState, useEffect, ElementType } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Trash2,
  Calendar,
  AlertTriangle,
  Info,
  Settings,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

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

type NotificationItem = {
  id: number;
  type: "jadwal" | "sistem" | "info" | "peringatan";
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
}

// Mock notifications data
const initialNotifications: NotificationItem[] = [
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

type NotificationSettingItem = {
  icon: ElementType;
  title: string;
  iconColor: string;
}

function NotificationSettingCard({icon, title, iconColor}: NotificationSettingItem){
  const Icon = icon;
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 border rounded-md">
      <div className="flex items-center">
        <div className={cn("p-1.5 sm:p-2 bg-blue-100 text-blue-500 rounded-md mr-2 sm:mr-3", `bg-${iconColor}-100`, `text-${iconColor}-500`)}>
            <Icon size={14} className="sm:w-4 sm:h-4" />
          
        </div>
        <span className="text-xs sm:text-sm text-gray-700">
          {title}
        </span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked />
        <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-[#4F959D]"></div>
      </label>
    </div>
  )
}

const notificationSettingData: NotificationSettingItem[] = [{
  title: "Notifikasi Email",
  icon: Bell,
  iconColor: "blue"
}, {
  title: "Notifikasi Sistem",
  icon: Settings,
  iconColor: "purple"
}, {
  title: "Notifikasi Jadwal",
  icon: Calendar,
  iconColor: "green",
}, {
  title: "Notifikasi Peringatan",
  icon: AlertTriangle,
  iconColor: "yellow"
}]

export default function NotificationsPage() {
  const [isClient, setIsClient] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setNotifications(initialNotifications);
  }, []);

  // Group notifications by date
  const groupedNotifications = isClient
    ? notifications.reduce((groups, notification) => {
        const date = notification.date;
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(notification);
        return groups;
      }, {} as Record<string, typeof notifications>)
    : {};

  // Filter notifications based on search term, type, and read status
  const filteredNotifications = isClient
    ? Object.entries(groupedNotifications)
        .map(([date, notifs]) => {
          const filtered = notifs.filter((notification) => {
            const matchesSearch =
              notification.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              notification.message
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            const matchesType = filterType
              ? notification.type === filterType
              : true;

            const matchesReadStatus = showUnreadOnly
              ? !notification.read
              : true;

            return matchesSearch && matchesType && matchesReadStatus;
          });

          return { date, notifications: filtered };
        })
        .filter((group) => group.notifications.length > 0)
    : [];

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const refreshNotifications = () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setNotifications(initialNotifications);
      setIsRefreshing(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    if (!isClient) return "";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const unreadCount = isClient
    ? notifications.filter((n) => !n.read).length
    : 0;

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F959D]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Bell className="mr-2 text-[#4F959D] w-5 h-5 sm:w-6 sm:h-6" />
            Notifikasi
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                {unreadCount} belum dibaca
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Kelola semua notifikasi sistem penjadwalan Anda di satu tempat
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm ${
              unreadCount === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#4F959D] text-white hover:bg-[#3d7a82]"
            } transition-colors`}
          >
            <CheckCircle size={14} className="mr-1" />
            <span className="hidden xs:inline">Tandai Semua Dibaca</span>
            <span className="xs:hidden">Tandai</span>
          </button>

          <button
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm ${
              notifications.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            } transition-colors`}
          >
            <Trash2 size={14} className="mr-1" />
            <span className="hidden xs:inline">Hapus Semua</span>
            <span className="xs:hidden">Hapus</span>
          </button>

          <button
            onClick={refreshNotifications}
            className="flex items-center px-3 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-sm transition-colors"
          >
            <RefreshCw
              size={14}
              className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6 text-black">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari notifikasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 sm:py-2 w-full text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F959D]"
            />
          </div>

          <div className="flex space-x-2">
            <div className="relative">
              <select
                value={filterType || ""}
                onChange={(e) => setFilterType(e.target.value || null)}
                className="appearance-none pl-9 pr-6 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F959D] bg-white"
              >
                <option value="">Semua Tipe</option>
                <option value="jadwal">Jadwal</option>
                <option value="peringatan">Peringatan</option>
                <option value="sistem">Sistem</option>
                <option value="info">Informasi</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={14} className="text-gray-400" />
              </div>
            </div>

            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`flex items-center px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md ${
                showUnreadOnly
                  ? "bg-[#4F959D] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {showUnreadOnly ? "Semua" : "Belum Dibaca"}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {filteredNotifications.map(({ date, notifications }) => (
            <div
              key={date}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="bg-white px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <Clock size={14} className="text-gray-500 mr-2" />
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700">
                    {formatDate(date)}
                  </h3>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => {
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
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 sm:p-4 hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex">
                        <div
                          className={`${typeBgColor} ${typeColor} p-2 sm:p-3 rounded-full mr-3 sm:mr-4 self-start`}
                        >
                          <TypeIcon size={16} />
                        </div>

                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 flex items-center">
                                {notification.title}
                                {!notification.read && (
                                  <span className="ml-2 inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {notification.time}
                              </span>
                            </div>

                            <div className="flex space-x-1">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-[#4F959D] rounded-full hover:bg-gray-100"
                                  title="Tandai sudah dibaca"
                                >
                                  <CheckCircle size={14} />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                                title="Hapus notifikasi"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>

                          <div className="mt-2 flex justify-end">
                            <span className="text-xs text-gray-500 italic">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-6 sm:p-12 text-center"
        >
          <div className="flex justify-center mb-4">
            <Bell size={36} className="text-gray-300" />
          </div>
          <h3 className="text-sm sm:text-lg md:text-xl font-medium text-gray-700 mb-2">
            Tidak ada notifikasi
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            {searchTerm || filterType || showUnreadOnly
              ? "Tidak ada notifikasi yang sesuai dengan filter Anda"
              : "Anda tidak memiliki notifikasi saat ini"}
          </p>
          {(searchTerm || filterType || showUnreadOnly) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType(null);
                setShowUnreadOnly(false);
              }}
              className="mt-4 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#4F959D] text-white rounded-md hover:bg-[#3d7a82] transition-colors"
            >
              Reset Filter
            </button>
          )}
        </motion.div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-8">
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">
                Total Notifikasi
              </p>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">
                {notifications.length}
              </h3>
            </div>
            <div className="p-2 sm:p-3 bg-blue-100 text-blue-500 rounded-full">
              <Bell size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Belum Dibaca</p>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">
                {unreadCount}
              </h3>
            </div>
            <div className="p-2 sm:p-3 bg-red-100 text-red-500 rounded-full">
              <AlertTriangle size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">
                Notifikasi Jadwal
              </p>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">
                {notifications.filter((n) => n.type === "jadwal").length}
              </h3>
            </div>
            <div className="p-2 sm:p-3 bg-green-100 text-green-500 rounded-full">
              <Calendar size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Peringatan</p>
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800">
                {notifications.filter((n) => n.type === "peringatan").length}
              </h3>
            </div>
            <div className="p-2 sm:p-3 bg-yellow-100 text-yellow-500 rounded-full">
              <AlertTriangle size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 sm:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 mb-3 sm:mb-4">
          Pengaturan Notifikasi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
          {notificationSettingData.map((item, index) => 
            <NotificationSettingCard 
              key={index} 
              icon={item.icon} 
              title={item.title} 
              iconColor={item.iconColor}             
            />
          )}
        </div>
      </div>
    </div>
  );
}
