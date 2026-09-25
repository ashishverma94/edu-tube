import { ReactNode } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      {children}

      <Footer />
    </div>
  );
};

export default Layout;
