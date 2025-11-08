# 🚀 QUICK START - READ THIS FIRST

## Step 1: Create `.env` file

Create a file named `.env` in the `travelmind-ai-view` folder with:

```
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Get your Gemini API key:** https://aistudio.google.com/app/apikey

## Step 2: Install dependencies

```bash
npm install
```

## Step 3: Start the app

```bash
npm run dev
```

This will start BOTH backend and frontend automatically.

## ✅ What you should see:

**Terminal output:**
```
✅ Gemini API proxy server running on http://localhost:5000
✅ Gemini API key is configured
VITE ready in XXX ms
```

**Test backend:** Open http://localhost:5000/api/health in browser
Should show: `{"status":"ok","service":"gemini-proxy"}`

## 🐛 If it doesn't work:

1. **Backend not starting?**
   - Check if port 5000 is in use
   - Make sure `.env` file exists
   - Run `npm install` again

2. **Still not working?**
   - Open browser console (F12)
   - Check for error messages
   - Look at terminal for backend errors

