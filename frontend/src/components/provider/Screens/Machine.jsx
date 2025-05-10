import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Cpu,
  MemoryStick,
  HardDrive,
  Clock,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { userAtom } from "@/store/authAtom";
import { useRecoilValue } from "recoil";
import { NavLink } from "react-router-dom";
import AddMachine from "../Features/AddMachine";

const statusColors = {
  active: "bg-emerald-500",
  inactive: "bg-rose-500",
  pending: "bg-amber-500",
};

export default function MachineOverview() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) return;

        const response = await fetch(
          `http://localhost:3000/api/v1/provider/machines/userMachine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch machines");
        }

        const data = await response.json();
        setMachines(data.machines);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load machines");
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, [user?.id]);

  const toggleMachineStatus = async (machineId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/machines/${machineId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active: !currentStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update machine status");
      }

      setMachines(
        machines.map((machine) =>
          machine.id === machineId
            ? { ...machine, active: !currentStatus }
            : machine
        )
      );
      toast.success("Machine status updated");
    } catch (err) {
      toast.error("Failed to update machine status");
      console.error(err);
    }
  };

  

  if (error) {
    return (
      <div className="min-h-screen px-6 py-12 flex items-center justify-center bg-gradient-to-br from-[#1a0b1f] to-[#3b1d3a]">
        <div className="text-center p-8 bg-[#2e142d] rounded-xl shadow-2xl border border-[#ff4757]/50 max-w-md">
          <h2 className="text-2xl font-bold text-[#ff4757] mb-4">
            Error Loading Machines
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#ff4757] hover:bg-[#ff6b81] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center  text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-sm font-semibold tracking-widest uppercase text-[#ff4757] opacity-80">
              GPU Resource Dashboard
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#ff4757] to-[#ff8a9d]">
              Your Machine Fleet
            </h2>
            <p className="text-gray-300 mt-3 max-w-lg">
              Monitor, manage, and optimize your distributed computing resources
              in real-time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
           <NavLink to='/Provider/add-machines'> 
            <Button
              className="mt-4 md:mt-0 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] hover:from-[#ff6b81] hover:to-[#ff8a9d] text-white transition-all duration-300 shadow-lg hover:shadow-xl px-6 py-3 flex items-center gap-2 rounded-full"
              
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add New Machine</span>
            </Button>
            </NavLink>
          </motion.div>
        </div>

        {/* <AnimatePresence> */}
          {machines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-[#2e142d]/50 rounded-xl border border-dashed border-[#ff4757]/30"
            >
              <div className="mx-auto w-24 h-24 bg-[#ff4757]/10 rounded-full flex items-center justify-center mb-6">
                <Plus className="w-12 h-12 text-[#ff4757]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                No Machines Found
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                You haven't added any machines yet. Get started by adding your
                first GPU resource.
              </p>
              <Button
                className="bg-gradient-to-r from-[#ff4757] to-[#ff6b81] hover:from-[#ff6b81] hover:to-[#ff8a9d]"
                onClick={() => (window.location.href = "/provider/add-machine")}
              >
                Add Your First Machine
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {machines.map((machine, index) => (
                <motion.div
                  key={machine._id || index}
                  onHoverStart={() => setHoveredCard(machine._id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="relative text-[#5b2333] bg-[#d49c79] backdrop-blur-sm border border-[#ff4757]/20 shadow-xl rounded-2xl p-6 overflow-hidden group 
                  hover:border-[#ff4757]/50 hover:shadow-[0_10px_30px_rgba(255,71,87,0.2)] transition-all duration-300"
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      animate={{
                        background:
                          hoveredCard === machine._id
                            ? `radial-gradient(600px circle at ${machine.xPos}px ${machine.yPos}px, rgba(255, 71, 87, 0.1), transparent 80%`
                            : "transparent",
                      }}
                      className="absolute inset-0 pointer-events-none"
                    />
                  </div>

                  {/* Status indicator */}
                  <div className="absolute top-4 right-4 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        machine.active
                          ? statusColors.active
                          : statusColors.inactive
                      }`}
                    />
                    <span className="text-xs font-medium ">
                      {machine.active ? "Online" : "Offline"}
                    </span>
                  </div>

                  {/* Machine header */}
                  <div className="text-center mb-6">
                    <Cpu className="w-10 h-10 mx-auto text-[#5b2333] mb-3" />
                    <h3 className="text-xl font-bold text-[#5b2333] group-hover:text-[#8c6872] transition-colors">
                      {machine.name}
                    </h3>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#3b1d3a]/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MemoryStick className="w-5 h-5 text-[#ff4757]" />
                        <span className="">RAM</span>
                      </div>
                      <span className="font-mono font-bold">
                        {machine.ram} GB
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-[#3b1d3a]/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Cpu className="w-5 h-5 text-[#ff4757]" />
                        <span className="">Cores</span>
                      </div>
                      <span className="font-mono font-bold">{machine.cpu}</span>
                    </div>

                    <div className="flex justify-between items-center bg-[#3b1d3a]/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <HardDrive className="w-5 h-5 text-[#ff4757]" />
                        <span className="">Storage</span>
                      </div>
                      <span className="font-mono font-bold">
                        {machine.storage || machine.size} GB
                      </span>
                    </div>

                    <div className="flex justify-between items-center bg-[#3b1d3a]/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-[#ff4757]" />
                        <span className="">Uptime</span>
                      </div>
                      <span className="font-mono font-bold">
                        {machine.uptime || machine.time} hrs
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-6 flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-[#ff4757] text-[#5b2333] hover:bg-[#ff4757]/10 hover:border-[#ff4757]/50"
                    >
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-[#ff4757] text-[#5b2333] hover:bg-[#ff4757]/10 hover:border-[#ff4757]/50"
                      onClick={() =>
                        toggleMachineStatus(machine.id, machine.active)
                      }
                    >
                      {machine.active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        {/* </AnimatePresence> */}
      </motion.div>
    </div>
  );
}
