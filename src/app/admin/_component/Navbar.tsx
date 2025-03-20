"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Building, Calendar, LogOut } from "lucide-react"; // Import ikon
import { JSX } from "react";

type LinkItemType = {
  name: string;
  href: string;
  icon: JSX.Element;
};

const linkData: LinkItemType[] = [
  { name: "beranda", href: "/admin/home", icon: <Home size={18} /> },
  {
    name: "kelola dosen",
    href: "/admin/manage_lecturers",
    icon: <Users size={18} />,
  },
  {
    name: "kelola ruangan",
    href: "/admin/manage_room",
    icon: <Building size={18} />,
  },
  {
    name: "generate jadwal",
    href: "/admin/generate_schedule",
    icon: <Calendar size={18} />,
  },
  { name: "logout", href: "/", icon: <LogOut size={18} /> },
];

export default function NavigationBar() {
  const currentPath = usePathname();

  return (
    <nav className="bg-[#4F959D] text-white shadow-md h-14 flex items-center">
      <div className="container flex justify-between items-center px-4">
        <h1 className="text-xl font-bold">Sistem Penjadwalan</h1>
        <ul className="flex space-x-6 h-full">
          {linkData.map((item, index) => (
            <li
              key={index}
              className="relative group flex flex-col justify-center h-full py-4 px-2"
            >
              <Link
                href={item.href}
                className={`flex items-center gap-2 capitalize transition-transform duration-200 group-hover:-translate-y-0.5 ${
                  item.href === currentPath
                    ? "text-[#205781]"
                    : "hover:text-[#98D2C0]"
                }`}
              >
                {item.icon} {/* Menampilkan ikon */}
                {item.name}
              </Link>
              <span className="absolute left-1/2 bottom-2 w-0 h-[2px] bg-[#98D2C0] transition-all duration-300 group-hover:w-1/2 -translate-x-1/2"></span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
