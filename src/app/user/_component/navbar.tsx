"use client";

import Link from "next/link";
import { FC, useState, useRef, useEffect } from "react";
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
  FaChevronDown,
} from "react-icons/fa";

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to determine if a link is active
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white py-3 sm:py-4 shadow-md relative">
      <div className="flex justify-between items-center px-4">
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
              isActive("/user/schedule")
                ? "text-[#3F4F44] font-medium"
                : "text-black hover:text-[#3F4F44]"
            }`}
          >
            <FaCalendarAlt className="mr-2" /> Jadwal Kuliah
          </Link>
          <Link
            href="/user/cetak_jadwal"
            className={`py-2 flex items-center ${
              isActive("/user/cetak_jadwal")
                ? "text-[#3F4F44] font-medium"
                : "text-black hover:text-[#3F4F44]"
            }`}
          >
            <FaPrint className="mr-2" /> Cetak Jadwal
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleUserDropdown}
              className="py-2 flex items-center text-black hover:text-[#3F4F44]"
            >
              <FaUser className="mr-2" />
              <span className="truncate">Yonatan</span>
              <FaChevronDown className="ml-2" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-30 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </Link>
              </div>
            )}
          </div>
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
                isActive("/user/schedule")
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
                isActive("/user/cetak_jadwal")
                  ? "text-[#3F4F44] font-medium"
                  : "text-black hover:text-[#3F4F44]"
              }`}
              onClick={toggleMenu}
            >
              <FaPrint className="mr-2" /> Cetak Jadwal
            </Link>

            {/* User info with dropdown in mobile */}
            <div
              className="py-3 border-b border-gray-100"
              ref={mobileDropdownRef}
            >
              <button
                onClick={toggleUserDropdown}
                className="w-full flex items-center justify-between text-black hover:text-[#3F4F44]"
              >
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span className="truncate">Yonatan</span>
                </div>
                <FaChevronDown />
              </button>

              {isUserDropdownOpen && (
                <div className="mt-2 py-2 border-t border-gray-100 flex justify-center">
                  <Link
                    href="/"
                    className="flex items-center text-black hover:text-[#3F4F44]"
                    onClick={toggleMenu}
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
