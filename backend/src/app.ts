import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRouter);

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is Running 🚀",
  });
});

export default app;