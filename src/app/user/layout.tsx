import { FC, ReactNode } from "react";
import Link from "next/link";
import Navbar from "./_component/navbar";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 container mx-auto">{children}</main>

      {/* Footer */}
      <footer className="bg-[#2C3930] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: About */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
                Tentang Kami
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Sistem Penjadwalan Otomatis adalah platform yang dirancang untuk
                memudahkan pengelolaan jadwal perkuliahan secara efisien dan
                efektif.
              </p>
            </div>

            {/* Column 2: Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
                Kontak
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <FaEnvelope className="mr-2 text-[#4F959D]" />
                  <span>Email: Yonatan@gmail.com</span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="mr-2 text-[#4F959D]" />
                  <span>Telepon: (021) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[#4F959D]" />
                  <span>Alamat: Jl. Pendidikan No. 123, Jakarta</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
                Link Cepat
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link
                    href="/user/home"
                    className="hover:text-[#4F959D] transition-colors"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-[#4F959D] transition-colors"
                  >
                    Mata Kuliah
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-[#4F959D] transition-colors"
                  >
                    Jadwal Kuliah
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-[#4F959D] transition-colors"
                  >
                    Cetak Jadwal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-gray-600">
            <Link href="#" className="hover:text-[#4F959D] transition-colors">
              <FaFacebook size={20} />
            </Link>
            <Link href="#" className="hover:text-[#4F959D] transition-colors">
              <FaTwitter size={20} />
            </Link>
            <Link href="#" className="hover:text-[#4F959D] transition-colors">
              <FaInstagram size={20} />
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6 text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Sistem Penjadwalan Otomatis. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
