import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { twMerge } from "tailwind-merge";

const approvalStatus = ["Pending", "Approved", "Rejected"];

export default function Approval() {
  const [selectedStatus, setSelectedStatus] = useState(0);

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
        {/* Machine Name */}
        <div className="space-y-2">
          <Label className="text-gray-900">Machine Name</Label>
          <p className="bg-gray-800 text-white font-light border border-gray-600 p-2 rounded-md">
            Tesla V100
          </p>
        </div>

        {/* GPU Owner Address */}
        <div className="space-y-2">
          <Label className="text-gray-900">GPU Owner Address</Label>
          <p className="bg-gray-800 text-white font-light border border-gray-600 p-2 rounded-md">
            0xA7b3...F8C2
          </p>
        </div>

        {/* Approval Status */}
        <div className="space-y-2">
          <Label className="text-gray-900">Approval Status</Label>
          <div className="flex gap-3 flex-wrap">
            {approvalStatus.map((status, idx) => (
              <Button
                key={idx}
                variant="outline"
                className={twMerge(
                  "border border-gray-500 text-white hover:bg-green-500 transition-all",
                  selectedStatus === idx ? "bg-green-600 shadow-md scale-105" : "bg-gray-800"
                )}
                onClick={() => setSelectedStatus(idx)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Approve Button */}
      <CardFooter>
        <Button
          className="bg-[#2e7d32] text-white hover:bg-blue-500 w-full py-3 text-lg font-semibold tracking-wide"
        >
          Approve Request
        </Button>
      </CardFooter>
    </Card>
  );
}
