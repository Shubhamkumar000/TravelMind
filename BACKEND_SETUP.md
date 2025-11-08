# Backend Server Setup Guide

## Why Backend Server?

Google blocks direct browser calls to Gemini API for security reasons. We need a backend server to proxy the API calls.

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Backend server
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `concurrently` - Run frontend and backend together

### 2. Create `.env` File

Create a `.env` file in the root directory (`travelmind-ai-view/.env`):

```env
# Backend Server Port
PORT=5000

# Gemini API Key (REQUIRED)
# Get your key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Backend URL (for frontend)
# VITE_BACKEND_URL=http://localhost:5000

# Optional: OpenAI API Key (for frontend)
# VITE_OPENAI_API_KEY=sk-your_openai_api_key_here
```

### 3. Start the Backend Server

**Option A: Run backend only**
```bash
npm run dev:server
```

**Option B: Run both frontend and backend together**
```bash
npm run dev:all
```

**Option C: Run separately (in two terminals)**
```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev
```

### 4. Verify Backend is Running

You should see:
```
✅ Gemini API proxy server running on http://localhost:5000
📝 Make sure GEMINI_API_KEY is set in .env file
```

Test the health endpoint:
```
http://localhost:5000/api/health
```

## How It Works

1. **Frontend (React)** calls `http://localhost:5000/api/gemini`
2. **Backend (Express)** receives the request and calls Google's Gemini API
3. **Backend** returns the response to the frontend
4. **API key stays secure** in the backend `.env` file

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Make sure `.env` file exists with `GEMINI_API_KEY`
- Run `npm install` to ensure all dependencies are installed

### CORS errors
- Make sure backend is running on port 5000
- Check that `cors` middleware is enabled in `server.js`

### 404 errors
- Verify your Gemini API key is correct
- Check that the backend server is running
- Look at backend console logs for error messages

## API Endpoints

- `POST /api/gemini` - Generate content using Gemini API
  - Body: `{ "prompt": "your prompt", "model": "gemini-1.5-flash-latest" }`
  - Response: `{ "text": "generated content" }`

- `GET /api/health` - Health check
  - Response: `{ "status": "ok", "service": "gemini-proxy" }`

