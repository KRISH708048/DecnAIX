import { Input } from "@/components/ui/input";
import { Stars } from "lucide-react";
import React, { useState } from "react";

const Navbar = ({ data, onSelect }) => {
  const [searchTitle, setSearchTitle] = useState("");

  const filteredFiles = data.filter((file) =>
    file.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col w-64 border-b-2 text-white">
      <div className="p-4 sticky top-0 z-10">
        <Input
          id="search"
          className="border p-2 rounded-md w-full text-white outline-none"
          placeholder="Search files..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((item, index) => (
            <div
              key={index}
              className="pl-2 flex gap-6 cursor-pointer rounded-md group"
              onClick={() => onSelect(item)}
            >
              <div className="flex flex-col justify-center items-center">
                <Stars
                  size={24}
                  className="text-amber-400 my-2 transition-transform duration-200 group-hover:scale-110 group-hover:text-yellow-500"
                />
                {index !== filteredFiles.length - 1 && (
                  <div className="flex-grow h-10 w-1 bg-white"></div>
                )}
              </div>
              <div className="my-2 text-[#ebb28f] font-semibold transition-transform duration-200 group-hover:text-[#dcba71] group-hover:scale-105">
                {item.title}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No results found</p>
        )}
      </div>
    </div>
  );
};

export default Navbar;
