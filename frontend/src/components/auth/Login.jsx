import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // React Router's useNavigate hook


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // React Router's useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:8008/api/v1/users/login", {
        email,
        password,
      });
  
      // Extract the role from res.data
      const {accessToken, user } = res.data.data;
      console.log(user);
  
      // Save token and role in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("UserRole", user.role);
      localStorage.setItem("UserEmail", user.email);
       // Use role from res.data
  
      // Navigate based on role
      if (user.role === "manager") {
        navigate("/manager/assign-task") // Update route to match your routing
      } else if (user.role === "employee") {
        navigate("/employee"); // Update route to match your routing
      } else {
        console.error("Unknown role detected:", role);
        alert("Unknown role. Please contact support.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Login failed. Please check your credentials.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
