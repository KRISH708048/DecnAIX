import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CostCalculator from "../Features/Calculator";
import Approval from "../Features/ApprovalStatus";
import CreateTask from "../Features/CreateTask";
import axios from "axios";
import MachineCard from "../Features/MachineCard";

export default function SearchWrapper() {
  const [machineGroups, setMachineGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupPages, setGroupPages] = useState({});
  const [selectedMachine, setSelectedMachine] = useState(null);
  const itemsPerPage = 1;

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/v1/provider/machines/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const groups = response.data.machines;
        setMachineGroups(groups);
        
        const initialPages = {};
        groups.forEach(group => {
          initialPages[group._id] = 0;
        });
        setGroupPages(initialPages);
        
        if (groups.length > 0) {
          setCurrentGroup(groups[0]._id);
        }
      } catch (err) {
        setError(err.message);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  const currentMachines = machineGroups.find(group => group._id === currentGroup)?.machines || [];
  const currentPage = currentGroup ? groupPages[currentGroup] || 0 : 0;
  const paginatedMachines = currentMachines.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleGroupChange = (groupId) => {
    setCurrentGroup(groupId);
  };

  const handlePageChange = (newPage) => {
    setGroupPages(prev => ({
      ...prev,
      [currentGroup]: newPage
    }));
  };

  const handleSelectMachine = (machine) => {
    setSelectedMachine({
      id: machine._id,
      name: machine.name,
      cpu: parseInt(machine.cpu),
      ram: parseInt(machine.ram),
      storage: parseInt(machine.storage),
      ownerAddress: machine.walletAddress,
      userId: machine.userID,
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-white text-2xl">Loading machines...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-red-500 text-2xl">Error: {error}</div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full flex md:flex-row flex-col text-[#F5E6E6] bg-[#5b2333]">
      {/* Left Panel - Machine Display */}
      <div className="w-2/3 flex flex-col items-center gap-6 p-4">
        <h1 className="text-5xl font-bold text-white">
          Select Your Machine
        </h1>
        <p className="text-md font-semibold italic text-gray-300">
          Manage and allocate computational power efficiently
        </p>

        {/* Machine Group Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {machineGroups.map((group) => (
            <Button
              key={group._id}
              onClick={() => handleGroupChange(group._id)}
              variant={currentGroup === group._id ? "default" : "outline"}
              className={`rounded-lg transition-all ${
                currentGroup === group._id 
                  ? "bg-[#ff4d4d] hover:bg-[#ff4d4d]/90" 
                  : "bg-transparent hover:bg-[#5b2333]/50"
              }`}
            >
              {group._id} ({group.machines.length})
            </Button>
          ))}
        </div>

        {/* Machine Cards */}
        <div className="w-full space-y-6">
          {paginatedMachines.length > 0 ? (
            paginatedMachines.map((machine) => (
              <MachineCard
                key={machine._id} 
                machine={machine}
                isSelected={selectedMachine?.id === machine._id}
                onSelect={() => handleSelectMachine(machine)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-white/70">
              No machines available in this category
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {currentMachines.length > itemsPerPage && (
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 0))}
              disabled={currentPage === 0}
              className="bg-[#c73645] text-white hover:bg-[#9e2a37]"
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(
                Math.min(
                  currentPage + 1,
                  Math.ceil(currentMachines.length / itemsPerPage) - 1
                )
              )}
              disabled={currentPage >= Math.ceil(currentMachines.length / itemsPerPage) - 1}
              className="bg-[#c73645] text-white hover:bg-[#9e2a37]"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Right Panel - Actions */}
      <div className="w-1/3 flex flex-col items-center gap-6 p-8 bg-[#5b2333]/80">
        <h2 className="text-3xl font-bold text-white">Start</h2>
        <Tabs defaultValue="Calculate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#9e2a37] text-white rounded-lg p-1">
            <TabsTrigger value="Calculate" className="hover:bg-[#c73645] py-2">
              Calculate
            </TabsTrigger>
            <TabsTrigger value="Approval" className="hover:bg-[#c73645] py-2">
              Approval
            </TabsTrigger>
            {/* <TabsTrigger value="Create_task" className="hover:bg-[#c73645] py-2">
              Create Task
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="Calculate" className="mt-4">
            <CostCalculator selectedMachine={selectedMachine} />
          </TabsContent>
          <TabsContent value="Approval" className="mt-4">
            <Approval selectedMachine={selectedMachine}/>
          </TabsContent>
          {/* <TabsContent value="Create_task" className="mt-4">
            <CreateTask selectedMachine={selectedMachine} />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}



