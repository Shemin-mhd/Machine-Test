import path from "path";
import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config({ path: path.join(__dirname, "../../.env") });


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});