import React from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-[100vh] flex flex-col justify-between items-center pb-10 dark:text-white font-extrabold">
      <Header />

      {/* Main Content Centered */}
      <div className="mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
