"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Dynamic pricing model with tiered rates
const PRICING = {
  cpu: {
    2: 0.03,    // $0.03 per core/hour
    4: 0.05,
    8: 0.09,
    12: 0.15,
    16: 0.25
  },
  ram: {
    4: 0.02,    // $0.02 per GB/hour
    8: 0.03,
    16: 0.06,
    32: 0.10,
    64: 0.18
  },
  storage: {
    128: 0.01,  // $0.01 per GB/hour
    256: 0.02,
    512: 0.03,
    1024: 0.05,
    2048: 0.09
  },
  baseFee: 0.15  // Base operational fee per hour
};

// Time options from 1 hour to 1 week
const timeOptions = [1, 2, 4, 8, 12, 24, 48, 72, 168].map(hours => ({
  value: hours.toString(),
  label: hours < 24 ? `${hours} hour${hours > 1 ? 's' : ''}` : 
         hours === 24 ? '1 day' : 
         hours === 48 ? '2 days' : 
         hours === 72 ? '3 days' : '1 week'
}));

export default function Calculator({ selectedMachine }) {
  const [computeName, setComputeName] = useState("");
  const [selectedTime, setSelectedTime] = useState(timeOptions[0].value);
  const [costDetails, setCostDetails] = useState(null);

  // Auto-fill machine details and reset calculation when machine changes
  useEffect(() => {
    if (selectedMachine) {
      setComputeName(selectedMachine.name);
      setCostDetails(null);
      calculateCost(selectedTime); // Calculate immediately with default time
    }
  }, [selectedMachine]);

  // Recalculate whenever time changes
  useEffect(() => {
    if (selectedMachine) {
      calculateCost(selectedTime);
    }
  }, [selectedTime]);

  const calculateCost = (hours) => {
    if (!selectedMachine) return;
    
    const parsedHours = parseFloat(hours);
    const { cpu, ram, storage } = selectedMachine;

    // Get rates with fallback to highest tier
    const cpuRate = PRICING.cpu[cpu] || PRICING.cpu[16];
    const ramRate = PRICING.ram[ram] || PRICING.ram[64];
    const storageRate = PRICING.storage[storage] || PRICING.storage[2048];
    
    // Calculate costs
    const baseCost = PRICING.baseFee * parsedHours;
    const cpuCost = cpuRate * parsedHours;
    const ramCost = ramRate * parsedHours;
    const storageCost = storageRate * parsedHours;
    const totalCost = baseCost + cpuCost + ramCost + storageCost;

    setCostDetails({
      base: baseCost,
      cpu: cpuCost,
      ram: ramCost,
      storage: storageCost,
      total: totalCost,
      hours: parsedHours,
      rates: {
        cpu: cpuRate,
        ram: ramRate,
        storage: storageRate
      }
    });
  };

  const handleTimeChange = (value) => {
    setSelectedTime(value);
  };

  return (
    <TabsContent value="Calculate">
      <Card className="bg-[#f5d5d5] text-gray-900 shadow-lg rounded-2xl border border-gray-700 p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center tracking-wide">
            Machine Cost Calculator
          </CardTitle>
          <CardDescription className="text-center font-semibold">
            {selectedMachine 
              ? `Pricing for ${selectedMachine.name}`
              : "Select a machine to view pricing"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Machine Information Section */}
          {selectedMachine ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Instance Name</Label>
                <Input
                  value={computeName}
                  onChange={(e) => setComputeName(e.target.value)}
                  className="bg-white border-gray-300 focus:ring-2 focus:ring-[#5b2333]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>CPU Cores</Label>
                  <div className="p-2 bg-white rounded-md border border-gray-300 flex items-center justify-between">
                    <Badge variant="secondary">{selectedMachine.cpu}</Badge>
                    <span className="text-sm text-gray-600">cores</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Memory</Label>
                  <div className="p-2 bg-white rounded-md border border-gray-300 flex items-center justify-between">
                    <Badge variant="secondary">{selectedMachine.ram}</Badge>
                    <span className="text-sm text-gray-600">GB</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Storage</Label>
                  <div className="p-2 bg-white rounded-md border border-gray-300 flex items-center justify-between">
                    <Badge variant="secondary">{selectedMachine.storage}</Badge>
                    <span className="text-sm text-gray-600">GB</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-700 bg-white/50 rounded-lg">
              ⚠️ Please select a machine from the list to calculate costs
            </div>
          )}

          {/* Duration Selector */}
          <div className="space-y-2">
            <Label>Usage Duration</Label>
            <Select
              value={selectedTime}
              onValueChange={handleTimeChange}
              disabled={!selectedMachine}
            >
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {timeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-gray-100"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Real-time Cost Breakdown */}
          {costDetails && (
            <div className="bg-white/80 rounded-lg p-4 space-y-1 border border-gray-300">
              <h3 className="font-bold text-lg border-b pb-2">Cost Breakdown</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Base fee:</span>
                  <span className="font-medium">${costDetails.base.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CPU @ ${costDetails.rates.cpu}/core/hr:</span>
                  <span className="font-medium">${costDetails.cpu.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">RAM @ ${costDetails.rates.ram}/GB/hr:</span>
                  <span className="font-medium">${costDetails.ram.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Storage @ ${costDetails.rates.storage}/GB/hr:</span>
                  <span className="font-medium">${costDetails.storage.toFixed(4)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Estimated Cost:</span>
                  <span className="text-xl font-bold text-[#5b2333]">
                    ${costDetails.total.toFixed(4)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  For {costDetails.hours} hour{costDetails.hours !== 1 ? 's' : ''} of usage
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        {/* <CardFooter className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-[#5b2333] text-[#5b2333] hover:bg-[#5b2333]/10"
            disabled={!selectedMachine}
          >
            Save Configuration
          </Button>
          <Button
            className="flex-1 bg-[#5b2333] hover:bg-[#7a3b4b] text-white"
            disabled={!selectedMachine}
            onClick={() => {
              // Add your task creation logic here
              console.log("Creating task with:", {
                machine: selectedMachine,
                duration: selectedTime,
                name: computeName
              });
            }}
          >
            Deploy Now
          </Button>
        </CardFooter> */}
      </Card>
    </TabsContent>
  );
}
