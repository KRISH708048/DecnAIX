"use client";
import { useState } from "react";
// import { useRecoilValue } from "recoil";
// import { tasksAtom } from "@/store/taskAtom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
// import { userAtom } from "@/store/authAtom";
import { useNavigate } from "react-router-dom";

// const APPROVAL_STATUS = ["Pending", "Approved", "Rejected"];
// const MAX_POLL_ATTEMPTS = 10;
// const POLL_INTERVAL = 3000;

export default function approvalStatus({ selectedMachine }) {
  // const [selectedStatus, setSelectedStatus] = useState(0);
  const [taskName, setTaskName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const task = useRecoilValue(tasksAtom);
  // const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const pollForStatusChange = async (taskName) => {
    try {
      const token = localStorage.getItem("token");
      let status = "PENDING";
      let attempts = 0;
      // while (status === "PENDING" && attempts < MAX_POLL_ATTEMPTS) {
        const res = await fetch(
          `http://localhost:3000/api/v1/task/status/task/${taskName}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch status");
        navigate('/Rent/weight');

        // const data = await res.json();
        // status = data?.status;
        // if (status === "WORKING") {
        //   toast.success("Accepted!");
        //   setSelectedStatus(1);
        //   setIsLoading(false);
        //   return status;
        // }
        // if(status === "REJECTED") {
        //   toast.error("Rejected!");
        //   setSelectedStatus(2);
        //   setIsLoading(false);
        //   return status;
        // }

        // attempts++;
      //   await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
      // }

      // if (status === "PENDING") {
      //   toast.warning("Status still pending after several attempts.");
      //   setIsLoading(false);
      // }
      // else if(status === "WORKING"){
      //   toast.success("Accepted!");
      //   setSelectedStatus(1);
      //   setIsLoading(false);
      // }
    } catch (err) {
      setIsLoading(false);
      toast.error("Failed to fetch status.");
      console.error(err);
    } finally{
      setIsLoading(false);
    }
  };

  const handleApproveRequest = async () => {
    if (!taskName.trim()) {
      toast.warning("Please create a task first.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log( JSON.stringify({
            name: taskName,
            machineOwnerId: selectedMachine.userId || "Unknown",
            machineId: selectedMachine.id,
          }))
      const res = await fetch(
        `http://localhost:3000/api/v1/task/createRequest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: taskName,
            machineOwnerId: selectedMachine.userId || "Unknown",
            machineId: selectedMachine.id,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to create request");

      toast.success("Request sent successfully.");
      // await pollForStatusChange(taskName);
    } catch (err) {
      setIsLoading(false);
      toast.error("Failed to send request. Please try again.");
      console.error(err);
    }
  };

  return (
    <Card className="bg-[#d5f5e3] text-white shadow-lg rounded-2xl border border-gray-700 backdrop-blur-lg p-6 ">
      <CardHeader>
        <CardTitle className="text-gray-900 text-3xl font-extrabold text-center tracking-wide">
          Approval Status
        </CardTitle>
        <CardDescription className="text-gray-900 text-center font-semibold">
          Review and approve the requested machine.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label className="text-gray-900">Task Name</Label>
          <input
            disabled={isLoading}
            className="bg-gray-800 text-white font-light border border-gray-600 p-2 rounded-md"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-900">Machine Name</Label>
          <p className="bg-gray-800 text-white font-light border border-gray-600 p-2 rounded-md">
            {selectedMachine?.name || "N/A"}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-900">GPU Owner Address</Label>
          <p className="bg-gray-800 text-white font-light border border-gray-600 p-2 rounded-md">
            {selectedMachine?.id || "N/A"}
          </p>
        </div>

        {/* <div className="space-y-2">
          <Label className="text-gray-900">Approval Status</Label>
          <div className="flex gap-3 flex-wrap">
            {APPROVAL_STATUS.map((status, idx) => {
              const baseStyle = "text-white transition-all";
              const isSelected = selectedStatus === idx;

              const colorMap = {
                Pending: isSelected
                  ? "bg-yellow-500"
                  : "bg-black text-white hover:bg-yellow-600",
                Approved: isSelected
                  ? "bg-green-800"
                  : "bg-black text-white hover:bg-green-700",
                Rejected: isSelected
                  ? "bg-red-600"
                  : "bg-black text-white hover:bg-red-700",
              };

              return (
                <Button
                  key={idx}
                  variant="outline"
                  className={twMerge(
                    baseStyle,
                    "border border-gray-500",
                    colorMap[status],
                    isSelected && "shadow-md scale-105"
                  )}
                  onClick={() => !isLoading && setSelectedStatus(idx)}
                  disabled={isLoading}
                >
                  {status}
                </Button>
              );
            })}
          </div>
        </div> */}
      </CardContent>

      <CardFooter>
        <Button
          className="bg-[#2e7d32] text-white hover:bg-blue-500 w-full py-3 text-lg font-semibold tracking-wide"
          onClick={handleApproveRequest}
          disabled={isLoading}
        >
          {isLoading ? "Waiting for response..." : "Approve Request"}
        </Button>
      </CardFooter>
    </Card>
  );
}
