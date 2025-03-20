"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Building, Calendar, LogOut } from "lucide-react";
import { JSX } from "react";

type NavbarProps = {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
};

type LinkItemType = {
  name: string;
  href: string;
  icon: JSX.Element;
};

const linkData: LinkItemType[] = [
  { name: "Beranda", href: "/admin/home", icon: <Home size={18} /> },
  {
    name: "Kelola Dosen",
    href: "/admin/manage_lecturers",
    icon: <Users size={18} />,
  },
  {
    name: "Kelola Ruangan",
    href: "/admin/manage_room",
    icon: <Building size={18} />,
  },
  {
    name: "Generate Jadwal",
    href: "/admin/generate_schedule",
    icon: <Calendar size={18} />,
  },
  { name: "Logout", href: "/", icon: <LogOut size={18} /> },
];

export default function NavigationBar({
  isSidebarOpen,
  setSidebarOpen,
}: NavbarProps) {
  const currentPath = usePathname();

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white text-black shadow-[5px_0_15px_rgba(0,0,0,0.3)] border-r border-gray-300 transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Tombol Tutup */}
        <div className="flex p-3.5 justify-center bg-[#4F959D]">
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Sistem Penjadwalan
          </h1>
        </div>

        {/* Daftar Menu */}
        <ul className="mt-2 w-[240px] mx-auto">
          {linkData.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 p-2 rounded-md transition-all text-xs sm:text-sm md:text-base ${
                  item.href === currentPath
                    ? "bg-[#4F959D] text-white"
                    : "hover:bg-gray-200 hover:text-black"
                }`}
              >
                {item.icon}
                <span className="text-xs sm:text-sm md:text-base">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
