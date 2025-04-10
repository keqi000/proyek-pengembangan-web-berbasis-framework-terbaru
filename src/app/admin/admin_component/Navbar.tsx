"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Building,
  Calendar,
  LogOut,
  X,
  Settings,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { JSX, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavbarProps = {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  userName: string;
  toggleNotifications?: () => void;
  unreadCount?: number;
};

type LinkItemType = {
  name: string;
  href: string;
  icon: JSX.Element;
  description?: string;
};

const linkData: LinkItemType[] = [
  {
    name: "Beranda",
    href: "/admin/home",
    icon: <Home size={20} />,
    description: "Dashboard utama sistem",
  },
  {
    name: "Kelola Dosen",
    href: "/admin/lecturers",
    icon: <Users size={20} />,
    description: "Manajemen data dosen",
  },
  {
    name: "Kelola Mata Kuliah",
    href: "/admin/manage_subject",
    icon: <BookOpen size={20} />,
    description: "Manajemen mata kuliah",
  },
  {
    name: "Kelola Ruangan",
    href: "/admin/rooms",
    icon: <Building size={20} />,
    description: "Manajemen ruangan kuliah",
  },
  {
    name: "Generate Jadwal",
    href: "/admin/generate_schedule",
    icon: <Calendar size={20} />,
    description: "Buat jadwal perkuliahan otomatis",
  },
  {
    name: "Logout",
    href: "/",
    icon: <LogOut size={20} />,
    description: "Keluar dari sistem",
  },
];

export default function NavigationBar({
  isSidebarOpen,
  setSidebarOpen,
  userName = "Yonatan Sihotang",
}: NavbarProps) {
  const currentPath = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const linkVariants = {
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
    closed: { opacity: 0, y: 20 },
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          className="fixed top-0 left-0 w-64 h-full bg-white text-black shadow-lg z-50"
          initial={{ x: "-100%" }}
          animate={isSidebarOpen ? "open" : "closed"}
          variants={sidebarVariants}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-[#2C3930]">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-white mr-2" />
              <h1 className="text-lg font-bold text-white">
                Sistem Penjadwalan
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-[#4F959D] flex items-center justify-center text-white font-bold">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Menu Utama
            </h3>
            <ul className="space-y-2">
              {linkData.slice(0, -1).map((item, index) => (
                <motion.li
                  key={index}
                  custom={index}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      item.href === currentPath
                        ? "bg-[#2C3930] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`${
                        item.href === currentPath
                          ? "text-white"
                          : "text-[#4F959D]"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <span className="block text-sm font-medium">
                        {item.name}
                      </span>
                      {item.description && (
                        <span
                          className={`text-xs ${
                            item.href === currentPath
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="py-8 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Lainnya
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <Settings size={20} className="text-[#4F959D]" />
                    <span className="text-sm font-medium">Pengaturan</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/help"
                    className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    <HelpCircle size={20} className="text-[#4F959D]" />
                    <span className="text-sm font-medium">Bantuan</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
            © {new Date().getFullYear()} Sistem Penjadwalan
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
