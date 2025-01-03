import React, { useState } from "react";
import axios from "axios";

const AssignTask = () => {
  const [taskDetails, setTaskDetails] = useState({
    description: "",
    email: "",
    deadline: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({ ...taskDetails, [name]: value });
  };

  const assignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/manager/tasks/assign",
        taskDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Task assigned successfully!");
      setTaskDetails({ description: "", email: "", deadline: "" }); // Reset form
    } catch (error) {
      alert("Failed to assign task. Please try again.");
      console.error("Error assigning task:", error);
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
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Task Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Enter task description"
              value={taskDetails.description}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Employee Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter employee's email"
              value={taskDetails.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700"
            >
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={taskDetails.deadline}
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
