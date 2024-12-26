import express from "express";

const app = express();

// Middleware setup, routes, etc.
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
