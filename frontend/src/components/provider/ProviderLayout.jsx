import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../commons/Header";
import ProviderTabs from "./ProviderTabs";

const ProviderLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col dark:text-white font-extrabold">
      <div className="w-full fixed top-0 left-0 right-0 shadow-md z-1000">
      <Header Tabs={ProviderTabs}/>
      </div>

      <div className="flex-grow overflow-auto w-full pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default ProviderLayout;
