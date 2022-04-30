import React from "react";
import Navbar from "./appbar";
import Footer from "./footer";

type props = React.PropsWithChildren<{}>;

const Layout: React.FC<props> = ({ children }) => {
  return (
    <div className="lg:h-screen overflow-hidden bg-deeppurpel text-gray-300">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
