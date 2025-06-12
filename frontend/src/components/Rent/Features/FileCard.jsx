import { Download,BoxIcon } from "lucide-react";

const FileCard = ({ title, machine, date, onDownload, onClick }) => {
  return (
    <div
      className="relative text-black h-60 overflow-hidden cursor-pointer"
      
    >
      <div
        className="absolute z-100 w-[30%] md:h-10 h-8 bg-[#9bad7f] shadow-lg rounded-t-md"
        style={{
          clipPath:
            "polygon(10% 100%, 90% 100%, 100% 50%, 90% 0%, 10% -100%, -20% 100%)",
        }}
      ></div>

      <div className="relative md:top-5 top-4 flex flex-col gap-2 z-10 p-2 bg-[#d3edad] rounded-md border-4 border-[#9bad7f]">
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold text-lg">{title || "title"}</span>
          <span className="text-gray-600 text-sm">{date || "date"}</span>
        </div>
        <div className="hidden md:flex justify-evenly items-center">
          <div>
            <BoxIcon size={100} />
          </div>
          <h3>Machine 1 </h3>
          <ul className="pl-4">
            <li className="flex items-center gap-2 font-medium">
              <span className="font-bold">Cores:</span> 12
            </li>
            <li className="flex items-center gap-2 font-medium">
              <span className="font-bold">Ram:</span> 10 GB
            </li>
            <li className="flex items-center gap-2 font-medium">
              <span className="font-bold">Time Span:</span> 2H
            </li>
          </ul>

          {/* <span className="text-gray-700">Machine: {machine || "machine"}</span> */}
        </div>
        <div className="w-full flex justify-between items-center">
          <button
            className=" bg-gray-600 hover:bg-[#9bad7f] mt-2 text-white px-3 py-1 rounded flex items-center gap-2 "
            onClick={onClick}
          >
            Enter Dashboard
          </button>
          <button
            className="mt-2 bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-[#9bad7f]"
            onClick={onDownload}
          >
            <Download size={16} /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;