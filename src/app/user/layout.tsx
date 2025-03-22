import { FC, ReactNode } from "react";
import Navbar from "./_component/navbar";

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
      <footer className="bg-[#2C3930] text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} Sistem Penjadwalan Otomatis</p>
      </footer>
    </div>
  );
};

export default Layout;
