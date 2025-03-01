import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CostCalculator from "../Features/Calculator";
import Approval from "../Features/ApprovalStatus";
import CreateTask from "../Features/CreateTask";

const dummyMachines = [
  {
    _id: "machine1",
    name: "High-Performance GPU",
    time: "2h 30m",
    ram: 32,
    cpu: 8,
    size: "500GB SSD",
  },
  {
    _id: "machine2",
    name: "Mid-Tier Compute Node",
    time: "1h 15m",
    ram: 16,
    cpu: 4,
    size: "256GB SSD",
  },
  {
    _id: "machine3",
    name: "Basic AI Training Rig",
    time: "3h 45m",
    ram: 64,
    cpu: 16,
    size: "1TB NVMe",
  },
  {
    _id: "machine4",
    name: "Entry-Level Instance",
    time: "45m",
    ram: 8,
    cpu: 2,
    size: "128GB SSD",
  },
];

export default function SearchWrapper() {
  const [machines, setMachines] = useState(dummyMachines);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;

  const paginatedMachines = machines.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="relative h-screen w-full flex md:flex-row flex-col text-[#F5E6E6] bg-[#5b2333]">
      <div className="w-2/3 flex flex-col items-center gap-6 p-8">
        <h1 className="text-5xl font-bold text-white">
          Compute Resource Manager
        </h1>
        <p className="text-lg italic text-gray-300">
          Manage and allocate computational power efficiently
        </p>
        <div className="flex gap-2">
          {dummyMachines.map((machine) => (
            // <div key={machine._id} className="flex flex-col gap-2 p-4 bg-[#f8d7da] text-[#721c24] rounded-lg shadow-lg">
            <button className="px-6 py-1 bg-[#ff6d6f] text-green-50 rounded-sm border border-black cursor-pointer">
              {machine.name}
            </button>
            // </div>
          ))}
        </div>
        <div className="space-y-4 w-full ">
          {paginatedMachines.map((machine) => (
            <Card
              key={machine._id}
              className="relative mx-auto w-96 h-[24rem] bg-[#5b2333] bg-opacity-90 text-white shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,75,75,0.5)]"
            >
              {/* Background with Cyber Glow & Glassmorphism */}
              <div
                className="absolute inset-0 rounded-2xl opacity-60"
                style={{
                  background: `url('/assets/service3.png') no-repeat center center / cover `,
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Holographic Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-red-300/30 via-transparent to-[#2a0d12]/80 rounded-2xl"></div>

                {/* Neon Border Animation */}
                <div className="absolute inset-0 border-2 border-transparent rounded-2xl animate-borderGlow"></div>
              </div>

              {/* Card Header */}
              <CardHeader className="relative z-10 px-6">
                <CardTitle className="text-3xl font-extrabold tracking-wide text-white neon-text animate-glitch">
                  {machine.name}
                </CardTitle>
              </CardHeader>

              {/* Card Content */}
              <CardContent className="relative z-10 p-4 space-y-2 text-white">
                <div className="flex items-center space-x-2">
                  ⏳ <span className="font-semibold">Time:</span> {machine.time}
                </div>
                <div className="flex items-center space-x-2">
                  💾 <span className="font-semibold">RAM:</span> {machine.ram}{" "}
                  GB
                </div>
                <div className="flex items-center space-x-2">
                  🖥 <span className="font-semibold">CPU:</span> {machine.cpu}{" "}
                  Cores
                </div>
                <div className="flex items-center space-x-2">
                  📂 <span className="font-semibold">Storage:</span>{" "}
                  {machine.size}
                </div>
              </CardContent>

              {/* Glowing Action Button */}
              <div className="relative z-10 px-6 pb-6">
                <button className="w-full py-3 text-lg font-bold text-white bg-[#ff4d4d] rounded-lg shadow-lg shadow-red-500/50 hover:bg-[#cc3838] hover:shadow-red-300/50 transition-all">
                  ⚡ Select Machine
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="bg-[#c73645] text-white hover:bg-[#9e2a37]"
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                prev < Math.ceil(machines.length / itemsPerPage) - 1
                  ? prev + 1
                  : prev
              )
            }
            disabled={
              currentPage >= Math.ceil(machines.length / itemsPerPage) - 1
            }
            className="bg-[#c73645] text-white hover:bg-[#9e2a37]"
          >
            Next
          </Button>
        </div>
      </div>

      <div className="w-1/3 flex flex-col items-center gap-6 p-8">
        <h2 className="text-3xl font-bold text-white">Start </h2>
        <Tabs defaultValue="Calculate" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#9e2a37] text-white rounded-lg p-2">
            <TabsTrigger value="Calculate" className="hover:bg-[#c73645]">
              Calculate
            </TabsTrigger>
            <TabsTrigger value="Approval" className="hover:bg-[#c73645]">
              Approval
            </TabsTrigger>
            <TabsTrigger value="Create_task" className="hover:bg-[#c73645]">
              Create Task
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Calculate">
            <CostCalculator />
          </TabsContent>
          <TabsContent value="Approval">
            <Approval />
          </TabsContent>

          <TabsContent value="Create_task">
            <CreateTask />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
