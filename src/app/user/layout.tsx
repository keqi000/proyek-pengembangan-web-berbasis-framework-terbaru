import { FC, ReactNode } from "react";
import Navbar from "./_component/navbar";
import UserFooter from "./_component/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Main Content */}
      <main className="flex-1 max-w-full w-full mx-auto">
        {children}
      </main>
      <UserFooter />
      
    </div>
  );
};

export default Layout;
