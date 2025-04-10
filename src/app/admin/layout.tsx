"use client";

import { useState, useEffect } from "react";
import NavigationBar from "./admin_component/Navbar";
import { Bell } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const userName = "Yonatan Sihotang"; // Bisa diambil dari context/state global

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

  return (
    <div className="flex min-h-screen bg-gray-100 w-full max-w-full overflow-hidden">
      {/* Navbar Component */}
      <NavigationBar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
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
              <button className="relative p-1 text-white rounded-full hover:bg-[#3F4F44] transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

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
