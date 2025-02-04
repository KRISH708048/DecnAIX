import React, { useState } from "react";

const SelectMachine = () => {
  const [selectedMachine, setSelectedMachine] = useState("");

  const machines = ["Machine 1", "Machine 2", "Machine 3", "Machine 4"];

  const handleMachineSelect = (e) => {
    setSelectedMachine(e.target.value);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#5B2333]">Select Machine</h2>
      <div className="mt-4">
        <label className="text-lg font-medium">Select a Machine</label>
        <select
          value={selectedMachine}
          onChange={handleMachineSelect}
          className="border border-gray-300 p-2 rounded-lg w-full"
        >
          <option value="" disabled>Select a machine</option>
          {machines.map((machine, index) => (
            <option key={index} value={machine}>
              {machine}
            </option>
          ))}
        </select>
      </div>
      <button
        className="mt-6 bg-[#5B2333] text-white py-2 px-6 rounded-lg hover:bg-[#7a2d42]"
        disabled={!selectedMachine}
      >
        Select Machine
      </button>
    </div>
  );
};

export default SelectMachine;
