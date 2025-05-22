"use client";

import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCog,
  FaInfoCircle,
  FaCheck,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";
import { useNotificationStore } from "../_store/notifications";
import Link from "next/link";
import { NotificationItem } from "@/app/services/api";

const NotificationsPage = () => {
  const {
    data: notifications,
    loading,
    error,
    fetchData,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<
    string | null
  >(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "jadwal":
        return <FaCalendarAlt className="text-blue-500" />;
      case "peringatan":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "sistem":
        return <FaCog className="text-purple-500" />;
      case "info":
        return <FaInfoCircle className="text-green-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "jadwal":
        return "bg-blue-100";
      case "peringatan":
        return "bg-yellow-100";
      case "sistem":
        return "bg-purple-100";
      case "info":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  const handleViewNotification = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (notificationToDelete) {
      deleteNotification(notificationToDelete);
      setShowDeleteModal(false);
      setNotificationToDelete(null);
    }
  };

  const handleDeleteAllClick = () => {
    setShowDeleteAllModal(true);
  };

  const handleConfirmDeleteAll = () => {
    deleteAllNotifications();
    setShowDeleteAllModal(false);
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType ? notification.type === filterType : true;

    const matchesReadStatus = showUnreadOnly ? !notification.read : true;

    return matchesSearch && matchesType && matchesReadStatus;
  });

  return (
    <div className="container mx-auto p-4 bg-[#F2F2F2]">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C3930]">
              <FaBell className="inline-block mr-2 text-[#4F959D]" />
              Notifikasi
            </h1>
            <p className="text-gray-600 mt-1">Kelola semua notifikasi sistem</p>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari notifikasi..."
                className="pl-10 pr-4 py-2 border border-white rounded-lg focus:outline-none ring-1 ring-gray-400 focus:ring-1 focus:ring-[#4F959D] w-full md:w-64 text-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => markAllAsRead()}
                className="bg-[#4F959D] text-white px-4 py-2 rounded-lg hover:bg-[#3C7A85] transition flex items-center justify-center"
                disabled={loading}
              >
                <FaCheck className="mr-2" /> Tandai Semua Dibaca
              </button>
              <button
                onClick={handleDeleteAllClick}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                disabled={loading || notifications.length === 0}
              >
                <FaTrash className="mr-2" /> Hapus Semua
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold text-[#2C3930] flex items-center">
              <FaFilter className="mr-2 text-[#4F959D]" /> Filter Notifikasi
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterType(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterType === null
                  ? "bg-[#4F959D] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType("jadwal")}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                filterType === "jadwal"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              <FaCalendarAlt className="mr-2" /> Jadwal
            </button>
            <button
              onClick={() => setFilterType("peringatan")}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                filterType === "peringatan"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
            >
              <FaExclamationTriangle className="mr-2" /> Peringatan
            </button>
            <button
              onClick={() => setFilterType("sistem")}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                filterType === "sistem"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              <FaCog className="mr-2" /> Sistem
            </button>
            <button
              onClick={() => setFilterType("info")}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                filterType === "info"
                  ? "bg-green-500 text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              <FaInfoCircle className="mr-2" /> Info
            </button>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showUnreadOnly}
                onChange={() => setShowUnreadOnly(!showUnreadOnly)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F959D]"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">
                Hanya belum dibaca
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-[#2C3930] mb-4 flex items-center">
          <FaBell className="mr-2 text-[#4F959D]" /> Daftar Notifikasi
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-[#4F959D] text-2xl" />
            <span className="ml-2 text-gray-600">Memuat notifikasi...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            <p className="flex items-center">
              <FaExclamationTriangle className="mr-2" /> {error}
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <FaBell className="text-gray-400 text-4xl mx-auto mb-2" />
            <p className="text-gray-500">
              {notifications.length === 0
                ? "Tidak ada notifikasi"
                : "Tidak ada notifikasi yang sesuai dengan filter"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.read ? "border-gray-200" : "border-blue-300"
                } hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start">
                  <div
                    className={`p-3 rounded-full ${getNotificationBgColor(
                      notification.type
                    )} mr-4`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-medium ${
                          !notification.read
                            ? "text-[#2C3930]"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewNotification(notification)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Lihat Detail"
                        >
                          <FaEye size={16} />
                        </button>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Tandai Sudah Dibaca"
                          >
                            <FaCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(notification.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Hapus"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1 text-sm">
                      {notification.message}
                    </p>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {notification.date} • {notification.time}
                      </span>
                      {!notification.read && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          Belum dibaca
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-full ${getNotificationBgColor(
                      selectedNotification.type
                    )} mr-3`}
                  >
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <h3 className="text-lg font-semibold text-[#2C3930]">
                    {selectedNotification.title}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <div className="mb-4">
                <p className="text-gray-700">{selectedNotification.message}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>
                  {selectedNotification.date} • {selectedNotification.time}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    selectedNotification.read
                      ? "bg-gray-100 text-gray-600"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedNotification.read ? "Sudah dibaca" : "Belum dibaca"}
                </span>
              </div>
              {selectedNotification.type === "jadwal" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">
                    <FaInfoCircle className="inline mr-2" /> Notifikasi ini
                    terkait dengan jadwal yang telah digenerate.
                  </p>
                  <Link
                    href="/admin/generate_schedule"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Lihat halaman Generate Jadwal
                  </Link>
                </div>
              )}
            </div>
            <div className="bg-gray-100 px-6 py-3 rounded-b-lg flex justify-end space-x-2">
              {!selectedNotification.read && (
                <button
                  onClick={() => {
                    markAsRead(selectedNotification.id);
                    setSelectedNotification({
                      ...selectedNotification,
                      read: true,
                    });
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  <FaCheck className="inline mr-2" /> Tandai Dibaca
                </button>
              )}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleDeleteClick(selectedNotification.id);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <FaTrash className="inline mr-2" /> Hapus
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus notifikasi ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Konfirmasi Hapus Semua
              </h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus semua notifikasi? Tindakan ini
                tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteAll}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
