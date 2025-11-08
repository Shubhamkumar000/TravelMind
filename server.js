// Backend server for Gemini API proxy
// This prevents CORS issues and keeps API keys secure
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// Read PORT from .env, default to 5000
const PORT = process.env.PORT || process.env.VITE_BACKEND_PORT || 5000;

// Middleware - CORS configured for frontend on port 8080
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080', 'http://localhost:5000', 'http://localhost:5001'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`, {
    body: req.method === 'POST' ? { ...req.body, prompt: req.body.prompt?.substring(0, 50) + '...' } : undefined
  });
  next();
});

// Gemini API proxy endpoint
// Uses v1 stable API with -latest model names
app.post("/api/gemini", async (req, res) => {
  // Default to flash-latest for faster responses, fallback to pro-latest
  const { prompt, model = "gemini-1.5-flash-latest" } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key not configured" });
  }

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Use v1 (stable) instead of v1beta
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    console.log(`Calling Gemini API with model: ${model} (v1 stable API)`);
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      console.error(`Gemini API error: ${errorMessage}`);
      return res.status(response.status).json({ 
        error: errorMessage,
        details: errorData.error 
      });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (!text) {
      return res.status(500).json({ error: "No content in Gemini response" });
    }

    res.json({ text });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "gemini-proxy" });
});

app.listen(PORT, () => {
  console.log(`✅ Gemini API proxy server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure GEMINI_API_KEY is set in .env file`);
  console.log(`🌐 CORS enabled for: http://localhost:8080, http://localhost:5173`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  
  // Check if API key is set
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.warn(`⚠️  WARNING: GEMINI_API_KEY not found in .env file!`);
    console.warn(`   Add this to your .env file: GEMINI_API_KEY=your_key_here`);
  } else {
    console.log(`✅ Gemini API key is configured (${GEMINI_API_KEY.substring(0, 10)}...)`);
  }
});

