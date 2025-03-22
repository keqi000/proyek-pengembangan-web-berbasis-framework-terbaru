"use client";

import { useState } from "react";
import NavigationBar from "./_component/Navbar";
import { User } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-700 w-full max-w-full overflow-hidden">
      {/* Sidebar */}
      <NavigationBar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Konten utama yang bergeser */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <nav className="bg-[#4F959D] text-white shadow-md h-14 flex items-center px-4">
          <div className="container flex justify-between items-center">
            {/* Tombol Sidebar */}
            <button
              className="text-white focus:outline-none"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>

            {/* Hanya Ikon User dan Nama */}
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Yonatan Sihotang</span>
            </div>
          </div>
        </nav>

        {/* Konten utama */}
        <main className="flex flex-col p-4 flex-grow max-w-full bg-gray-100">
          {children}
        </main>

        {/* Footer selalu di bawah tanpa menyebabkan scroll berlebihan */}
        <footer className="flex flex-col bg-gray-200 text-center p-3">
          <p className="text-gray-700">
            &copy; {new Date().getFullYear()} Sistem Penjadwalan Otomatis
          </p>
        </footer>
      </div>
    </div>
  );
}
