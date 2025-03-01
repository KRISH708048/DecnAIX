"use client";

import { useState } from "react";
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
import { twMerge } from "tailwind-merge";

const ramOptions = ["4GB", "8GB", "16GB"];
const coreOptions = ["2", "4", "8"];
const timeOptions = ["1", "2"]; // Time in hours

export default function Costs() {
  const [selectedRAM, setSelectedRAM] = useState(0);
  const [selectedCore, setSelectedCore] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [showCost, setShowCost] = useState(false);

  function returnPrice(core, ram) {
    if (core === 0) {
      switch (ram) {
        case 0:
          return 0.0416;
        case 1:
          return 0.0832;
        case 2:
          return 0.126;
      }
    } else if (core == 1) {
      switch (ram) {
        case 0:
          return 0.05;
        case 1:
          return 0.09;
        case 2:
          return 0.136;
      }
    } else {
      switch (ram) {
        case 0:
          return 0.1;
        case 1:
          return 0.2;
        case 2:
          return 0.272;
      }
    }
    return 0;
  }

  return (
    <TabsContent value="Calculate">
      <Card className="bg-[#f5d5d5] text-white shadow-lg rounded-2xl border border-gray-700 backdrop-blur-lg p-6 ">
        <CardHeader>
          <CardTitle className="text-gray-900 text-3xl font-extrabold text-center tracking-wide">
            Calculator
          </CardTitle>
          <CardDescription className="text-gray-900 text-center font-semibold">
            Select compute specs and get real-time cost estimation.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Compute Name Input */}
          <div className="space-y-2">
            <Label className="text-gray-900">Compute Name</Label>
            <Input
              className="bg-gray-800 text-white font-light border border-gray-600 focus:ring-2 focus:ring-blue-400 "
              placeholder="Enter compute name"
            />
          </div>

          {/* RAM Selection */}
          <div className="space-y-2">
            <Label className="text-gray-900">Select RAM</Label>
            <div className="flex gap-3 flex-wrap">
              {ramOptions.map((ram, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className={twMerge(
                    "border border-gray-500 text-white hover:bg-red-500 transition-all",
                    selectedRAM === idx
                      ? "bg-red-600 shadow-md scale-105"
                      : "bg-gray-800"
                  )}
                  onClick={() => {
                    setShowCost(false);
                    setSelectedRAM(idx);
                  }}
                >
                  {ram}
                </Button>
              ))}
            </div>
          </div>

          {/* CPU Core Selection */}
          <div className="w-full flex justify-between items-center">
            <div className="space-y-2">
              <Label className="text-gray-900">Select CPU Cores</Label>
              <div className="flex gap-3 flex-wrap">
                {coreOptions.map((core, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={twMerge(
                      "border border-gray-500 text-white hover:bg-red-500 transition-all",
                      selectedCore === idx
                        ? "bg-red-600 shadow-md scale-105"
                        : "bg-gray-800"
                    )}
                    onClick={() => {
                      setShowCost(false);
                      setSelectedCore(idx);
                    }}
                  >
                    {core}
                  </Button>
                ))}
              </div>
            </div>
            {/* Time Selection */}
            <div className="space-y-2">
              <Label className="text-gray-900">Select Time (Hours)</Label>
              <div className="flex gap-3 flex-wrap">
                {timeOptions.map((time, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={twMerge(
                      "border border-gray-500 text-white hover:bg-red-500 transition-all",
                      selectedTime === idx
                        ? "bg-red-600 shadow-md scale-105"
                        : "bg-gray-800"
                    )}
                    onClick={() => {
                      setShowCost(false);
                      setSelectedTime(idx);
                    }}
                  >
                    {time} hrs
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Expected Cost Display (Visible only after clicking Calculate) */}
          {showCost ? (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#5b2333]">
                Cost: $
                {(
                  returnPrice(selectedCore, selectedRAM) *
                  parseInt(timeOptions[selectedTime])
                ).toFixed(4)}{" "}
                USD
              </h3>
            </div>
          ) : (
            <div className="h-6"></div>
          )}
        </CardContent>

        {/* Calculate Button */}
        <CardFooter>
          <Button
            className="bg-[#5b2333] text-white hover:bg-blue-500 w-full py-3 text-lg font-semibold tracking-wide"
            onClick={() => setShowCost(true)}
          >
            Calculate Cost
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
