import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employee/tasks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(res.data);
      } catch (err) {
        alert("Failed to fetch tasks");
      }
    };
    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/employee/tasks/${taskId}`,
        { status: "complete" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Task marked as complete!");
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: "complete" } : task
        )
      );
    } catch (err) {
      alert("Failed to update task status");
    }
  };

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
                key={task.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {task.description}
                  </p>
                  <p className="text-sm text-gray-500">Status: {task.status}</p>
                </div>
                {task.status !== "complete" && (
                  <button
                    onClick={() => updateTaskStatus(task.id)}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
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
