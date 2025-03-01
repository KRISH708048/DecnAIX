import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Book, Box, Touchpad, Computer } from "lucide-react";

const options = [
  { name: "Transactions", icon: Book, path: "/Provider/transactions" },
  { name: "Machines", icon: Box, path: "/Provider/machines" },
  { name: "Computation", icon: Computer, path: "/Provider/computation" },
];

export default function ProviderTabs({ onChange }) {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    // Find the active tab based on the current path
    const activeTab = options.findIndex((tab) => tab.path === location.pathname);
    setActiveIndex(activeTab !== -1 ? activeTab : -1);
    // console.log(activeIndex);
  }, [location.pathname]);

  return (
    <div className="flex items-center gap-4 py-2">
      {options.map((tab, index) => (
        
        <Link key={index} to={tab.path} onClick={() =>{onChange(index)}}>
          <Button
            className={`offsetstyle p-2 w-36 border-2 border-black ${
              activeIndex === index ? "bg-white text-black" : "bg-[#5B2333] text-white"
            }`}
          >
            {tab.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
