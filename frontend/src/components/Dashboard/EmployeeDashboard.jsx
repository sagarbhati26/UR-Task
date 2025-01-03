import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get("http://localhost:5000/api/employee/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(res.data);
    };
    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId) => {
    try {
      await axios.put(`http://localhost:5000/api/employee/tasks/${taskId}`, { status: "complete" });
      alert("Task marked as complete!");
    } catch (err) {
      alert("Failed to update task status");
    }
  };

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.description} - {task.status}
            {task.status !== "complete" && (
              <button onClick={() => updateTaskStatus(task.id)}>Mark as Complete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeDashboard;
