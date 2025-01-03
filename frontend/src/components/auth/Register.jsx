import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "employee" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", formData);
      alert("Registered successfully!");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
