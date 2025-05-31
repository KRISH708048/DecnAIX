import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut, User, Wallet2 } from "lucide-react"; // <--- added Wallet2
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userAtom } from "@/store/authAtom";
import { usePersistedRecoilState } from "@/store/recoilPersist";
import { ethers } from "ethers"; // <--- import ethers

const Header = ({ Tabs }) => {
  const [activeTab, setActiveTab] = useState(-1);
  const [user, setUser] = usePersistedRecoilState(userAtom);
  const [walletAddress, setWalletAddress] = useState(""); // <--- new state
  const isAuthenticated = user?.userId;
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser({
      id: null,
      name: "",
      email: "",
      role: "",
      token: "",
    });
    setWalletAddress("");
    navigate("/auth");
  };

  const connectMetask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        console.log("Connected to MetaMask:", accounts[0]);
      } catch (err) {
        console.error("User rejected MetaMask connection", err);
      }
    } else {
      alert("MetaMask not installed. Please install MetaMask extension.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    console.log("Disconnected from MetaMask");
  };

  return (
    <div className="h-16 px-6 flex justify-between items-center w-full shadow-sm bg-[#5b2333]">
      {/* Left: Logo */}
      <NavLink to="/" className="flex items-center gap-1">
        <h1 className="text-[#d49c79] text-2xl font-extrabold tracking-wide hover:text-[#f0b78e] transition-colors">
          DecnAIX
        </h1>
      </NavLink>

      {/* Right: Tabs, Wallet, Auth */}
      <div className="flex items-center gap-4">
        {Tabs && (
          <div className="hidden md:flex">
            <Tabs activeIdx={activeTab} onChange={(val) => setActiveTab(val)} />
          </div>
        )}

        {/* Connect Wallet Button */}
        <Button
          onClick={connectMetask}
          className="flex items-center gap-2 px-5 py-2 bg-[#d49c79] hover:bg-[#e8b088] text-[#5b2333] font-semibold transition-colors"
        >
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect Wallet"}
          <Wallet2 size={20} />
        </Button>

        {/* Authenticated Dropdown or Sign In */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 rounded-full h-10 w-10 flex items-center justify-center bg-[#d49c79] hover:bg-[#e8b088] text-[#5b2333]"
              >
                {user.name ? (
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
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-[#d49c79] text-[#5b2333]">
                    {user.name ? (
                      <span className="font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.name || "User"}</p>
                    <p className="text-xs text-gray-300">{user.email}</p>
                  </div>
                </div>
              </div>
              {walletAddress && (
                <>
                  <DropdownMenuSeparator className="bg-[#d49c79]" />
                  <DropdownMenuItem asChild>
                    <button
                      onClick={disconnectWallet}
                      className="w-full flex items-center px-2 py-1.5 hover:bg-[#7a3b4b] rounded"
                    >
                      <Wallet2 className="mr-2 h-4 w-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </DropdownMenuItem>
                </>
              )}

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
        ) : (
          <NavLink to="/auth">
            <Button className="flex items-center gap-2 px-5 py-2 bg-[#d49c79] hover:bg-[#e8b088] text-[#5b2333] font-semibold transition-colors">
              Sign In
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Header;
