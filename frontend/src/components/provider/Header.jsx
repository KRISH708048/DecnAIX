import React, { useState } from "react";
// import Features from "./Features/Features";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { PanelLeftOpen, PanelTopOpen, Wallet2 } from "lucide-react";
import { Home, Info, LogOut, Server } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProviderTabs from "./ProviderTabs";
import ProviderTransactions from "./Screens/ProviderTransactions";
import Computation from "./Screens/Computation";
import Machine from "./Screens/Machine";
// import SelectMachine from "./Screens/SelectMachine";
// import CreateTask from "./Screens/CreateTask";

const tabs = [
  <ProviderTransactions key={0} />,
  <Machine key={1} />,
  <Computation key={2} />,
];
const Header = () => {
  const [activeTab, setActiveTab] = useState(-1);
  return (
    <div className="h-16 px-6 flex justify-between items-center w-full shadow-sm">
      {/* Left: Logo & Menu */}
      <div className="flex items-center gap-1">
        {/* Dropdown Navigation */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-white hover:text-gray-300"
            >
              <PanelTopOpen size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="m-2 p-2 w-40 bg-[#5e1e30] text-white shadow-xl rounded-lg  ">
            <DropdownMenuLabel className="text-lg font-semibold text-gray-300">
              Navigation
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="border-gray-700" />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#321d21]"
                >
                  <Home size={20} /> <span>Home</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/rent"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                  <Server size={20} /> <span>Rent</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link
                  to="/about"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800"
                >
                  <Info size={20} /> <span>About</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="border-gray-700" />
            <DropdownMenuItem asChild>
              <Link
                to="/logout"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-700"
              >
                <LogOut size={20} /> <span>Log Out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logo */}
        <h1 className="text-[#d49c79] text-2xl font-extrabold tracking-wide">
          DecnAIX
        </h1>
      </div>

      {/* Right: Features & Wallet */}
      <div className="flex items-center gap-4">
        {/* Features for Desktop */}
        <div className="hidden md:flex">
          <ProviderTabs
            activeIdx={activeTab}
            onChange={(val) => {
              setActiveTab(val);
            }}
          />
        </div>
        <NavLink to={"/auth"} className="hidden md:flex">
        <Button className="flex items-center gap-2 px-5 py-2 bg-[#F7F4F3] border-2 border-transparent rounded-lg text-[#3C1A2B] font-semibold transition-all hover:bg-[#5B2333] hover:text-white hover:border-white">
          SignIn
        </Button>
        </NavLink>
        {/* Connect Wallet Button */}
        <Button className="flex items-center gap-2 px-5 py-2 bg-[#F7F4F3] border-2 border-transparent rounded-lg text-[#3C1A2B] font-semibold transition-all hover:bg-[#5B2333] hover:text-white hover:border-white">
          Connect Wallet <Wallet2 size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
