"use client";

import { useState } from "react";
import NavigationBar from "./_component/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <NavigationBar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Konten utama yang bergeser */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <nav className="bg-[#4F959D] text-white shadow-md h-14 flex items-center px-4">
          <div className="container flex justify-between items-center">
            <button
              className="text-white focus:outline-none"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
          </div>
        </nav>

        {/* Konten utama */}
        <main className="p-4 flex-grow">{children}</main>

        {/* Footer selalu di bawah tanpa menyebabkan scroll berlebihan */}
        <footer className="bg-gray-200 text-center p-3">
          <p className="text-gray-700">
            &copy; 2025 Sistem Penjadwalan Otomatis
          </p>
        </footer>
      </div>
    </div>
  );
}
