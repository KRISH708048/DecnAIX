import React from "react";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
export default function ChipsButton({ content, active, onClick }) {
  return (
    // <Button onClick={onClick} className={twMerge(active === true ? "bg-yellow-400" : "bg-white", '  flex  items-center gap-2  generalTabsBorder text-black hover:text-white ')}>{content}</Button>
    <Button className="flex flex-col offsetstyle items-center justify-center px-4 py-3 text-[#f7f4f3] border-2 border-black rounded-md hover:text-[#F7F4F3] hover:bg-[#5B2333]">
      <Icon className="h-5 w-5 mb-1" />
      <span>{op.name}</span>
    </Button>
  );
}
