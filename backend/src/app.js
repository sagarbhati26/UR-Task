// import express from "express";
// import userRoutes from "./routes/userRoutes.js"; 
// import cors from 'cors'
// const app = express();

// // Middleware setup
// app.use(cors({
//   origin:process.env.CORS_ORIGIN,
//   credentials:true
// }))

// // Define routes
// app.use("/api/v1/users", userRoutes);

// // Example route for testing the server
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // Export the app
// export default app;

import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Middleware for CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// Define routes
app.use("/api/v1/users", userRoutes);

// Example route for testing the server
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Export the app
export default app;
