// Quick test to verify server can start
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "gemini-proxy" });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`🔍 Test: http://localhost:${PORT}/api/health`);
  console.log(`\nPress Ctrl+C to stop`);
});

