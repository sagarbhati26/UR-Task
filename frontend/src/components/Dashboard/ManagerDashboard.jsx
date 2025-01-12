import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AssignTask from "../Task/AssignTask";

function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(res.data);
      } catch (err) {
        alert("Failed to fetch tasks");
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manager Dashboard</h2>
          {/* Link to Assign Task */}
          
        <AssignTask/>
         
        </div>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks assigned yet.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                  Task Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 transition-all border-t border-gray-200"
                >
                  <td className="px-6 py-4 text-gray-800">
                    {task.description}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${
                      task.status === "complete"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {task.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;
