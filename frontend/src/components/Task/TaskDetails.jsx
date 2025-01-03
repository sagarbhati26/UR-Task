import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TaskDetails = () => {
  const { taskId } = useParams(); // Get task ID from the route parameter
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const updateTaskStatus = async (status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTask((prev) => ({ ...prev, status })); // Update status locally
      alert("Task status updated successfully!");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (!task) {
    return <p className="text-center text-gray-600">Loading task details...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Task Details
        </h2>
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            <strong>Description:</strong> {task.description}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Status:</strong> {task.status}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Assigned By:</strong> {task.assignedBy}
          </p>
          <p className="text-lg text-gray-700">
            <strong>Deadline:</strong> {task.deadline}
          </p>
          {task.status !== "complete" && (
            <button
              onClick={() => updateTaskStatus("complete")}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
