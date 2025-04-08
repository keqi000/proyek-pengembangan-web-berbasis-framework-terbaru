"use client";

import Link from "next/link";
import { FC, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaHome,
  FaBook,
  FaCalendarAlt,
  FaPrint,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to determine if a link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Header Section */}
      <header className="bg-[#2C3930] text-white py-2 sm:py-4 font-bebas">
        <div className="container flex flex-col sm:flex-row justify-between items-start sm:items-center px-4">
          <div className="flex flex-col sm:flex-row sm:space-x-6 text-xs sm:text-base">
            <Link href="#" className="flex items-center">
              <FaUser className="mr-2" />
              <span className="truncate">Yonatan Hot Gabe Sihotang</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Navbar Section */}
      <nav className="bg-white py-3 sm:py-4 shadow-md relative">
        <div className="container flex justify-between items-center px-4">
          <Link
            href="/user/home"
            className="text-xl sm:text-2xl md:text-4xl font-bold text-black flex items-center font-bebas"
          >
            <span className="hidden sm:inline">SISTEM PENJADWALAN KULIAH</span>
            <span className="sm:hidden">SISTEM PENJADWALAN KULIAH</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="sm:hidden text-black focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="hidden sm:flex flex-row space-x-4 md:space-x-6 font-poppins text-sm md:text-base">
            <Link
              href="/user/home"
              className={`py-2 flex items-center ${
                isActive("/user/home")
                  ? "text-[#3F4F44] font-medium"
                  : "text-black hover:text-[#3F4F44]"
              }`}
            >
              <FaHome className="mr-2" /> Beranda
            </Link>
            <Link
              href="/user/course"
              className={`py-2 flex items-center ${
                isActive("/user/course")
                  ? "text-[#3F4F44] font-medium"
                  : "text-black hover:text-[#3F4F44]"
              }`}
            >
              <FaBook className="mr-2" /> Mata Kuliah
            </Link>
            <Link
              href="/user/schedule"
              className={`py-2 flex items-center ${
                isActive("/about")
                  ? "text-[#3F4F44] font-medium"
                  : "text-black hover:text-[#3F4F44]"
              }`}
            >
              <FaCalendarAlt className="mr-2" /> Jadwal Kuliah
            </Link>
            <Link
              href="/user/cetak_jadwal"
              className={`py-2 flex items-center ${
                isActive("/contact")
                  ? "text-[#3F4F44] font-medium"
                  : "text-black hover:text-[#3F4F44]"
              }`}
            >
              <FaPrint className="mr-2" /> Cetak Jadwal
            </Link>
            <Link
              href="/"
              className={`py-2 flex items-center ${
                isActive("/login")
                  ? "text-[#3F4F44] font-medium"
                  : "text-black hover:text-[#3F4F44]"
              }`}
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50 border-t border-gray-200 font-poppins">
            <div className="flex flex-col px-4 py-2">
              <Link
                href="/user/home"
                className={`py-3 border-b border-gray-100 flex items-center ${
                  isActive("/user/home")
                    ? "text-[#3F4F44] font-medium"
                    : "text-black hover:text-[#3F4F44]"
                }`}
                onClick={toggleMenu}
              >
                <FaHome className="mr-2" /> Beranda
              </Link>
              <Link
                href="/user/course"
                className={`py-3 border-b border-gray-100 flex items-center ${
                  isActive("/user/course")
                    ? "text-[#3F4F44] font-medium"
                    : "text-black hover:text-[#3F4F44]"
                }`}
                onClick={toggleMenu}
              >
                <FaBook className="mr-2" /> Mata Kuliah
              </Link>
              <Link
                href="/user/schedule"
                className={`py-3 border-b border-gray-100 flex items-center ${
                  isActive("/about")
                    ? "text-[#3F4F44] font-medium"
                    : "text-black hover:text-[#3F4F44]"
                }`}
                onClick={toggleMenu}
              >
                <FaCalendarAlt className="mr-2" /> Jadwal Kuliah
              </Link>
              <Link
                href="/user/cetak_jadwal"
                className={`py-3 border-b border-gray-100 flex items-center ${
                  isActive("/contact")
                    ? "text-[#3F4F44] font-medium"
                    : "text-black hover:text-[#3F4F44]"
                }`}
                onClick={toggleMenu}
              >
                <FaPrint className="mr-2" /> Cetak Jadwal
              </Link>
              <Link
                href="/"
                className={`py-3 flex items-center ${
                  isActive("/login")
                    ? "text-[#3F4F44] font-medium"
                    : "text-black hover:text-[#3F4F44]"
                }`}
                onClick={toggleMenu}
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
