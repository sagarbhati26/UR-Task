import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ManagerDashboard from "./components/Dashboard/ManagerDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import AssignTask from "./components/Task/AssignTask";

import NotFound from "./Pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function for protected routes
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  console.log("Protected Route: Token", token);
  console.log("Protected Route: User Role", userRole);

  if (!token) {
    console.warn("No token found. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  if (userRole !== role) {
    console.warn(`Unauthorized access. Required role: ${role}, User role: ${userRole}`);
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


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
          <Route
            path="/manager/assign-task"
            element={
              <ProtectedRoute role="manager">
                <AssignTask />
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
