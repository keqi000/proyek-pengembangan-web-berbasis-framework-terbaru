"use client";

import Link from "next/link";
import { FC } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaHome,
  FaTools,
  FaInfoCircle,
} from "react-icons/fa";

const Navbar: FC = () => {
  return (
    <>
      {/* Header Section */}
      <header className="bg-[#2C3930] text-white py-4 font-bebas">
        <div className="container flex justify-between items-center px-4">
          <div className="flex space-x-6">
            <Link href="#" className="flex items-center">
              <FaPhone className="mr-2" />
              <span>Call: 082290581860</span>
            </Link>
            <Link href="#" className="flex items-center">
              <FaEnvelope className="mr-2" />
              <span>Email: febrianhemeto04@gmail.com</span>
            </Link>
            <Link href="#" className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span>Location</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Navbar Section */}
      <nav className="bg-white py-4 shadow-md">
        <div className="container flex justify-between items-center px-4">
          <Link
            href="/user/home"
            className="text-4xl font-bold text-black flex items-center font-bebas"
          >
            SISTEM PENJADWALAN KULIAH
          </Link>
          <div className="flex flex-row space-x-6 font-poppins">
            <Link
              href="/"
              className="py-2 text-black hover:text-[#3F4F44] flex items-center"
            >
              <FaHome className="mr-2" /> Home
            </Link>
            <Link
              href="/services"
              className="py-2 text-black hover:text-[#3F4F44] flex items-center"
            >
              <FaTools className="mr-2" /> Services
            </Link>
            <Link
              href="/about"
              className="py-2 text-black hover:text-[#3F4F44] flex items-center"
            >
              <FaInfoCircle className="mr-2" /> About
            </Link>
            <Link
              href="/contact"
              className="py-2 text-black hover:text-[#3F4F44] flex items-center"
            >
              <FaPhone className="mr-2" /> Contact Us
            </Link>
            <Link
              href="#"
              className="py-2 text-black hover:text-[#3F4F44] flex items-center"
            >
              <FaUser className="mr-2" /> Login
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
