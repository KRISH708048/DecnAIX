import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRecoilState } from "recoil";
import { tasksAtom } from "@/store/taskAtom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileArchive, Clock, Key, Tag } from "lucide-react";

export default function CreateTask() {
  const [zipFile, setZipFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [filePassword, setFilePassword] = useState("");
  const [reservedFor, setReservedFor] = useState("");
  const [tasks, setTasks] = useRecoilState(tasksAtom);
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (file && file.name.endsWith(".zip")) {
      setZipFile(file);
      setError(null);
    } else {
      setError("Only .zip files are allowed.");
      setZipFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleStart = async () => {
    if (!zipFile) return setError("Please upload a ZIP file.");
    if (!taskName || !filePassword || !reservedFor)
      return setError("All fields are required.");

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("zipFile", zipFile);
    formData.append("password", filePassword);
    formData.append("name", taskName);
    formData.append("duration", reservedFor);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/v1/task/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data = await response.json();

      const newTask = {
        id: data.taskId,
        name: data.name,
        status: "pending",
        cid: data.cid,
        createdAt: new Date().toISOString(),
      };

      setTasks(newTask);
      console.log(tasks);

      toast.success("Task Created", {
        description: "Your compute task has been submitted successfully",
      });

      navigate("/Rent/select-machine");
    } catch (error) {
      console.error(error);
      setError("An error occurred during upload.");
      toast.error("Error", {
        description: "Failed to create task",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mt-10 bg-gradient-to-br from-[#fce4ec] via-[#f8bbd0] to-[#f48fb1] dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6 border-none shadow-xl rounded-3xl">
      <CardHeader>
        <CardTitle className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#5b2333] to-[#a94a63] animate-pulse">
          🚀 Create Your Task
        </CardTitle>
        <CardDescription className="text-center text-sm mt-2 text-gray-600 dark:text-gray-300">
          Upload your ZIP compute task securely with password and duration.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="task-name" className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4" />
              Task Name
            </Label>
            <Input
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Image Classification Training"
              className="focus-visible:ring-2 focus-visible:ring-[#5b2333] font-semibold shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-password" className="flex items-center gap-2 text-sm font-medium">
              <Key className="h-4 w-4" />
              File Password
            </Label>
            <Input
              id="file-password"
              type="password"
              value={filePassword}
              onChange={(e) => setFilePassword(e.target.value)}
              placeholder="••••••••"
              className="focus-visible:ring-2 focus-visible:ring-[#5b2333] shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Duration (in hours)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={reservedFor}
              onChange={(e) => setReservedFor(e.target.value)}
              placeholder="e.g. 4"
              className="focus-visible:ring-2 focus-visible:ring-[#5b2333] shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <FileArchive className="h-4 w-4" />
            Upload ZIP File
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
                  <span className="font-semibold text-[#5b2333]">{zipFile.name}</span>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drag & drop your ZIP file here
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">or click to browse</p>
                </>
              )}
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg font-medium text-sm shadow-inner">
            {error}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col md:flex-row gap-4 mt-4 justify-end">
        <Button
          onClick={handleStart}
          disabled={uploading}
          className="bg-[#5b2333] hover:bg-[#7a3b4b] text-white px-6 py-2 rounded-xl transition-all duration-200 ease-in-out"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Task...
            </span>
          ) : (
            "Start Task"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
