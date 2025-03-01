import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateTask() {
  const [fileInputs, setFileInputs] = useState({
    model: null,
    dataset: null,
    requirements: null,
    utility: null,
  });

  const handleFileChange = (e, type) => {
    setFileInputs({ ...fileInputs, [type]: e.target.files[0] });
  };

  const handleStart = () => {
    console.log("Starting compute task with:", fileInputs);
  };

  return (
    <TabsContent value="Create_task">
      <Card className="bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb] shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Create Compute Task</CardTitle>
          <CardDescription className="text-[#721c24]/80">
            Upload the required files to start processing.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* File Upload Section */}
          <div className="space-y-3">
            {["model", "dataset", "requirements", "utility"].map((type) => (
              <div key={type} className="flex flex-col gap-1">
                <span className="font-medium capitalize">{type}.py / .csv / .txt</span>
                <Input 
                  type="file"
                  onChange={(e) => handleFileChange(e, type)}
                  className="border rounded-md px-3 py-2 bg-white"
                />
                {fileInputs[type] && (
                  <span className="text-sm text-[#721c24]/80">{fileInputs[type].name}</span>
                )}
              </div>
            ))}
          </div>

          {/* Start Button */}
          <Button onClick={handleStart} className="w-full bg-[#721c24] text-white hover:bg-[#5a141a]">
            Start Task
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
