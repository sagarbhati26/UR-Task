import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ManagerDashboard from "./components/Dashboard/ManagerDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import NotFound from "./Pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskDetails from "./components/Task/TaskDetails";
import TaskList from "./components/Task/TaskList";

// Helper function for protected routes
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Store user role during login

  if (!token) {
    console.warn("No token found. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (userRole !== role) {
    console.warn("Unauthorized access. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <>
      {/* Toast notifications */}
      <ToastContainer />

      {/* Application Router */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<TaskList />} />
<Route path="/tasks/:taskId" element={<TaskDetails />} />

          {/* Protected Routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
