import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const dummyMachines = [
  {
    name: "High-Performance Compute 1",
    cpu: "16 Cores",
    ram: "64",
    size: "2000",
    time: "24",
    active: true,
  },
  {
    name: "AI Training Server",
    cpu: "32 Cores",
    ram: "128",
    size: "5000",
    time: "48",
    active: true,
  },
  {
    name: "Web Hosting Server",
    cpu: "8 Cores",
    ram: "32",
    size: "1000",
    time: "72",
    active: false,
  },
  {
    name: "Blockchain Node",
    cpu: "12 Cores",
    ram: "48",
    size: "1500",
    time: "36",
    active: true,
  },
  {
    name: "Gaming Rig",
    cpu: "10 Cores",
    ram: "32",
    size: "2000",
    time: "12",
    active: false,
  },
];

export default function MachineOverview() {
  const [machines, setMachines] = useState(dummyMachines);

  const toggleMachineStatus = (index) => {
    const updatedMachines = [...machines];
    updatedMachines[index].active = !updatedMachines[index].active;
    setMachines(updatedMachines);
  };

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center bg-[#5b2333] text-white">
      <motion.div
        // initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <span className="text-sm font-semibold tracking-widest uppercase text-[#ff4757] opacity-80">
              Overview
            </span>
            <h2 className="text-4xl font-extrabold mt-2 text-[#ffffff]">
              Your Machines
            </h2>
            <p className="text-gray-200 mt-2">
              Monitor, manage, and optimize your high-performance computing
              resources.
            </p>
          </div>
          <Button
            className="mt-4 md:mt-0 bg-[#ff4757] hover:bg-[#ff6b81] text-white transition-all duration-300 shadow-xl px-6 py-3 flex items-center gap-2 rounded-lg"
            onCh3ck={() => (window.location.href = "/provider/add-machine")}
          >
            <Plus className="w-5 h-5" /> Add Machine
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {machines.map((machine, index) => (
            <motion.div
              key={machine.name}
              //   initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              //   transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-[#772a3a] bg-opacity-90 backdrop-blur-xl border border-[#ff4757] shadow-lg rounded-2xl p-6 overflow-hidden group 
              hover:shadow-[0_4px_30px_rgba(255,71,87,0.5)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-[#ff4757] opacity-0 group-hover:opacity-10 transition-all duration-500 blur-[40px]"></div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#ff4757]">
                  {machine.name}
                </h3>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium tracking-wide text-gray-300 uppercase">
                    Specifications
                  </span>
                  <div className="flex items-center space-x-2">
                    <Switch className="bg-gray-300 relative data-[state=checked]-text-white w-12 h-6 rounded-full transition-colors">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-0.5 transition-transform data-[state=checked]:translate-x-6 shadow-md" />
                    </Switch>
                    <span className="text-white">Active</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-gray-100 text-sm">
                  <h3 className="flex items-center gap-2">
                    <span className="text-gray-400">🖥️ RAM:</span>{" "}
                    <span>{machine.ram} GB</span>
                  </h3>
                  <h3 className="flex items-center gap-2">
                    <span className="text-gray-400">⚙️ Cores:</span>{" "}
                    <span>{machine.cpu}</span>
                  </h3>
                  <h3 className="flex items-center gap-2">
                    <span className="text-gray-400">💾 Storage:</span>{" "}
                    <span>{machine.size} GB</span>
                  </h3>
                  <h3 className="flex items-center gap-2">
                    <span className="text-gray-400">⏳ Time:</span>{" "}
                    <span>{machine.time} hrs</span>
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
