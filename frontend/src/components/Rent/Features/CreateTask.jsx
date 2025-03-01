import { useState } from "react";
import JSZip from "jszip";
import CryptoJS from "crypto-js";
// import { Web3Storage } from "web3.storage";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateTask() {
  const [zipFile, setZipFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [ipfsCid, setIpfsCid] = useState(null);
  const [error, setError] = useState(null);

  // Web3Storage Client
  // const client = new Web3Storage({ token: "YOUR_WEB3_STORAGE_API_KEY" });

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith(".zip")) {
      setZipFile(file);
      setError(null);
    } else {
      setError("Please upload a valid .zip file.");
      setZipFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];

    if (file && file.name.endsWith(".zip")) {
      setZipFile(file);
      setError(null);
    } else {
      setError("Invalid file. Please upload a .zip file.");
    }
  };

  const handleStart = async () => {
    if (!zipFile) {
      setError("Please upload a ZIP file.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(zipFile);
      reader.onload = async function () {
        const wordArray = CryptoJS.lib.WordArray.create(reader.result);
        const encryptedZip = CryptoJS.AES.encrypt(
          wordArray,
          "YOUR_SECRET_KEY"
        ).toString();

        // Convert Encrypted String to Blob
        const encryptedBlob = new Blob([encryptedZip], { type: "text/plain" });

        // Upload Encrypted File to IPFS
        // const cid = await client.put([new File([encryptedBlob], "compute_task.zip.enc")]);
        // setIpfsCid(cid);
        // console.log("Uploaded to IPFS CID:", cid);
      };
    } catch (error) {
      console.error("Error uploading:", error);
      setError("An error occurred while processing the file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <TabsContent value="Create_task">
      <Card className="bg-[#f5d5d5] text-gray-900 border border-gray-300 shadow-lg rounded-lg p-5">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Create Compute Task</CardTitle>
          <CardDescription className="text-gray-600">
            Upload a ZIP file containing all required files. Drag & drop or click to upload.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Drag & Drop Upload Section */}
          <div
            className={`bg-white border-2 border-dashed p-6 rounded-lg text-center cursor-pointer ${
              dragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="hidden"
              id="zip-upload"
            />
            <label htmlFor="zip-upload" className="cursor-pointer">
              <p className="text-gray-700">Drop your ZIP file here</p>
              <p className="text-gray-500 text-sm">or click to select</p>
            </label>
          </div>

          {zipFile && (
            <p className="text-sm text-gray-700">
              Selected file: <span className="font-medium">{zipFile.name}</span>
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Start Button */}
          <Button
            onClick={handleStart}
            disabled={uploading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Start Task"}
          </Button>

          {/* Display IPFS CID */}
          {ipfsCid && (
            <p className="text-sm text-gray-700 mt-2">
              Uploaded to IPFS:{" "}
              <a
                href={`https://ipfs.io/ipfs/${ipfsCid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {ipfsCid}
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
