"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Globe,
  Shield,
  Save,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import AdminLayout from "../settings/layout";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "Yonatan Sihotang",
    email: "yonatan.admin@university.ac.id",
    phone: "081234567890",
    position: "Administrator",
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    scheduleUpdates: true,
    systemAlerts: true,
    conflictAlerts: true,
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    language: "id",
    theme: "light",
    autoLogout: "30",
    dataBackup: "daily",
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
  });

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSystemChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSystemSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSecurityChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setSecuritySettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Pengaturan Sistem
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola preferensi dan konfigurasi sistem penjadwalan
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "profile"
                      ? "bg-[#2C3930] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User size={18} className="mr-3" />
                  Profil Admin
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "notifications"
                      ? "bg-[#2C3930] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Bell size={18} className="mr-3" />
                  Notifikasi
                </button>
                <button
                  onClick={() => setActiveTab("system")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "system"
                      ? "bg-[#2C3930] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Globe size={18} className="mr-3" />
                  Sistem
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    activeTab === "security"
                      ? "bg-[#2C3930] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Shield size={18} className="mr-3" />
                  Keamanan
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Profil Administrator
                  </h2>
                  <p className="text-gray-600">
                    Kelola informasi profil dan kontak Anda
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="position"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Jabatan
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={profileData.position}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Ubah Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Password Saat Ini
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Password Baru
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Pengaturan Notifikasi
                  </h2>
                  <p className="text-gray-600">
                    Kelola preferensi notifikasi dan pemberitahuan sistem
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Notifikasi Email
                        </h3>
                        <p className="text-sm text-gray-600">
                          Terima notifikasi melalui email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F959D]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F959D]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Pembaruan Jadwal
                        </h3>
                        <p className="text-sm text-gray-600">
                          Notifikasi saat ada perubahan jadwal
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="scheduleUpdates"
                          checked={notificationSettings.scheduleUpdates}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F959D]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F959D]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Peringatan Sistem
                        </h3>
                        <p className="text-sm text-gray-600">
                          Notifikasi tentang pemeliharaan sistem
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="systemAlerts"
                          checked={notificationSettings.systemAlerts}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F959D]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F959D]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Peringatan Konflik
                        </h3>
                        <p className="text-sm text-gray-600">
                          Notifikasi saat terjadi konflik jadwal
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="conflictAlerts"
                          checked={notificationSettings.conflictAlerts}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F959D]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F959D]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === "system" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Pengaturan Sistem
                  </h2>
                  <p className="text-gray-600">
                    Konfigurasi preferensi sistem dan tampilan
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Bahasa
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={systemSettings.language}
                        onChange={handleSystemChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                      >
                        <option value="id">Bahasa Indonesia</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="theme"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tema
                      </label>
                      <select
                        id="theme"
                        name="theme"
                        value={systemSettings.theme}
                        onChange={handleSystemChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                      >
                        <option value="light">Terang</option>
                        <option value="dark">Gelap</option>
                        <option value="system">Ikuti Sistem</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="autoLogout"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Auto Logout (menit)
                      </label>
                      <input
                        type="number"
                        id="autoLogout"
                        name="autoLogout"
                        value={systemSettings.autoLogout}
                        onChange={handleSystemChange}
                        min="5"
                        max="120"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="dataBackup"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Backup Data
                      </label>
                      <select
                        id="dataBackup"
                        name="dataBackup"
                        value={systemSettings.dataBackup}
                        onChange={handleSystemChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                      >
                        <option value="daily">Harian</option>
                        <option value="weekly">Mingguan</option>
                        <option value="monthly">Bulanan</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Pemeliharaan Sistem
                    </h3>
                    <div className="flex flex-col md:flex-row gap-4">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4F959D] hover:bg-[#3d7a80] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F959D]"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Reset Cache Sistem
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4F959D] hover:bg-[#3d7a80] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F959D]"
                      >
                        <Save size={16} className="mr-2" />
                        Backup Database Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Pengaturan Keamanan
                  </h2>
                  <p className="text-gray-600">
                    Kelola pengaturan keamanan dan privasi akun
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Autentikasi Dua Faktor
                        </h3>
                        <p className="text-sm text-gray-600">
                          Tingkatkan keamanan dengan verifikasi dua langkah
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="twoFactorAuth"
                          checked={securitySettings.twoFactorAuth}
                          onChange={handleSecurityChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4F959D]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F959D]"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label
                          htmlFor="sessionTimeout"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Timeout Sesi (menit)
                        </label>
                        <select
                          id="sessionTimeout"
                          name="sessionTimeout"
                          value={securitySettings.sessionTimeout}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                        >
                          <option value="15">15 menit</option>
                          <option value="30">30 menit</option>
                          <option value="60">1 jam</option>
                          <option value="120">2 jam</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="passwordExpiry"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Masa Berlaku Password (hari)
                        </label>
                        <select
                          id="passwordExpiry"
                          name="passwordExpiry"
                          value={securitySettings.passwordExpiry}
                          onChange={handleSecurityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#4F959D] focus:border-[#4F959D] text-gray-600"
                        >
                          <option value="30">30 hari</option>
                          <option value="60">60 hari</option>
                          <option value="90">90 hari</option>
                          <option value="180">180 hari</option>
                          <option value="365">365 hari</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 mt-6">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Log Aktivitas
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Lihat riwayat aktivitas login dan perubahan sistem
                      </p>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F959D]"
                      >
                        Lihat Log Aktivitas
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-5 border-t border-gray-200">
                <div className="flex justify-end">
                  {saveSuccess && (
                    <div className="mr-4 flex items-center text-green-600">
                      <CheckCircle size={16} className="mr-1" />
                      <span>Pengaturan berhasil disimpan</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2C3930] hover:bg-[#1a2119] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C3930]"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Simpan Pengaturan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
