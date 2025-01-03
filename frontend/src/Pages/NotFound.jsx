import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/" style={styles.link}>
        Go Back to Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "20vh",
    color: "#333",
  },
  link: {
    marginTop: "20px",
    textDecoration: "none",
    color: "#007BFF",
    fontSize: "18px",
  },
};

export default NotFound;
