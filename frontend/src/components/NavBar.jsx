import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Wallet2, Menu, X } from "lucide-react";
import Layout from "./Rent/Layout";

const NavBar = () => {
  const pathname = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuList = [
    { name: "Home", path: "/" },
    { name: "Rent", path: "/Rent" },
    { name: "Provider", path: "/Provider" },
    { name: "About", path: "/About" },
  ];

  return (
    <div className="w-full flex justify-center">
      <nav
        className={`fixed top-4 z-50 w-full md:w-[60%] mx-auto rounded-full bg-[#F7F4F3] shadow-lg lg:backdrop-blur-3xl transition-opacity duration-1000`}
      >
        <div className="flex justify-between items-center px-6 py-3">
          <h1 className="text-lg font-bold text-[#5B2333]">DecnAIX</h1>

          {/* Hamburger Menu Icon for mobile */}
          <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="text-[#5B2333]" size={30} />
            ) : (
              <Menu className="text-[#5B2333]" size={30} />
            )}
          </div>

          {/* Mobile Button (appears when menu is open) */}
          {isOpen && (
            <div className="w-full text-center mb-4">
              <Button
                asChild
                className="flex items-center justify-center gap-2 px-6 bg-white border-4 offsetstyle generalBorder text-black hover:text-[#F7F4F3] hover:bg-[#5B2333]"
              >
                <Link to="">
                  Connect Wallet
                  <Wallet2 />
                </Link>
              </Button>
            </div>
          )}

          {/* Navigation links */}
          <ul
            className={`${
              isOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row items-center gap-6 text-gray-700 absolute md:static top-16 left-0 w-full bg-[#F7F4F3] md:bg-transparent md:w-auto md:top-auto md:gap-6 p-4 md:p-0`}
          >
            {menuList.map((menu, key) => (
              <NavLink
                to={menu.path}
                key={key}
                onClick={() => setIsOpen(false)}
              >
                <li
                  className={`${
                    pathname.pathname === menu.path
                      ? "scale-125 text-[#5B2333] font-semibold"
                      : "text-gray-700 font-medium"
                  }`}
                >
                  {menu.name}
                </li>
              </NavLink>
            ))}
          </ul>

          {/* Connect Wallet Button (appears on larger screens) */}
          <div className="md:block hidden">
            <Button
              asChild
              className="flex items-center gap-2 px-6 bg-white border-4 offsetstyle generalBorder text-black hover:text-[#F7F4F3] hover:bg-[#5B2333]"
            >
              <Link to="">
                Connect Wallet
                <Wallet2 />
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
