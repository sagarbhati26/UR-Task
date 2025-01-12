import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8008/api/v1/tasks/assign", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Your Tasks
        </h2>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-600">No tasks available.</p>
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
                <Link
                  to={`/tasks/${task.id}`}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;
