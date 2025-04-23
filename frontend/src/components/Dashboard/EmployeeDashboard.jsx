import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Get user email and role from localStorage or auth state
        const UserEmail = localStorage.getItem("UserEmail");
        const UserRole = localStorage.getItem("UserRole");

        console.log("Fetching tasks for:", UserEmail, UserRole); // Debugging

        if (!UserEmail || !UserRole) {
          setError("User details are missing. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.post(
          `http://localhost:8008/api/v1/tasks/gettasks`,
          {
            email: UserEmail,
            role: UserRole
          },
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            },
          }
        );

        console.log("API Response:", res.data); // Debugging

        // Ensure response contains tasks
        if (res.data.success && Array.isArray(res.data.data)) {
          setTasks(res.data.data);
        } else {
          setError("No tasks found.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // No dependencies to ensure it only runs once

  const updateTaskStatus = async (taskId) => {
    try {
      const res = await axios.put(
        `http://localhost:8008/api/v1/tasks/${taskId}/status`,
        { status: "completed" },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (res.data.success) {
        alert("Task marked as completed!");
        // Update state to reflect task completion
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: "completed" } : task
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update task status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Employee Dashboard
        </h2>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks assigned yet.</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-800">
                    {task.title}
                  </h3>
                  <p className="text-gray-600">{task.description}</p>
                  <div className="mt-2 space-x-4 text-sm text-gray-500">
                    <span>Status: {task.status}</span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                {task.status !== "completed" && (
                  <button
                    onClick={() => updateTaskStatus(task._id)}
                    className="ml-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
                  >
                    Mark as Complete
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
