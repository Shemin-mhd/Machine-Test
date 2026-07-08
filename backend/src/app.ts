import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://machine-test-bx31.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is Running 🚀",
  });
});

export default app;