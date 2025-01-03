import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to the Task Management System</h1>
      <p>Manage your tasks efficiently with our MERN-based solution.</p>
      <div style={styles.buttonContainer}>
        <Link to="/login" style={styles.button}>
          Login
        </Link>
        <Link to="/register" style={styles.button}>
          Register
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "20vh",
  },
  buttonContainer: {
    marginTop: "20px",
  },
  button: {
    margin: "10px",
    padding: "10px 20px",
    textDecoration: "none",
    color: "#fff",
    backgroundColor: "#007BFF",
    borderRadius: "5px",
    fontSize: "16px",
  },
};

export default Home;
