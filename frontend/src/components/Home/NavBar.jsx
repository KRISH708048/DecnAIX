import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { Wallet2, Menu, X, User, LogOut } from "lucide-react";
import { userAtom } from "@/store/authAtom";
import { usePersistedRecoilState } from "@/store/recoilPersist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = usePersistedRecoilState(userAtom);

  const menuList = [
    { name: "Home", path: "/" },
    { name: "Rent", path: "/rent" },
    { name: "Provider", path: "/provider" },
    { name: "About", path: "/about" },
  ];

  const handleLogout = () => {
    setUser({
      id: null,
      name: "",
      email: "",
      role: "",
      token: "",
    });
  };

  const UserDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 rounded-full h-10 w-10 bg-[#d49c79] text-[#5b2333] hover:bg-[#e8b088]"
          aria-label="User Menu"
        >
          {user?.name ? (
            <span className="font-semibold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 bg-[#5b2333] border-[#d49c79] text-white z-[1000]"
        align="end"
      >
        <div className="px-2 py-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full h-8 w-8 flex items-center justify-center bg-[#d49c79] text-[#5b2333]">
              {user?.name ? (
                <span className="font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="font-medium">{user.name || "User"}</p>
              <p className="text-xs text-gray-300">{user.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-[#d49c79]" />
        <DropdownMenuItem asChild>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-2 py-1.5 hover:bg-[#7a3b4b] rounded"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="w-full flex justify-center">
      <nav className="fixed top-0 z-50 w-full bg-[#5b2333] text-[#d49c79] shadow-lg backdrop-blur-md md:rounded-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold">DecnAIX</h1>

          {/* Hamburger Icon */}
          <button
            className="md:hidden z-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="text-[#e5b89c]" size={28} />
            ) : (
              <Menu className="text-[#e5b89c]" size={28} />
            )}
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6">
            {menuList.map(({ name, path }) => (
              <NavLink
                to={path}
                key={name}
                className={({ isActive }) =>
                  isActive ? "text-xl font-semibold underline" : "font-medium"
                }
              >
                {name}
              </NavLink>
            ))}
          </ul>

          {/* Desktop User Dropdown */}
          <div className="hidden md:block">
            <UserDropdown />
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-[64px] left-0 w-full bg-[#e5b89c] text-[#5b2333] py-4 shadow-xl z-40">
            <ul className="flex flex-col items-center gap-6">
              {menuList.map(({ name, path }) => (
                <NavLink
                  to={path}
                  key={name}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "text-lg font-semibold underline" : "text-base"
                  }
                >
                  {name}
                </NavLink>
              ))}
              <li className="mt-4 flex flex-col items-center gap-2">
                {user?.id ? (
                  <>
                    <h3 className="font-semibold text-lg">
                      Hey, {user.name.split(" ")[0]}
                    </h3>
                    <Button
                      variant="outline"
                      className="text-[#5b2333] border-[#5b2333] hover:bg-[#5b2333] hover:text-white"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <NavLink to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="flex items-center gap-2 bg-white text-black border-2 hover:text-white hover:bg-[#5B2333]">
                      Login
                      <Wallet2 />
                    </Button>
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
