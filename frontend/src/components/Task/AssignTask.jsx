import React, { useState } from "react";
import axios from "axios";

const AssignTask = () => {
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    assignedTo: "", 
    dueDate: "",
    createdBy:localStorage.getItem("UserEmail")

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({ ...taskDetails, [name]: value });
  };

  const assignTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8008/api/v1/tasks/assign",
        taskDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Task assigned successfully!");
     
      // Reset form after successful submission
      setTaskDetails({ title: "", description: "", assignedTo: "", dueDate: "",createdBy:"" });
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Failed to assign task: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("No response from server:", error.request);
        alert("Failed to assign task. No response from server.");
      } else {
        console.error("Error:", error.message);
        alert("Failed to assign task. An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Assign Task
        </h2>
        <form onSubmit={assignTask} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter task title"
              value={taskDetails.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Task Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              value={taskDetails.description}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            ></textarea>
          </div>
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
              Employee Email
            </label>
            <input
              type="email"
              id="assignedTo"
              name="assignedTo" // Updated to match the backend field
              placeholder="Enter employee's email"
              value={taskDetails.assignedTo}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={taskDetails.dueDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div>
          <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700">
              Created By
            </label>
            <input
              type="email"
              id="createdBy"
              name="createdBy" // Updated to match the backend field
              value={taskDetails.createdBy}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
          >
            Assign Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignTask;
