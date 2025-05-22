// Modify the relevant parts of the layout.tsx file

"use client";

import { useState, useEffect, useRef } from "react";
import NavigationBar from "./admin_component/Navbar";
import { Bell, Calendar, AlertTriangle, Settings, Info } from "lucide-react";
import Link from "next/link";
import { useNotificationStore } from "./_store/notifications";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userName = "Yonatan Sihotang"; // Bisa diambil dari context/state global
  const notificationRef = useRef<HTMLDivElement>(null);
  const mobileNotificationRef = useRef<HTMLDivElement>(null);

  // Use the notification store
  const {
    data: notifications,
    unreadCount,
    fetchData: fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

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

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "jadwal":
        return <Calendar className="text-blue-500" />;
      case "peringatan":
        return <AlertTriangle className="text-yellow-500" />;
      case "sistem":
        return <Settings className="text-gray-500" />;
      case "info":
        return <Info className="text-green-500" />;
      default:
        return <Bell className="text-blue-500" />;
    }
  };

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
        } ${isSidebarOpen ? "lg:filter-none filter" : ""}`}
      >
        {/* Top Navbar - Visible on all screen sizes now */}
        <nav className="bg-[#2C3930] text-white shadow-md h-12 sm:h-14 md:h-16 flex flex-col justify-center items-center px-2 sm:px-3 md:px-4 sticky top-0 z-10">
          <div className="flex justify-between items-center w-full px-2 sm:px-4 md:px-8">
            {/* Tombol Sidebar */}
            <button
              className="text-white focus:outline-none"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>

            {/* Search Bar - Only visible on medium screens and larger */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative" ref={notificationRef}>
                <button
                  className="relative p-1 text-white rounded-full hover:bg-[#3F4F44] transition-colors"
                  onClick={toggleNotifications}
                  aria-label="Notifikasi"
                >
                  <Bell size={16} className="sm:w-5 sm:h-5 md:w-5 md:h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] sm:text-xs font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 md:w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2 px-3 bg-[#2C3930] text-white font-medium flex justify-between items-center">
                      <span className="text-xs sm:text-sm">
                        Notifikasi ({notifications.length})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          className="text-[10px] sm:text-xs text-[#4F959D] hover:text-[#6AABB3]"
                          onClick={handleMarkAllAsRead}
                        >
                          Tandai semua sudah dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications
                          .filter(
                            (notification) =>
                              // Only show the general "Jadwal Baru Telah Digenerate" notifications
                              // and filter out individual schedule notifications
                              !(
                                notification.type === "jadwal" &&
                                notification.title === "Jadwal Baru Ditambahkan"
                              )
                          )
                          .slice(0, 3)
                          .map((notification) => {
                            const typeBgColor =
                              notification.type === "jadwal"
                                ? "bg-blue-100"
                                : notification.type === "peringatan"
                                ? "bg-yellow-100"
                                : notification.type === "sistem"
                                ? "bg-purple-100"
                                : "bg-green-100";

                            return (
                              <div
                                key={notification.id}
                                className={`p-2 sm:p-3 border-b hover:bg-gray-50 ${
                                  !notification.read ? "bg-blue-50" : ""
                                }`}
                                onClick={() =>
                                  handleMarkAsRead(notification.id)
                                }
                              >
                                <div className="flex items-start">
                                  <div
                                    className={`p-1.5 sm:p-2 rounded-full ${typeBgColor} mr-2 sm:mr-3`}
                                  >
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-xs sm:text-sm text-black">
                                      {notification.title}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                                      {notification.time}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-xs sm:text-sm">
                          Tidak ada notifikasi
                        </div>
                      )}
                    </div>
                    <div className="py-2 px-3 bg-gray-100 text-center">
                      <Link
                        href="/admin/notifications"
                        className="text-xs sm:text-sm text-[#4F959D] hover:text-[#6AABB3]"
                      >
                        Lihat Semua Notifikasi
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full bg-[#4F959D] flex items-center justify-center text-white font-medium mr-1 sm:mr-2">
                  {userName.charAt(0)}
                </div>
                <span className="text-xs sm:text-sm font-medium hidden xs:inline-block">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-2 sm:p-3 md:p-4">{children}</main>
      </div>
    </div>
  );
}
