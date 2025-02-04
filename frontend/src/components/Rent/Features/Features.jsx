import { Button } from "@/components/ui/button";
import { Book, Box, Computer, Touchpad } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Features = () => {
  const options = [
    { name: "Transactions", icon: Book, path: "/Rent/transactions" },
    { name: "Weights", icon: Box, path: "/Rent/features-weights" },
    { name: "Create Task", icon: Touchpad, path: "/Rent/create-task" },
    { name: "Select Machine", icon: Computer, path: "/Rent/select-machine" },
  ];

  return (
    <div className="flex gap-x-3">
      {options.map((op) => {
        const Icon = op.icon;
        return (
          <Link key={op.name} to={op.path}>
            <Button className="flex flex-col offsetstyle items-center justify-center px-4 py-3 text-[#f7f4f3] border-2 border-black rounded-md hover:text-[#F7F4F3] hover:bg-[#5B2333]">
              <Icon className="h-5 w-5 mb-1" />
              <span>{op.name}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default Features;
