import React, { useState } from "react";

const CreateTask = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const handleSubmit = () => {
    // logic to handle task creation
    console.log("Task Created", { taskName, taskDescription });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#5B2333]">Create Task</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-lg font-medium">Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Enter task name"
          />
        </div>
        <div>
          <label className="text-lg font-medium">Task Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Enter task description"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 bg-[#5B2333] text-white py-2 px-6 rounded-lg hover:bg-[#7a2d42]"
      >
        Create Task
      </button>
    </div>
  );
};

export default CreateTask;
