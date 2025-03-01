"use client";
import React from "react";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";

// Example Data (Epoch-wise Accuracy & Loss)
const epochData = [
  { epoch: 1, accuracy: 60, loss: 0.8, weightFile: "/weights/epoch_1.pth" },
  { epoch: 2, accuracy: 65, loss: 0.6, weightFile: "/weights/epoch_2.pth" },
  { epoch: 3, accuracy: 72, loss: 0.5, weightFile: "/weights/epoch_3.pth" },
  { epoch: 4, accuracy: 78, loss: 0.4, weightFile: "/weights/epoch_4.pth" },
  { epoch: 5, accuracy: 85, loss: 0.3, weightFile: "/weights/epoch_5.pth" },
];

// Prediction Distribution (Pie Chart)
const pieData = [
  { name: "Correct Predictions", value: 85 },
  { name: "Incorrect Predictions", value: 15 },
];

// Updated Theme Colors
const COLORS = ["#A8DADC", "#E63946"]; // Blue & Red for contrast

const DetailedView = ({ selectedFile }) => {
  return (
    <div className="p-6 min-h-screen bg-[#5B2333] text-[#F3E5E5]">
      <h2 className="text-3xl font-bold mb-6">{selectedFile?.title} - Dashboard</h2>

      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Training Progress Chart */}
        <Card className="col-span-2 bg-[#3E1B25] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#F4A261]">Training Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={epochData}>
                <XAxis dataKey="epoch" stroke="#F3E5E5" />
                <YAxis stroke="#F3E5E5" />
                <Tooltip contentStyle={{ backgroundColor: "#3E1B25", color: "#F3E5E5" }} />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#A8DADC" strokeWidth={2} />
                <Line type="monotone" dataKey="loss" stroke="#E63946" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Prediction Distribution Pie Chart */}
        <Card className="bg-[#3E1B25] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#F4A261]">Prediction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#3E1B25", color: "#F3E5E5" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Downloadable Weights for Each Epoch */}
        <Card className="col-span-3 bg-[#3E1B25] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#F4A261]">Download Model Weights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {epochData.map((epoch) => (
                <div key={epoch.epoch} className="flex items-center justify-between p-3 bg-[#F4A280] text-[#5B2333] rounded-md shadow-md">
                  <span className="text-sm font-medium">Epoch {epoch.epoch} - Accuracy: {epoch.accuracy}%</span>
                  <Button
                    size="sm"
                    className="bg-[#6b2333] text-[#f7f7f7] flex items-center gap-2 hover:bg-[#89C2D9]"
                    onClick={() => window.location.href = epoch.weightFile}
                  >
                    <DownloadIcon size={16} /> Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailedView;
