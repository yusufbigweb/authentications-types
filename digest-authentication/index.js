import express from "express";
import authRoutes from "./routers/auth.routes.js";

const app = express();

// public route
app.get("/", (req, res) => {
  res.send("Public Route");
});

// use routes
app.use("/api", authRoutes);

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});