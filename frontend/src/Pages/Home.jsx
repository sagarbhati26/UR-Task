import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Task Management System
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage your tasks efficiently with our MERN-based solution.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring focus:ring-green-300 focus:outline-none"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
