import { UploadCloud, FileArchive } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const CodeAcceptor = ({ setIpfsCid, filePassword }) => {
  const [zipFile, setZipFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".zip")) {
      setError("Only .zip files are allowed.");
      setZipFile(null);
      return false;
    }
    setZipFile(file);
    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!handleFile(zipFile)) {
      console.log("error in file upload");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("zipFile", zipFile);
      formData.append("password", filePassword);

      const response = await fetch(
        "http://localhost:3000/api/v1/task/upload_Model",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      setUploaded(true);

      const data = await response.json();
      setIpfsCid(data.cid);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      setError("An error occurred during upload.");
      toast.error("Upload failed");
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <FileArchive className="h-4 w-4" />
            Upload ZIP File here
          </Label>
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ease-in-out ${
              dragActive
                ? "border-[#5b2333] bg-[#5b2333]/10 scale-105"
                : "border-gray-500 hover:border-[#5b2333] hover:scale-105 dark:border-gray-600"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".zip"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
              id="zip-upload"
            />
            <label
              htmlFor="zip-upload"
              className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
            >
              <UploadCloud
                className={`h-12 w-12 ${
                  dragActive ? "text-[#5b2333]" : "text-gray-400"
                } transition-colors`}
              />
              {zipFile ? (
                <div className="flex items-center gap-2 mt-2">
                  <FileArchive className="h-5 w-5 text-[#5b2333]" />
                  <span className="font-semibold text-[#5b2333]">
                    {zipFile.name}
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drag & drop your ZIP file here
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    or click to browse
                  </p>
                </>
              )}
            </label>
          </div>
        </div>
        <div >
          {!uploaded?<Button
            onClick={handleUpload}
            className="mt-4 px-6 py-2 bg-[#5b2333] text-white "
          >
            Upload to IPFS
          </Button>:<h3>File Uploaded to IPFS</h3>}
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
      )}
    </div>
  );
};

export default CodeAcceptor;
