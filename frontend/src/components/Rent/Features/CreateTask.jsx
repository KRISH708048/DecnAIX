import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRecoilState } from "recoil";
import { tasksAtom } from "@/store/taskAtom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CreateTask({ selectedMachine }) {
  const [zipFile, setZipFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [filePassword, setFilePassword] = useState("");
  const [reservedFor, setReservedFor] = useState("");
  const [tasks, setTasks] = useRecoilState(tasksAtom);
  // const { toast } = useToast();
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
    if (!selectedMachine) {
      return setError("Please select a machine first");
    }
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
    formData.append("machineId", selectedMachine._id);

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
      
      // Store task in Recoil state
      const newTask = {
        id: data.taskId,
        name: taskName,
        machine: selectedMachine.name,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      setTasks([...tasks, newTask]);

      toast({
        title: "Task Created",
        description: "Your compute task has been submitted successfully",
        status: "success",
      });

      // Navigate to approval page or show success
      navigate("/approval");
      
    } catch (error) {
      console.error(error);
      setError("An error occurred during upload.");
      toast({
        title: "Error",
        description: "Failed to create task",
        status: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const requestApproval = () => {
    if (!selectedMachine) {
      return setError("Please select a machine first");
    }
    if (!taskName || !reservedFor) {
      return setError("Task name and duration are required");
    }

    const approvalTask = {
      id: `temp-${Date.now()}`,
      name: taskName,
      machine: selectedMachine.name,
      status: "approval_pending",
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, approvalTask]);

    toast({
      title: "Approval Requested",
      description: "Your task has been submitted for approval",
      status: "success",
    });

    navigate("/approval");
  };

  return (
    <TabsContent value="Create_task">
      <Card className="bg-[#f5d5d5] text-gray-600 border border-gray-300 shadow-md rounded-xl p-6">
        <CardHeader className="mb-2">
          <CardTitle className="text-xl">Create Compute Task</CardTitle>
          <CardDescription>
            {selectedMachine 
              ? `Creating task for ${selectedMachine.name}`
              : "Select a machine first"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Task Name*"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <Input
              placeholder="File Password*"
              type="password"
              value={filePassword}
              onChange={(e) => setFilePassword(e.target.value)}
            />
            <Input
              placeholder="Duration (hours)*"
              type="number"
              value={reservedFor}
              onChange={(e) => setReservedFor(e.target.value)}
            />
          </div>

          <div
            className={`border-2 border-dashed rounded-lg text-center p-6 cursor-pointer transition ${
              dragActive
                ? "bg-blue-100 border-blue-400"
                : "bg-gray-50 border-gray-300"
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
            <label htmlFor="zip-upload" className="block text-gray-600 text-sm">
              {zipFile ? (
                <>
                  Selected: <span className="font-medium">{zipFile.name}</span>
                </>
              ) : (
                <>
                  <p className="text-gray-700">Drag & Drop ZIP file here</p>
                  <p className="text-gray-400 text-sm">or click to browse</p>
                </>
              )}
            </label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <Button
              onClick={requestApproval}
              disabled={uploading || !selectedMachine}
              variant="outline"
              className="flex-1 border-[#5b2333] text-[#5b2333] hover:bg-[#5b2333]/10"
            >
              Request Approval
            </Button>
            <Button
              onClick={handleStart}
              disabled={uploading || !selectedMachine}
              className="flex-1 bg-[#5b2333] text-white hover:bg-[#7a3b4b]"
            >
              {uploading ? "Creating..." : "Start Immediately"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}