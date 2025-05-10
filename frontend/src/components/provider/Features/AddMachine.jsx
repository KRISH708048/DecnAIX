import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Cpu, MemoryStick, HardDrive, Server, Gauge, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddMachine = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cpu: "",
    ram: "",
    storage: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/v1/provider/machines/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create machine");
      
      toast.success("Machine created successfully!");
      navigate("/provider/machines");
    } catch (error) {
      toast.error(error.message || "Failed to create machine");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] to-[#24243e] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ff4757] to-[#ff8a9d] mb-3">
            Add New Machine
          </h1>
          <p className="text-gray-300">Register your GPU resource</p>
        </div>

        {/* Stepper */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-700 -z-10"></div>
          <div
            className="absolute top-1/4 left-0 h-1 bg-[#d49c79] transition-all duration-500 -z-10"
            style={{ width: `${(currentStep - 1) * 100}%` }}
          ></div>
          
          {[1, 2].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2 transition-all duration-300 ${currentStep >= step ? "bg-[#d49c79] text-white" : "bg-gray-700 text-gray-400"}`}>
                {step}
              </div>
              <span className={`text-sm font-medium ${currentStep >= step ? "text-white" : "text-gray-400"}`}>
                {step === 1 ? "Basic Details" : "Specifications"}
              </span>
            </div>
          ))}
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: currentStep === 1 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#1a1a2e]/80 backdrop-blur-sm rounded-xl border border-[#ff4757]/20 p-8"
        >
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="block text-gray-300 mb-2">
                    Machine Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-[#16213e] border-gray-700 text-white pl-10"
                      placeholder="e.g. Titan RTX Server"
                    />
                    <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="block text-gray-300 mb-2">
                    Performance Category
                  </Label>
                  <div className="relative">
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({...formData, category: value})}
                      required
                    >
                      <SelectTrigger className="bg-[#16213e] border-gray-700 text-white pl-10">
                        <Cpu className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#16213e] border-gray-700 text-white">
                        <SelectItem value="HIGH" className="hover:bg-[#ff4757]/10">
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                            HIGH Performance
                          </span>
                        </SelectItem>
                        <SelectItem value="MID" className="hover:bg-[#ff4757]/10">
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            MID Range
                          </span>
                        </SelectItem>
                        <SelectItem value="BASIC" className="hover:bg-[#ff4757]/10">
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                            BASIC Tier
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="cpu" className="block text-gray-300 mb-2">
                    CPU Cores
                  </Label>
                  <div className="relative">
                    <Input
                      id="cpu"
                      name="cpu"
                      type="number"
                      value={formData.cpu}
                      onChange={handleChange}
                      required
                      className="bg-[#16213e] border-gray-700 text-white pl-10"
                      placeholder="e.g. 16"
                    />
                    <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ram" className="block text-gray-300 mb-2">
                    RAM (GB)
                  </Label>
                  <div className="relative">
                    <Input
                      id="ram"
                      name="ram"
                      type="number"
                      value={formData.ram}
                      onChange={handleChange}
                      required
                      className="bg-[#16213e] border-gray-700 text-white pl-10"
                      placeholder="e.g. 64"
                    />
                    <MemoryStick className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="storage" className="block text-gray-300 mb-2">
                    Storage (GB)
                  </Label>
                  <div className="relative">
                    <Input
                      id="storage"
                      name="storage"
                      type="number"
                      value={formData.storage}
                      onChange={handleChange}
                      required
                      className="bg-[#16213e] border-gray-700 text-white pl-10"
                      placeholder="e.g. 1000"
                    />
                    <HardDrive className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-between">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="border-[#ff4757]/30 text-[#ff4757]"
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 2 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-[#ff4757] to-[#ff6b81]"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#ff4757] to-[#ff6b81]"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">↻</span>
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Machine
                    </span>
                  )}
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddMachine;