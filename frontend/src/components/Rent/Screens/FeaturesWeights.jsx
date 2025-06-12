import { useEffect, useState } from "react";
import { MoveLeftIcon} from "lucide-react";
import FileCard from "../Features/FileCard";
import Navbar from "../Features/Navbar";
import { Button } from "@/components/ui/button";
import DetailedView from "../Features/DetailViewCard";

const filesData = [
  {
    title: "Dataset Report",
    machine: "8 Core | 12 GB RAM",
    date: "2025-02-21",
    zipUrl: "/path/to/dataset.zip",
  },
  {
    title: "Model Weights",
    machine: "4 Core | 6 GB RAM",
    date: "2025-02-20",
    zipUrl: "/path/to/weights.zip",
  },
  {
    title: "Logs",
    machine: "8 Core | 4 GB RAM",
    date: "2025-02-18",
    zipUrl: "/path/to/logs.zip",
  },
  {
    title: "Dataset Report",
    machine: "10 Core | 12 GB RAM",
    date: "2025-02-21",
    zipUrl: "/path/to/dataset.zip",
  },
  {
    title: "Model Weights",
    machine: "8 Core | 12 GB RAM",
    date: "2025-02-20",
    zipUrl: "/path/to/weights.zip",
  },
  {
    title: "Logs",
    machine: "8 Core | 12 GB RAM",
    date: "2025-02-18",
    zipUrl: "/path/to/logs.zip",
  },
  {
    title: "Logs",
    machine: "8 Core | 4 GB RAM",
    date: "2025-02-18",
    zipUrl: "/path/to/logs.zip",
  },
  {
    title: "Dataset Report",
    machine: "10 Core | 12 GB RAM",
    date: "2025-02-21",
    zipUrl: "/path/to/dataset.zip",
  },
  {
    title: "Model Weights",
    machine: "8 Core | 12 GB RAM",
    date: "2025-02-20",
    zipUrl: "/path/to/weights.zip",
  },
  {
    title: "Logs",
    machine: "8 Core | 12 GB RAM",
    date: "2025-02-18",
    zipUrl: "/path/to/logs.zip",
  },
];


const FeaturesExplorer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [detailedView, setDetailedView] = useState(false);

  useEffect(()=>{
    
  });
  return (
    <div className="relative h-lvh w-full flex">
      {/* Sidebar (Navbar) */}
      <div className="w-[300px] h-screen hidden md:block fixed">
        <Navbar
          data={filesData}
          onSelect={(file) => {
            setSelectedFile(file);
            setDetailedView(false);
          }}
        />
      </div>

      <div className="flex flex-grow ml-[280px] mt-4 p-6 relative justify-center items-center overflow-auto">
        {!selectedFile ? (
          <div className="w-full md:w-[35%] opacity-20">
            <FileCard />
          </div>
        ) : !detailedView ? (
          <div className="w-full md:w-[35%]">
            <FileCard
              title={selectedFile.title}
              machine={selectedFile.machine}
              date={selectedFile.date}
              onDownload={() => (window.location.href = selectedFile.zipUrl)}
              onClick={() => setDetailedView(true)}
            />
          </div>
        ) : (
          <div className="w-[100%] flex md:flex-row flex-col m-6">
            <Button
              className="px-6 py-1 bg-[#9bad7f] text-green-50 rounded-md cursor-pointer mt-8"
              onClick={() => setDetailedView(false)}
            >
              <MoveLeftIcon />
            </Button>

            <div className="w-full">
              <DetailedView selectedFile={selectedFile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesExplorer;

//<div className="p-6 min-h-screen w-full flex flex-col  gap-4">
//   <div className=" md:w-2/12">
//     <input
//       id="search"
//       className="border p-2 offsetstyle rounded-md w-full bg-white text-black outline-none"
//       placeholder="Search files..."
//       value={searchTitle}
//       onChange={(e) => setSearchTitle(e.target.value)}
//     />
//   </div>

//   <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-6 p-4">
//     {filteredFiles.length > 0 ? (
//       filteredFiles.map((file, index) => (
//         <FileCard
//           key={index}
//           title={file.title}
//           machine={file.machine}
//           date={file.date}
//           onDownload={() => (window.location.href = file.zipUrl)}
//         />
//       ))
//     ) : (
//       <p className="text-gray-500 col-span-3">No matching files found.</p>
//     )}
//   </div>
// </div>
