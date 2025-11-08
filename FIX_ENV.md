# 🔧 Fix Your .env File

## Current Issue

Your `.env` has:
- `PORT=5001` (backend runs on port 5001)
- `VITE_GEMINI_API_KEY=...` (key is there ✅)

But frontend is calling `localhost:5000` (wrong port!)

## ✅ Fix Option 1: Change PORT back to 5000 (Easiest)

In your `.env` file, change:
```
PORT=5000
```

## ✅ Fix Option 2: Tell frontend to use port 5001

Add this to your `.env` file:
```
VITE_BACKEND_URL=http://localhost:5001
```

## ✅ Recommended .env format:

```
PORT=5000
GEMINI_API_KEY=AIzaSyA-y4Nwsim4Ut4ShGzgiWHQMIRvIxQjFeU
VITE_GEMINI_API_KEY=AIzaSyA-y4Nwsim4Ut4ShGzgiWHQMIRvIxQjFeU
VITE_OPENAI_API_KEY=sk-proj-...
```

**Note:** Backend uses `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY` (both work)
**Note:** Frontend uses `VITE_GEMINI_API_KEY` for display only

## After fixing .env:

1. **Restart the server:**
   ```bash
   npm run dev
   ```

2. **Check terminal shows:**
   ```
   ✅ Gemini API proxy server running on http://localhost:5000
   ✅ Gemini API key is configured
   ```

3. **Test:** http://localhost:5000/api/health

