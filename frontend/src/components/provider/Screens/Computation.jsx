import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ComputationDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [showProcessed, setShowProcessed] = useState(true);
  const [showUnderProcessing, setShowUnderProcessing] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return;

      const response = await fetch(`http://localhost:3000/api/v1/task/allRequests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch requests");

      const data = await response.json();
      console.log(data);
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleApproval = async (task, approvalStatus) => {
    try {
      const actionKey = `${task._id}-${approvalStatus.toLowerCase()}`;
      setLoadingAction(actionKey);

      const token = localStorage.getItem("token");
      const body = {
        approvalStatus,
        taskName: task.taskName,
        machineId: task.machineId,
      };

      const res = await fetch(`http://localhost:3000/api/v1/task/requestApproval`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Failed to ${approvalStatus.toLowerCase()} request`);

      await fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 mb-8">
          <div className="text-center flex flex-col space-y-2">
            <h1 className="text-2xl md:text-4xl font-bold text-[#f0b78e]">Imputation Dashboard</h1>
            <p className="text-[#decabb] text-sm md:text-md font-semibold md:text-left">
              Manage and monitor all computation tasks
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 text-[#5b2222] bg-[#f0b78e]"
            onClick={fetchRequests}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {showModal && selectedTask && (
          <div className="fixed inset-0 m-4 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#deaf96] border-[#d67424] border-4 p-4 rounded-2xl w-full max-w-md text-[#5b2333]">
              <h3 className="text-xl font-semibold mb-4 text-center">Complete Details</h3>
              <p className="font-semibold">Task Name: {selectedTask.taskName}</p>
              <p className="font-semibold">Status: {selectedTask.status}</p>
              <p className="font-semibold">
                User:{" "}
                {selectedTask.user || selectedTask.walletAddress.slice(0, 10) +
                  "..." +
                  selectedTask.walletAddress.slice(-4)}
              </p>
              <p className="font-semibold">Machine: {selectedTask.machineName}</p>
              {selectedTask.machineOwner && (
                <p>
                  <strong>Owner:</strong> {selectedTask.machineOwner}
                </p>
              )}
              <div className="flex justify-end mt-4">
                <Button onClick={closeModal}>Close</Button>
              </div>
            </div>
          </div>
        )}

        {dashboardData ? (
          <>
            {/* Under Processing Section */}
            <div className="mb-6">
              <div
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => setShowUnderProcessing((prev) => !prev)}
              >
                <h2 className="text-xl font-semibold text-[#f0b78e]">New Requests</h2>
                {showUnderProcessing ? (
                  <ChevronUp className="text-[#f0b78e]" />
                ) : (
                  <ChevronDown className="text-[#f0b78e]" />
                )}
              </div>

              {showUnderProcessing && (
                <div className="grid md:grid-cols-3 gap-6">
                  {dashboardData.underProcessing.map((task, index) => (
                    <Card
                      key={`under-${index}`}
                      className="border-[#d49c79] bg-[#5b2333] text-white"
                    >
                      <CardHeader>
                        <CardTitle className="text-[#f0b78e] flex justify-between items-center">
                          Task: {task.taskName}
                          <Badge variant="secondary" className="bg-yellow-600">
                            {task.status}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-[#f0b78e]">
                        <p className="font-semibold">
                          Requester Address:{" "}
                          <span className="font-light">
                            {task.walletAddress.slice(0, 10)}...
                            {task.walletAddress.slice(-4)}
                          </span>
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            className="text-[#5b2333] font-bold border-[#f0b78e] bg-[#f0b78e]"
                            onClick={() => handleViewDetails(task)}
                          >
                            View Details
                          </Button>
                          <Button
                            className="bg-green-600 text-white hover:bg-green-700"
                            disabled={loadingAction === task._id + "-accepted"}
                            onClick={() => handleApproval(task, "Accepted")}
                          >
                            {loadingAction === task._id + "-accepted" ? "Accepting..." : "Accept"}
                          </Button>
                          <Button
                            className="bg-red-600 text-white hover:bg-red-700"
                            disabled={loadingAction === task._id + "-rejected"}
                            onClick={() => handleApproval(task, "Rejected")}
                          >
                            {loadingAction === task._id + "-rejected" ? "Rejecting..." : "Reject"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Processed Section */}
            <div>
              <div
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => setShowProcessed((prev) => !prev)}
              >
                <h2 className="text-xl font-semibold text-[#f0b78e]">Processing</h2>
                {showProcessed ? (
                  <ChevronUp className="text-[#f0b78e]" />
                ) : (
                  <ChevronDown className="text-[#f0b78e]" />
                )}
              </div>

              {showProcessed && (
                <div className="grid md:grid-cols-3 gap-6">
                  {dashboardData.processed.map((task, index) => (
                    <Card
                      key={`processed-${index}`}
                      className="border-[#d49c79] bg-[#5b2333] text-white"
                    >
                      <CardHeader>
                        <CardTitle className="text-[#f0b78e] flex justify-between items-center">
                          {task.taskName}
                          <Badge variant="secondary" className="bg-green-600">
                            {task.status}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>User: {task.user}</p>
                        <p>Machine: {task.machineName}</p>
                        <p>Owner: {task.machineOwner}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-white mt-12">
            <Loader2 className="animate-spin mx-auto mb-4" size={40} />
            Loading tasks...
          </div>
        )}
      </div>
    </div>
  );
};

export default ComputationDashboard;
