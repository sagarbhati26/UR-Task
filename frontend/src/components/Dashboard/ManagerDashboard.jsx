import React, { useEffect, useState } from "react";
import axios from "axios";

function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await axios.get("http://localhost:5000/api/manager/tasks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(res.data);
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Manager Dashboard</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.description} - {task.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default ManagerDashboard;
